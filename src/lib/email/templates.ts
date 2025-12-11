/**
 * Email Templates for ContPAQi AI Bridge
 *
 * Responsive HTML email templates with consistent branding
 */

// Brand colors
const BRAND_PRIMARY = '#2563eb';
const BRAND_DARK = '#1e3a8a';
const TEXT_PRIMARY = '#333333';
const TEXT_SECONDARY = '#6b7280';
const TEXT_MUTED = '#9ca3af';
const BG_LIGHT = '#f3f4f6';
const BORDER_COLOR = '#e5e7eb';

/**
 * Base email template wrapper
 */
function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>ContPAQi AI Bridge</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <style>
      body { margin: 0; padding: 0; }
      table { border-collapse: collapse; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      a { color: ${BRAND_PRIMARY}; text-decoration: none; }
      @media only screen and (max-width: 600px) {
        .container { width: 100% !important; padding: 10px !important; }
        .content { padding: 20px !important; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9fafb;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%;">
            <!-- Header -->
            <tr>
              <td align="center" style="padding-bottom: 30px;">
                <div style="display: inline-block; background: ${BRAND_PRIMARY}; color: white; font-weight: bold; padding: 14px 20px; border-radius: 10px; font-size: 20px; letter-spacing: 0.5px;">
                  ContPAQi AI Bridge
                </div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <tr>
                    <td class="content" style="padding: 40px;">
                      ${content}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding-top: 30px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" style="padding-bottom: 15px;">
                      <a href="https://contpaqi-ai-bridge.com" style="color: ${TEXT_SECONDARY}; font-size: 14px;">Website</a>
                      <span style="color: ${TEXT_MUTED}; margin: 0 10px;">|</span>
                      <a href="mailto:support@contpaqi-ai-bridge.com" style="color: ${TEXT_SECONDARY}; font-size: 14px;">Support</a>
                      <span style="color: ${TEXT_MUTED}; margin: 0 10px;">|</span>
                      <a href="https://contpaqi-ai-bridge.com/docs" style="color: ${TEXT_SECONDARY}; font-size: 14px;">Documentation</a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="color: ${TEXT_MUTED}; font-size: 12px; line-height: 1.5;">
                      &copy; ${new Date().getFullYear()} ContPAQi AI Bridge. All rights reserved.<br>
                      Made with ❤️ for Mexican businesses
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

/**
 * Primary CTA button
 */
function ctaButton(text: string, url: string): string {
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 30px auto;">
  <tr>
    <td style="border-radius: 8px; background: ${BRAND_PRIMARY};">
      <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
        ${text}
      </a>
    </td>
  </tr>
</table>
  `.trim();
}

/**
 * Info box (gray background)
 */
function infoBox(content: string): string {
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
  <tr>
    <td style="background: ${BG_LIGHT}; border-radius: 8px; padding: 20px;">
      ${content}
    </td>
  </tr>
</table>
  `.trim();
}

/**
 * License key box
 */
function licenseKeyBox(licenseKey: string): string {
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
  <tr>
    <td style="background: ${BG_LIGHT}; border-radius: 8px; padding: 20px;">
      <p style="margin: 0 0 10px; color: ${TEXT_SECONDARY}; font-size: 14px; font-weight: 600;">Your License Key</p>
      <div style="background: #ffffff; border: 2px dashed #d1d5db; border-radius: 6px; padding: 16px; font-family: 'Courier New', monospace; font-size: 18px; text-align: center; letter-spacing: 2px; color: ${TEXT_PRIMARY};">
        ${licenseKey}
      </div>
      <p style="margin: 12px 0 0; color: ${TEXT_SECONDARY}; font-size: 13px;">
        Keep this key safe - you'll need it to activate the software.
      </p>
    </td>
  </tr>
</table>
  `.trim();
}

// ============================================
// EMAIL TEMPLATES
// ============================================

/**
 * Welcome email - sent when a new user registers
 */
export function welcomeEmail(params: {
  name: string;
  loginUrl: string;
}): { html: string; text: string; subject: string } {
  const { name, loginUrl } = params;
  const firstName = name.split(' ')[0];

  const html = baseTemplate(`
    <h1 style="color: ${BRAND_DARK}; font-size: 28px; margin: 0 0 20px; font-weight: 700;">
      Welcome to ContPAQi AI Bridge! 🎉
    </h1>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Hi ${firstName},
    </p>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Thank you for creating an account. You're now ready to automate your invoice processing with AI.
    </p>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 10px;">
      <strong>What you can do with ContPAQi AI Bridge:</strong>
    </p>

    <ul style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.8; margin: 0 0 20px; padding-left: 20px;">
      <li>Extract data from PDF invoices with 99%+ accuracy</li>
      <li>Validate RFC and CFDI compliance automatically</li>
      <li>Post entries directly to ContPAQi</li>
      <li>Process invoices 10x faster than manual entry</li>
    </ul>

    ${ctaButton('Go to Portal', loginUrl)}

    <p style="color: ${TEXT_SECONDARY}; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
      Need help getting started? Check out our <a href="https://contpaqi-ai-bridge.com/docs" style="color: ${BRAND_PRIMARY};">documentation</a> or <a href="mailto:support@contpaqi-ai-bridge.com" style="color: ${BRAND_PRIMARY};">contact support</a>.
    </p>
  `);

  const text = `
Welcome to ContPAQi AI Bridge!

Hi ${firstName},

Thank you for creating an account. You're now ready to automate your invoice processing with AI.

What you can do with ContPAQi AI Bridge:
- Extract data from PDF invoices with 99%+ accuracy
- Validate RFC and CFDI compliance automatically
- Post entries directly to ContPAQi
- Process invoices 10x faster than manual entry

Go to Portal: ${loginUrl}

Need help getting started? Visit our documentation at https://contpaqi-ai-bridge.com/docs

If you have any questions, please contact our support team at support@contpaqi-ai-bridge.com
  `.trim();

  return {
    html,
    text,
    subject: 'Welcome to ContPAQi AI Bridge! 🎉',
  };
}

/**
 * Purchase confirmation / License delivery email
 */
export function purchaseConfirmationEmail(params: {
  name?: string;
  planName: string;
  licenseKey: string;
  downloadUrl: string;
  amount?: number;
  currency?: string;
}): { html: string; text: string; subject: string } {
  const { name, planName, licenseKey, downloadUrl, amount, currency } = params;
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hello,';

  const html = baseTemplate(`
    <h1 style="color: ${BRAND_DARK}; font-size: 28px; margin: 0 0 20px; font-weight: 700;">
      Thank You for Your Purchase! ✨
    </h1>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      ${greeting}
    </p>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Your purchase of <strong>${planName}</strong> has been confirmed.${amount ? ` Amount charged: <strong>${currency || 'USD'} ${(amount / 100).toFixed(2)}</strong>` : ''}
    </p>

    ${licenseKeyBox(licenseKey)}

    <h3 style="color: ${TEXT_PRIMARY}; font-size: 18px; margin: 30px 0 15px; font-weight: 600;">
      Getting Started
    </h3>

    <ol style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.8; margin: 0 0 20px; padding-left: 20px;">
      <li>Download the installer from your customer portal</li>
      <li>Run the installer and follow the setup wizard</li>
      <li>Enter your license key when prompted</li>
      <li>Start processing invoices with AI!</li>
    </ol>

    ${ctaButton('Download Software', downloadUrl)}

    <p style="color: ${TEXT_SECONDARY}; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
      If you have any questions, please contact our support team at <a href="mailto:support@contpaqi-ai-bridge.com" style="color: ${BRAND_PRIMARY};">support@contpaqi-ai-bridge.com</a>
    </p>
  `);

  const text = `
Thank You for Your Purchase!

${greeting}

Your purchase of ${planName} has been confirmed.${amount ? ` Amount charged: ${currency || 'USD'} ${(amount / 100).toFixed(2)}` : ''}

Your License Key: ${licenseKey}

Keep this key safe - you'll need it to activate the software.

Getting Started:
1. Download the installer from your customer portal
2. Run the installer and follow the setup wizard
3. Enter your license key when prompted
4. Start processing invoices with AI!

Download: ${downloadUrl}

If you have any questions, please contact our support team at support@contpaqi-ai-bridge.com
  `.trim();

  return {
    html,
    text,
    subject: 'Your ContPAQi AI Bridge License Key',
  };
}

/**
 * Password reset email
 */
export function passwordResetEmail(params: {
  resetUrl: string;
  expiresIn?: string;
}): { html: string; text: string; subject: string } {
  const { resetUrl, expiresIn = '1 hour' } = params;

  const html = baseTemplate(`
    <h1 style="color: ${BRAND_DARK}; font-size: 28px; margin: 0 0 20px; font-weight: 700;">
      Reset Your Password
    </h1>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      We received a request to reset your password for your ContPAQi AI Bridge account.
    </p>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Click the button below to create a new password:
    </p>

    ${ctaButton('Reset Password', resetUrl)}

    ${infoBox(`
      <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 14px;">
        ⏰ This link will expire in <strong>${expiresIn}</strong>.<br>
        If you didn't request a password reset, you can safely ignore this email.
      </p>
    `)}

    <p style="color: ${TEXT_SECONDARY}; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
      If the button doesn't work, copy and paste this URL into your browser:<br>
      <a href="${resetUrl}" style="color: ${BRAND_PRIMARY}; word-break: break-all;">${resetUrl}</a>
    </p>
  `);

  const text = `
Reset Your Password

We received a request to reset your password for your ContPAQi AI Bridge account.

Click the link below to create a new password:
${resetUrl}

This link will expire in ${expiresIn}. If you didn't request a password reset, you can safely ignore this email.

If you have any questions, please contact our support team at support@contpaqi-ai-bridge.com
  `.trim();

  return {
    html,
    text,
    subject: 'Reset Your Password - ContPAQi AI Bridge',
  };
}

/**
 * Subscription renewed email
 */
export function renewalConfirmationEmail(params: {
  licenseKey: string;
  expiresAt: Date;
  planName?: string;
}): { html: string; text: string; subject: string } {
  const { licenseKey, expiresAt, planName } = params;
  const formattedDate = expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = baseTemplate(`
    <h1 style="color: #059669; font-size: 28px; margin: 0 0 20px; font-weight: 700;">
      Subscription Renewed! ✓
    </h1>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Your ContPAQi AI Bridge${planName ? ` ${planName}` : ''} subscription has been successfully renewed.
    </p>

    ${infoBox(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="padding: 5px 0;">
            <span style="color: ${TEXT_SECONDARY}; font-size: 14px;">License Key:</span><br>
            <span style="color: ${TEXT_PRIMARY}; font-family: monospace; font-size: 14px;">${licenseKey}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 0;">
            <span style="color: ${TEXT_SECONDARY}; font-size: 14px;">Valid Until:</span><br>
            <span style="color: ${TEXT_PRIMARY}; font-size: 16px; font-weight: 600;">${formattedDate}</span>
          </td>
        </tr>
      </table>
    `)}

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 20px 0;">
      Thank you for continuing to use ContPAQi AI Bridge! You have uninterrupted access to:
    </p>

    <ul style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.8; margin: 0 0 20px; padding-left: 20px;">
      <li>AI-powered invoice processing</li>
      <li>Automatic ContPAQi integration</li>
      <li>Software updates and improvements</li>
      <li>Priority technical support</li>
    </ul>

    <p style="color: ${TEXT_SECONDARY}; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
      If you have any questions, please contact our support team at <a href="mailto:support@contpaqi-ai-bridge.com" style="color: ${BRAND_PRIMARY};">support@contpaqi-ai-bridge.com</a>
    </p>
  `);

  const text = `
Subscription Renewed!

Your ContPAQi AI Bridge${planName ? ` ${planName}` : ''} subscription has been successfully renewed.

License Key: ${licenseKey}
Valid Until: ${formattedDate}

Thank you for continuing to use ContPAQi AI Bridge!

If you have any questions, please contact our support team at support@contpaqi-ai-bridge.com
  `.trim();

  return {
    html,
    text,
    subject: 'Your ContPAQi AI Bridge Subscription Has Been Renewed',
  };
}

/**
 * Payment failed email
 */
export function paymentFailedEmail(params: {
  amount: number;
  currency: string;
  invoiceUrl?: string;
}): { html: string; text: string; subject: string } {
  const { amount, currency, invoiceUrl } = params;

  const html = baseTemplate(`
    <h1 style="color: #dc2626; font-size: 28px; margin: 0 0 20px; font-weight: 700;">
      Payment Failed
    </h1>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      We were unable to process your payment of <strong>${currency} ${amount.toFixed(2)}</strong> for your ContPAQi AI Bridge subscription.
    </p>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Please update your payment method to continue using ContPAQi AI Bridge without interruption.
    </p>

    ${invoiceUrl ? ctaButton('Update Payment Method', invoiceUrl) : ''}

    ${infoBox(`
      <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 14px;">
        ⚠️ If payment is not received within 7 days, your license will be suspended and you won't be able to process invoices.
      </p>
    `)}

    <p style="color: ${TEXT_SECONDARY}; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
      If you believe this is an error or need assistance, please contact our support team at <a href="mailto:support@contpaqi-ai-bridge.com" style="color: ${BRAND_PRIMARY};">support@contpaqi-ai-bridge.com</a>
    </p>
  `);

  const text = `
Payment Failed

We were unable to process your payment of ${currency} ${amount.toFixed(2)} for your ContPAQi AI Bridge subscription.

Please update your payment method to continue using ContPAQi AI Bridge without interruption.

${invoiceUrl ? `Update Payment: ${invoiceUrl}` : ''}

If payment is not received within 7 days, your license will be suspended.

If you have any questions, please contact our support team at support@contpaqi-ai-bridge.com
  `.trim();

  return {
    html,
    text,
    subject: 'Action Required: Payment Failed for ContPAQi AI Bridge',
  };
}

/**
 * License expiring reminder email
 */
export function licenseExpiringEmail(params: {
  licenseKey: string;
  expiresAt: Date;
  renewUrl: string;
  daysRemaining: number;
}): { html: string; text: string; subject: string } {
  const { licenseKey, expiresAt, renewUrl, daysRemaining } = params;
  const formattedDate = expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const urgencyColor = daysRemaining <= 3 ? '#dc2626' : daysRemaining <= 7 ? '#f59e0b' : BRAND_DARK;

  const html = baseTemplate(`
    <h1 style="color: ${urgencyColor}; font-size: 28px; margin: 0 0 20px; font-weight: 700;">
      Your License Expires in ${daysRemaining} Day${daysRemaining === 1 ? '' : 's'}
    </h1>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Your ContPAQi AI Bridge license will expire on <strong>${formattedDate}</strong>.
    </p>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 10px;">
      Renew now to ensure uninterrupted access to:
    </p>

    <ul style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.8; margin: 0 0 20px; padding-left: 20px;">
      <li>AI-powered invoice processing</li>
      <li>Automatic ContPAQi integration</li>
      <li>Software updates and improvements</li>
      <li>Technical support</li>
    </ul>

    ${ctaButton('Renew License', renewUrl)}

    ${infoBox(`
      <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 14px;">
        <strong>License Key:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px;">${licenseKey}</code>
      </p>
    `)}

    <p style="color: ${TEXT_SECONDARY}; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
      If you have any questions, please contact our support team at <a href="mailto:support@contpaqi-ai-bridge.com" style="color: ${BRAND_PRIMARY};">support@contpaqi-ai-bridge.com</a>
    </p>
  `);

  const text = `
Your License Expires in ${daysRemaining} Day${daysRemaining === 1 ? '' : 's'}

Your ContPAQi AI Bridge license will expire on ${formattedDate}.

Renew now to ensure uninterrupted access to:
- AI-powered invoice processing
- Automatic ContPAQi integration
- Software updates and improvements
- Technical support

Renew License: ${renewUrl}

License Key: ${licenseKey}

If you have any questions, please contact our support team at support@contpaqi-ai-bridge.com
  `.trim();

  return {
    html,
    text,
    subject: `Your ContPAQi AI Bridge license expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
  };
}

/**
 * Contact form submission confirmation
 */
export function contactConfirmationEmail(params: {
  name: string;
  subject: string;
}): { html: string; text: string; subject: string } {
  const { name, subject: ticketSubject } = params;
  const firstName = name.split(' ')[0];

  const html = baseTemplate(`
    <h1 style="color: ${BRAND_DARK}; font-size: 28px; margin: 0 0 20px; font-weight: 700;">
      We've Received Your Message
    </h1>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Hi ${firstName},
    </p>

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Thank you for contacting us. We've received your message regarding "<strong>${ticketSubject}</strong>" and our team will get back to you within 24 hours.
    </p>

    ${infoBox(`
      <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 14px;">
        📧 For urgent matters, you can also reach us at <a href="mailto:support@contpaqi-ai-bridge.com" style="color: ${BRAND_PRIMARY};">support@contpaqi-ai-bridge.com</a>
      </p>
    `)}

    <p style="color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.6; margin: 20px 0 0;">
      In the meantime, you might find helpful information in our <a href="https://contpaqi-ai-bridge.com/docs" style="color: ${BRAND_PRIMARY};">documentation</a>.
    </p>
  `);

  const text = `
We've Received Your Message

Hi ${firstName},

Thank you for contacting us. We've received your message regarding "${ticketSubject}" and our team will get back to you within 24 hours.

For urgent matters, you can also reach us at support@contpaqi-ai-bridge.com

In the meantime, you might find helpful information in our documentation at https://contpaqi-ai-bridge.com/docs
  `.trim();

  return {
    html,
    text,
    subject: `We've received your message - ${ticketSubject}`,
  };
}
