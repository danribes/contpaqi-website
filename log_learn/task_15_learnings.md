# Task 15: Build Customer Portal Dashboard - Learning Log

## Date
2025-12-11

## Key Learnings

### 1. Edge Runtime Limitations
**Problem:** bcryptjs doesn't work in Edge Runtime

NextAuth middleware wrapper imports auth.ts which imports bcryptjs, triggering:
```
A Node.js module is loaded ('crypto') which is not supported in the Edge Runtime.
```

**Solution:** Use `getToken` directly instead of auth wrapper:
```typescript
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const isLoggedIn = !!token;
}
```

### 2. Middleware Route Matching
**Pattern:** Use config.matcher for route selection

```typescript
export const config = {
  matcher: ['/portal/:path*', '/auth/:path*'],
};
```

Key points:
- Use `:path*` for all subpaths
- Array allows multiple patterns
- Middleware only runs on matched routes

### 3. Callback URL for Auth Redirects
**Pattern:** Preserve intended destination

```typescript
if (isPortalRoute && !isLoggedIn) {
  const loginUrl = new URL('/auth/login', request.nextUrl.origin);
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
```

### 4. Responsive Sidebar Pattern
**Pattern:** Transform-based mobile sidebar

```tsx
<aside className={`
  fixed inset-y-0 left-0 z-50 w-64
  transform transition-transform duration-200
  lg:translate-x-0
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
`}>
```

Key points:
- Fixed positioning for overlay effect
- Transform for smooth animation
- lg breakpoint shows sidebar permanently
- State toggle for mobile

### 5. Mobile Menu Backdrop
**Pattern:** Click-to-close overlay

```tsx
{sidebarOpen && (
  <div
    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}
```

### 6. Active Route Detection
**Pattern:** Compare pathname for active state

```tsx
const pathname = usePathname();

navigation.map((item) => {
  const isActive = pathname === item.href;
  return (
    <Link
      className={isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600'}
    >
```

### 7. Protected API Routes
**Pattern:** Check session in route handler

```typescript
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Proceed with authenticated request
}
```

### 8. Prisma Nested Includes
**Pattern:** Include relations with conditions

```typescript
const user = await db.user.findUnique({
  where: { id: session.user.id },
  select: {
    licenses: {
      where: { status: { in: ['ACTIVE', 'TRIAL'] } },
      include: {
        machines: { orderBy: { lastSeenAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    },
  },
});
```

### 9. Client-Side Data Fetching Pattern
**Pattern:** useEffect with loading/error states

```typescript
const [data, setData] = useState<Data | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch('/api/portal/user');
      if (!response.ok) throw new Error('Failed');
      setData(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);

if (loading) return <Spinner />;
if (error) return <Error />;
```

### 10. Conditional License Display
**Pattern:** Handle no-license state

```tsx
{license ? (
  <LicenseCard license={license} />
) : (
  <NoLicenseCard>
    <Link href="/pricing">View Plans</Link>
  </NoLicenseCard>
)}
```

## Best Practices Established

1. **Avoid bcrypt in Edge** - Use getToken for middleware
2. **Preserve callbacks** - Include callback URL in auth redirects
3. **Responsive sidebar** - Transform-based animation with backdrop
4. **Protected APIs** - Check session before any data access
5. **Loading states** - Always show loading and error UI
6. **Empty states** - Design for no-data scenarios

## Common Patterns Reference

### Middleware Template
```typescript
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  // Route protection logic
  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*'],
};
```

### Protected API Template
```typescript
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Authenticated logic
}
```

### Dashboard Layout Template
```tsx
export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Backdrop */}
      {sidebarOpen && <Backdrop onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} />

      {/* Main content */}
      <div className="lg:pl-64">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        <main>{children}</main>
      </div>
    </div>
  );
}
```
