# Task 18: Create Email Templates - Learning Log

## Date
2025-12-11

## Key Learnings

### 1. Email Template Architecture Pattern
**Pattern:** Centralize templates with typed parameters

```typescript
// Template function returns HTML, text, and subject
export function templateName(params: {
  name: string;
  url: string;
}): { html: string; text: string; subject: string } {
  const html = baseTemplate(`...${params.name}...`);
  const text = `Plain text version...`;
  return { html, text, subject: 'Email Subject' };
}
```

Benefits:
- Type safety for template parameters
- Consistent return structure
- Easy testing

### 2. Base Template Pattern
**Pattern:** Wrap all emails in consistent base template

```typescript
function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
  <head><!-- Meta, styles --></head>
  <body>
    <table>
      <!-- Header with logo -->
      <tr><td>${content}</td></tr>
      <!-- Footer with links -->
    </table>
  </body>
</html>
  `;
}
```

### 3. Reusable Components
**Pattern:** Create helper functions for common elements

```typescript
function ctaButton(text: string, url: string): string {
  return `
<table align="center">
  <tr>
    <td style="background: #2563eb; border-radius: 8px;">
      <a href="${url}" style="color: white; padding: 14px 28px;">
        ${text}
      </a>
    </td>
  </tr>
</table>
  `;
}

function infoBox(content: string): string {
  return `
<table style="background: #f3f4f6; border-radius: 8px;">
  <tr>
    <td style="padding: 20px;">${content}</td>
  </tr>
</table>
  `;
}
```

### 4. Email-Safe HTML
**Pattern:** Use table-based layouts for email

```html
<!-- DON'T: Flexbox/Grid (not supported) -->
<div style="display: flex;">

<!-- DO: Tables -->
<table role="presentation" width="100%">
  <tr>
    <td>Content</td>
  </tr>
</table>
```

Key rules:
- Use tables for layout
- Inline all styles
- Use `role="presentation"` for layout tables
- Max width 600px for compatibility
- Use web-safe fonts

### 5. MSO Conditionals
**Pattern:** Handle Outlook quirks

```html
<!--[if mso]>
<noscript>
  <xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
</noscript>
<![endif]-->
```

### 6. Plain Text Alternatives
**Pattern:** Always include text version

```typescript
const text = `
Subject Line

Hi ${firstName},

Message content here...

Link: ${url}

Footer text
`.trim();
```

Benefits:
- Accessibility
- Spam filter compliance
- Fallback for blocked HTML

### 7. Brand Color Constants
**Pattern:** Define colors once

```typescript
const BRAND_PRIMARY = '#2563eb';
const BRAND_DARK = '#1e3a8a';
const TEXT_PRIMARY = '#333333';
const TEXT_SECONDARY = '#6b7280';
const BG_LIGHT = '#f3f4f6';
```

### 8. Dynamic Urgency Colors
**Pattern:** Color based on urgency

```typescript
const urgencyColor = daysRemaining <= 3
  ? '#dc2626'  // Red - urgent
  : daysRemaining <= 7
    ? '#f59e0b'  // Orange - warning
    : '#1e3a8a'; // Blue - normal
```

### 9. Email Service Pattern
**Pattern:** Centralized send with convenience functions

```typescript
// Core send function
export async function sendEmail(options: EmailOptions) {
  if (!resend) {
    console.log('Email not sent:', options.subject);
    return { success: false };
  }
  return resend.emails.send({ ... });
}

// Convenience function
export async function sendWelcomeEmail(email: string, name: string) {
  const template = welcomeEmail({ name, loginUrl });
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}
```

### 10. Graceful Degradation
**Pattern:** Handle missing email service

```typescript
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail(options) {
  if (!resend) {
    console.log('Email not sent (Resend not configured):', options.subject);
    return { success: false, error: 'Email service not configured' };
  }
  // ... send email
}
```

## Best Practices Established

1. **Typed templates** - Use TypeScript for template params
2. **Base template** - Consistent header/footer
3. **Inline styles** - Required for email clients
4. **Table layout** - Only reliable cross-client layout
5. **Plain text** - Always include alternative
6. **Graceful fallback** - Handle missing API keys
7. **Reusable components** - DRY for buttons, boxes
8. **Brand constants** - Single source of truth

## Email Template Checklist

```
[ ] DOCTYPE and charset
[ ] Viewport meta tag
[ ] MSO conditionals
[ ] Table-based layout
[ ] Inline styles
[ ] 600px max width
[ ] Web-safe fonts
[ ] Plain text version
[ ] Personalization
[ ] Clear CTA
[ ] Unsubscribe link (if marketing)
[ ] Brand header
[ ] Contact footer
```
