import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
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
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subjectMap[data.subject]}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        `,
      });
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
