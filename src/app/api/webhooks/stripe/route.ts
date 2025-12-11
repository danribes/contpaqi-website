import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { getStripe, getPlanFromPrice, PLANS } from '@/lib/stripe';
import { db } from '@/lib/db';
import { createLicense } from '@/lib/license';
import { sendPurchaseConfirmation } from '@/lib/email';
import { LicenseTier } from '@prisma/client';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_email;
  const plan = session.metadata?.plan as keyof typeof PLANS | undefined;
  const billingPeriod = session.metadata?.billingPeriod || 'monthly';

  if (!email || !plan) {
    console.error('Missing email or plan in checkout session');
    return;
  }

  // Find or create user
  let user = await db.user.findUnique({ where: { email } });

  if (!user) {
    user = await db.user.create({
      data: {
        email,
        name: session.customer_details?.name || undefined,
      },
    });
  }

  // Calculate amount
  const amount = session.amount_total || 0;

  // Create order
  const order = await db.order.create({
    data: {
      userId: user.id,
      status: 'COMPLETED',
      amount,
      currency: session.currency?.toUpperCase() || 'USD',
      tier: plan.toUpperCase() as LicenseTier,
      billingPeriod,
      stripeSessionId: session.id,
      stripePaymentId: session.payment_intent as string,
      completedAt: new Date(),
    },
  });

  // Create license
  const license = await createLicense(
    user.id,
    plan.toUpperCase() as LicenseTier,
    order.id
  );

  // Send confirmation email
  const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal`;
  await sendPurchaseConfirmation(
    email,
    license.key,
    PLANS[plan].name,
    downloadUrl
  );

  console.log(`License created for ${email}: ${license.key}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Find license by subscription metadata or customer
  const plan = subscription.metadata?.plan;

  if (!plan) {
    console.log('No plan in subscription metadata');
    return;
  }

  // Update license status based on subscription status
  const customerId = subscription.customer as string;
  const customer = await getStripe().customers.retrieve(customerId);

  if (customer.deleted) {
    return;
  }

  const user = await db.user.findUnique({
    where: { email: customer.email! },
    include: { licenses: true },
  });

  if (!user) {
    return;
  }

  // Update license expiry based on subscription
  const periodEnd = new Date(subscription.current_period_end * 1000);

  for (const license of user.licenses) {
    if (license.status === 'ACTIVE') {
      await db.license.update({
        where: { id: license.id },
        data: { expiresAt: periodEnd },
      });
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const customer = await getStripe().customers.retrieve(customerId);

  if (customer.deleted) {
    return;
  }

  const user = await db.user.findUnique({
    where: { email: customer.email! },
    include: { licenses: true },
  });

  if (!user) {
    return;
  }

  // Mark licenses as expired
  for (const license of user.licenses) {
    if (license.status === 'ACTIVE') {
      await db.license.update({
        where: { id: license.id },
        data: { status: 'EXPIRED' },
      });
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Store invoice URL for customer access
  if (invoice.subscription && invoice.hosted_invoice_url) {
    const order = await db.order.findFirst({
      where: {
        stripePaymentId: invoice.payment_intent as string,
      },
    });

    if (order) {
      await db.order.update({
        where: { id: order.id },
        data: {
          stripeInvoiceId: invoice.id,
          stripeInvoiceUrl: invoice.hosted_invoice_url,
        },
      });
    }
  }
}

/**
 * Handle invoice.paid for subscription renewals
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Skip if not a subscription invoice or if it's the first invoice
  if (!invoice.subscription || invoice.billing_reason === 'subscription_create') {
    return;
  }

  const customerId = invoice.customer as string;
  if (!customerId) return;

  try {
    const customer = await getStripe().customers.retrieve(customerId);
    if (customer.deleted || !customer.email) return;

    // Find user and extend their license
    const user = await db.user.findUnique({
      where: { email: customer.email },
      include: { licenses: { where: { status: 'ACTIVE' } } },
    });

    if (!user || user.licenses.length === 0) return;

    // Get subscription to find the new period end
    const subscription = await getStripe().subscriptions.retrieve(
      invoice.subscription as string
    );

    const newExpiryDate = new Date(subscription.current_period_end * 1000);

    // Extend all active licenses
    for (const license of user.licenses) {
      await db.license.update({
        where: { id: license.id },
        data: { expiresAt: newExpiryDate },
      });
    }

    // Send renewal confirmation
    await sendRenewalConfirmation(
      customer.email,
      user.licenses[0].key,
      newExpiryDate
    );

    console.log(`License renewed for ${customer.email} until ${newExpiryDate.toISOString()}`);
  } catch (error) {
    console.error('Failed to handle invoice.paid:', error);
  }
}

/**
 * Send renewal confirmation email
 */
async function sendRenewalConfirmation(
  email: string,
  licenseKey: string,
  expiresAt: Date
) {
  const { sendEmail } = await import('@/lib/email');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Subscription Renewed</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background: #2563eb; color: white; font-weight: bold; padding: 12px 16px; border-radius: 8px; font-size: 18px;">
            ContPAQi AI Bridge
          </div>
        </div>

        <h1 style="color: #059669;">Subscription Renewed!</h1>

        <p>Your ContPAQi AI Bridge subscription has been successfully renewed.</p>

        <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0;"><strong>License Key:</strong> ${licenseKey}</p>
          <p style="margin: 10px 0 0;"><strong>Valid Until:</strong> ${expiresAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <p>Thank you for continuing to use ContPAQi AI Bridge!</p>

        <p style="font-size: 14px; color: #6b7280;">
          If you have any questions, please contact our support team at
          <a href="mailto:support@contpaqi-ai-bridge.com" style="color: #2563eb;">support@contpaqi-ai-bridge.com</a>
        </p>

        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px;">
          &copy; ${new Date().getFullYear()} ContPAQi AI Bridge. All rights reserved.
        </p>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Your ContPAQi AI Bridge Subscription Has Been Renewed',
    html,
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.warn('Invoice payment failed:', invoice.id);

  // Get customer email and send notification
  const customerId = invoice.customer as string;
  if (!customerId) return;

  try {
    const customer = await getStripe().customers.retrieve(customerId);
    if (customer.deleted || !customer.email) return;

    // Send payment failed notification
    await sendPaymentFailedNotification(
      customer.email,
      invoice.amount_due / 100,
      invoice.currency?.toUpperCase() || 'USD',
      invoice.hosted_invoice_url || undefined
    );

    console.log(`Payment failed notification sent to ${customer.email}`);
  } catch (error) {
    console.error('Failed to send payment failed notification:', error);
  }
}

/**
 * Send payment failed notification email
 */
async function sendPaymentFailedNotification(
  email: string,
  amount: number,
  currency: string,
  invoiceUrl?: string
) {
  const { sendEmail } = await import('@/lib/email');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Failed</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background: #2563eb; color: white; font-weight: bold; padding: 12px 16px; border-radius: 8px; font-size: 18px;">
            ContPAQi AI Bridge
          </div>
        </div>

        <h1 style="color: #dc2626;">Payment Failed</h1>

        <p>We were unable to process your payment of <strong>${currency} ${amount.toFixed(2)}</strong>.</p>

        <p>Please update your payment method to continue using ContPAQi AI Bridge without interruption.</p>

        ${invoiceUrl ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invoiceUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
            Update Payment Method
          </a>
        </div>
        ` : ''}

        <p style="font-size: 14px; color: #6b7280;">
          If you have any questions, please contact our support team at
          <a href="mailto:support@contpaqi-ai-bridge.com" style="color: #2563eb;">support@contpaqi-ai-bridge.com</a>
        </p>

        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px;">
          &copy; ${new Date().getFullYear()} ContPAQi AI Bridge. All rights reserved.
        </p>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Action Required: Payment Failed for ContPAQi AI Bridge',
    html,
  });
}
