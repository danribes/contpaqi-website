# Task 13: Build Contact Page with Form - Learning Log

## Date
2025-12-11

## Key Learnings

### 1. Prisma Schema Changes Require Client Regeneration
**Pattern:** Always regenerate after schema changes

```bash
# After modifying prisma/schema.prisma
npx prisma generate
```

Without this, TypeScript will complain about missing fields in Prisma types.

### 2. Form State Management Pattern
**Pattern:** Multiple states for form lifecycle

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    const response = await fetch('/api/contact', { ... });
    if (!response.ok) throw new Error();
    setSubmitted(true);
  } catch {
    setError(t('form.error'));
  } finally {
    setIsSubmitting(false);
  }
};
```

### 3. Optional FormData Fields
**Pattern:** Handle optional fields with fallback

```typescript
const data = {
  name: formData.get('name') as string,
  email: formData.get('email') as string,
  company: formData.get('company') as string || undefined,
  phone: formData.get('phone') as string || undefined,
  subject: formData.get('subject') as string,
  message: formData.get('message') as string,
};
```

Use `|| undefined` for optional fields to send undefined instead of empty string.

### 4. Input with Icon Prefix
**Pattern:** Absolute positioning for icons

```tsx
<div className="relative">
  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  <input type="tel" className="input pl-10" />
</div>
```

Key points:
- Parent has `relative` positioning
- Icon uses `absolute` with vertical centering
- Input has `pl-10` (40px) padding to accommodate icon

### 5. Error Display Component
**Pattern:** Inline alert with icon

```tsx
{error && (
  <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
    <AlertCircle className="h-5 w-5 flex-shrink-0" />
    <span>{error}</span>
  </div>
)}
```

Use `flex-shrink-0` on icon to prevent it from shrinking.

### 6. Resettable Success State
**Pattern:** Allow sending another message

```tsx
const handleSendAnother = () => {
  setSubmitted(false);
  setError(null);
};

{submitted ? (
  <SuccessMessage>
    <button onClick={handleSendAnother}>
      {t('form.success.sendAnother')}
    </button>
  </SuccessMessage>
) : (
  <Form />
)}
```

### 7. Email Conditional Content
**Pattern:** Fallback for optional fields in email

```typescript
`<td>${data.phone || 'Not provided'}</td>`
```

Always provide fallback text for optional fields in emails.

### 8. Zod Enum Validation
**Pattern:** Restrict to specific values

```typescript
const contactSchema = z.object({
  subject: z.enum(['sales', 'support', 'enterprise', 'other']),
});
```

Matches with select options in form:
```tsx
<option value="sales">Sales inquiry</option>
<option value="support">Technical support</option>
<option value="enterprise">Enterprise solutions</option>
<option value="other">Other</option>
```

### 9. i18n for Error Messages
**Pattern:** Use translations for errors

```typescript
catch (err) {
  setError(t('form.error'));  // Uses translated error message
}
```

Add error translations to both locale files:
```json
{
  "form": {
    "error": "Failed to submit. Please try again."
  }
}
```

### 10. HTML5 Form Validation
**Pattern:** Use built-in validation attributes

```tsx
<input type="email" required />
<textarea minLength={10} required />
<select required>
  <option value="">Select...</option>
</select>
```

Benefits:
- Browser-native validation UI
- Accessibility support
- No JavaScript required for basic validation

## Best Practices Established

1. **State machine for forms** - Track submitting, submitted, error states
2. **Prisma regeneration** - Always regenerate after schema changes
3. **Optional field handling** - Use `|| undefined` for clean API
4. **Icon positioning** - Relative parent, absolute icon, padded input
5. **Error display** - Inline alerts with icons and flex layout
6. **Reset capability** - Allow users to submit again after success
7. **i18n for errors** - Translate all user-facing messages
8. **HTML5 validation** - Use built-in browser validation

## Common Patterns Reference

### Form Template
```tsx
'use client';
import { useState } from 'react';

export default function FormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit logic
      setSubmitted(true);
    } catch {
      setError('Error message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return submitted ? <Success /> : <Form onSubmit={handleSubmit} />;
}
```

### API Route Template
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const schema = z.object({ ... });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await db.model.create({ data });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
```
