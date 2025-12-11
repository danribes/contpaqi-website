import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { Resend } from 'resend';
import { sendContactConfirmation } from '@/lib/email';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  subject: z.enum(['sales', 'support', 'enterprise', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Store in database
    const submission = await db.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      },
    });

    // Send notification email to team
    if (resend) {
      const subjectMap: Record<string, string> = {
        sales: 'Sales Inquiry',
        support: 'Technical Support',
        enterprise: 'Enterprise Solutions',
        other: 'General Inquiry',
      };

      await resend.emails.send({
        from: 'ContPAQi AI Bridge <noreply@contpaqi-ai-bridge.com>',
        to: ['contact@contpaqi-ai-bridge.com'],
        subject: `[${subjectMap[data.subject]}] New contact from ${data.name}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                <h1 style="margin: 0; font-size: 20px;">New Contact Form Submission</h1>
              </div>
              <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${data.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${data.phone || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Company:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${data.company || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Subject:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 14px;">${subjectMap[data.subject]}</span></td>
                  </tr>
                </table>
                <div style="margin-top: 20px;">
                  <strong>Message:</strong>
                  <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 10px; border: 1px solid #e5e7eb;">
                    ${data.message.replace(/\n/g, '<br>')}
                  </div>
                </div>
              </div>
              <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 20px;">
                Submitted at ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </body>
          </html>
        `,
      });

      // Send confirmation email to the user
      await sendContactConfirmation(
        data.email,
        data.name,
        subjectMap[data.subject]
      );
    }

    return NextResponse.json({
      success: true,
      id: submission.id,
    });
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
