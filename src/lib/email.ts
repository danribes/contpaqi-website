import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('Missing RESEND_API_KEY - email sending will be disabled');
}

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'ContPAQi AI Bridge <noreply@contpaqi-ai-bridge.com>';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: EmailOptions) {
  if (!resend) {
    console.log('Email not sent (Resend not configured):', options.subject);
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send purchase confirmation email with license key
 */
export async function sendPurchaseConfirmation(
  email: string,
  licenseKey: string,
  planName: string,
  downloadUrl: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Confirmation</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background: #2563eb; color: white; font-weight: bold; padding: 12px 16px; border-radius: 8px; font-size: 18px;">
            ContPAQi AI Bridge
          </div>
        </div>

        <h1 style="color: #1e3a8a; margin-bottom: 20px;">Thank You for Your Purchase!</h1>

        <p>Your purchase of <strong>${planName}</strong> has been confirmed.</p>

        <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Your License Key</h3>
          <div style="background: white; border: 2px dashed #d1d5db; border-radius: 4px; padding: 15px; font-family: monospace; font-size: 18px; text-align: center; letter-spacing: 2px;">
            ${licenseKey}
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
            Keep this key safe - you'll need it to activate the software.
          </p>
        </div>

        <h3 style="color: #374151;">Getting Started</h3>
        <ol style="padding-left: 20px;">
          <li>Download the installer from your customer portal</li>
          <li>Run the installer and follow the setup wizard</li>
          <li>Enter your license key when prompted</li>
          <li>Start processing invoices!</li>
        </ol>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
            Download Software
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

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

  const text = `
Thank You for Your Purchase!

Your purchase of ${planName} has been confirmed.

Your License Key: ${licenseKey}

Keep this key safe - you'll need it to activate the software.

Getting Started:
1. Download the installer from your customer portal
2. Run the installer and follow the setup wizard
3. Enter your license key when prompted
4. Start processing invoices!

Download: ${downloadUrl}

If you have any questions, please contact our support team at support@contpaqi-ai-bridge.com
  `;

  return sendEmail({
    to: email,
    subject: 'Your ContPAQi AI Bridge License Key',
    html,
    text,
  });
}

/**
 * Send license renewal reminder
 */
export async function sendRenewalReminder(
  email: string,
  licenseKey: string,
  expiresAt: Date,
  renewUrl: string
) {
  const daysUntilExpiry = Math.ceil(
    (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>License Renewal Reminder</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background: #2563eb; color: white; font-weight: bold; padding: 12px 16px; border-radius: 8px; font-size: 18px;">
            ContPAQi AI Bridge
          </div>
        </div>

        <h1 style="color: #dc2626;">Your License Expires in ${daysUntilExpiry} Days</h1>

        <p>Your ContPAQi AI Bridge license will expire on <strong>${expiresAt.toLocaleDateString()}</strong>.</p>

        <p>Renew now to ensure uninterrupted access to:</p>
        <ul>
          <li>AI-powered invoice processing</li>
          <li>Automatic ContPAQi integration</li>
          <li>Software updates and improvements</li>
          <li>Technical support</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${renewUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
            Renew License
          </a>
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          License Key: <code>${licenseKey}</code>
        </p>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Your ContPAQi AI Bridge license expires in ${daysUntilExpiry} days`,
    html,
  });
}
