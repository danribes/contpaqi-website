# Task 14: Implement Authentication Pages - Learning Log

## Date
2025-12-11

## Key Learnings

### 1. NextAuth v5 Configuration
**Pattern:** Use handlers export

```typescript
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate credentials, return user or null
      },
    }),
  ],
});
```

Key points:
- Use `handlers` for route handler
- Export `signIn`, `signOut`, `auth` for use in components
- JWT strategy required for credentials provider

### 2. Route Handler Setup
**Pattern:** Simple export of handlers

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
```

### 3. Client-Side signIn
**Pattern:** Use signIn from next-auth/react

```typescript
import { signIn } from 'next-auth/react';

const result = await signIn('credentials', {
  email,
  password,
  redirect: false, // Handle redirect manually
});

if (result?.error) {
  setError('Invalid credentials');
} else {
  router.push('/portal');
  router.refresh();
}
```

### 4. Password Hashing with bcrypt
**Pattern:** Use bcryptjs for cross-platform support

```typescript
import bcrypt from 'bcryptjs';

// Hash password
const hashedPassword = await bcrypt.hash(password, 12);

// Verify password
const passwordMatch = await bcrypt.compare(password, hashedPassword);
```

### 5. Token Generation
**Pattern:** Simple random string generation

```typescript
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
```

### 6. Email Enumeration Prevention
**Pattern:** Always return success for password reset

```typescript
// Check if user exists
const user = await db.user.findUnique({ where: { email } });

// Always return success to prevent email enumeration
if (!user) {
  return NextResponse.json({ success: true });
}

// Continue with actual reset logic...
```

### 7. Token Expiry Handling
**Pattern:** Check expiry and cleanup

```typescript
// Create token with expiry
const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

// Check expiry
if (resetToken.expires < new Date()) {
  await db.passwordResetToken.delete({ where: { id: resetToken.id } });
  return NextResponse.json({ error: 'Token expired' }, { status: 400 });
}

// Delete after use
await db.passwordResetToken.delete({ where: { id: resetToken.id } });
```

### 8. useSearchParams with Suspense
**Pattern:** Wrap component using useSearchParams

```typescript
function FormWithParams() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  // ...
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <FormWithParams />
    </Suspense>
  );
}
```

Required because useSearchParams causes client-side rendering.

### 9. NextAuth Type Extensions
**Pattern:** Extend default types

```typescript
// src/types/next-auth.d.ts
import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
  }
}
```

### 10. JWT Callbacks
**Pattern:** Pass data through callbacks

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user && token.id) {
      session.user.id = token.id as string;
    }
    return session;
  },
}
```

## Best Practices Established

1. **Never store plain passwords** - Always hash with bcrypt
2. **Prevent enumeration** - Return same response regardless of user existence
3. **Token expiry** - Always expire tokens after reasonable time
4. **Cleanup tokens** - Delete after single use
5. **Suspense for client hooks** - Wrap useSearchParams in Suspense
6. **Type extensions** - Extend NextAuth types for custom fields
7. **Error handling** - Consistent error format across auth endpoints

## Security Patterns Reference

### Password Requirements
```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters');
```

### Token Storage
```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  expires   DateTime
  @@unique([email, token])
}
```

### Clean Up Old Tokens
```typescript
// Delete existing tokens before creating new one
await db.passwordResetToken.deleteMany({
  where: { email: data.email },
});
```

## Environment Variables
```env
AUTH_SECRET=your-random-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
```
