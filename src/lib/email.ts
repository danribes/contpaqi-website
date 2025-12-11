import { Resend } from 'resend';
import {
  welcomeEmail,
  purchaseConfirmationEmail,
  passwordResetEmail,
  renewalConfirmationEmail,
  paymentFailedEmail,
  licenseExpiringEmail,
  contactConfirmationEmail,
} from './email/templates';

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

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  loginUrl?: string
) {
  const template = welcomeEmail({
    name,
    loginUrl: loginUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login`,
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send purchase confirmation email with license key
 */
export async function sendPurchaseConfirmation(
  email: string,
  licenseKey: string,
  planName: string,
  downloadUrl: string,
  options?: {
    name?: string;
    amount?: number;
    currency?: string;
  }
) {
  const template = purchaseConfirmationEmail({
    name: options?.name,
    planName,
    licenseKey,
    downloadUrl,
    amount: options?.amount,
    currency: options?.currency,
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  expiresIn?: string
) {
  const template = passwordResetEmail({
    resetUrl,
    expiresIn,
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send renewal confirmation email
 */
export async function sendRenewalConfirmation(
  email: string,
  licenseKey: string,
  expiresAt: Date,
  planName?: string
) {
  const template = renewalConfirmationEmail({
    licenseKey,
    expiresAt,
    planName,
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send payment failed notification
 */
export async function sendPaymentFailedNotification(
  email: string,
  amount: number,
  currency: string,
  invoiceUrl?: string
) {
  const template = paymentFailedEmail({
    amount,
    currency,
    invoiceUrl,
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
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
  const daysRemaining = Math.ceil(
    (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const template = licenseExpiringEmail({
    licenseKey,
    expiresAt,
    renewUrl,
    daysRemaining,
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Send contact form confirmation
 */
export async function sendContactConfirmation(
  email: string,
  name: string,
  subject: string
) {
  const template = contactConfirmationEmail({
    name,
    subject,
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}
