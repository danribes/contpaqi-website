# Task 15: Build Customer Portal Dashboard - Implementation Log

## Date
2025-12-11

## Task Description
Create protected customer portal with dashboard showing active licenses, usage statistics, and quick actions.

## Implementation Details

### 1. Auth Middleware
**File:** `src/middleware.ts`

Created middleware using `getToken` from next-auth/jwt to avoid Edge Runtime issues with bcryptjs:

```typescript
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const isPortalRoute = request.nextUrl.pathname.startsWith('/portal');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

  // Redirect unauthenticated users from portal to login
  if (isPortalRoute && !isLoggedIn) {
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth pages to portal
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect('/portal');
  }
}
```

### 2. Portal Layout with Sidebar
**File:** `src/app/portal/layout.tsx`

Created responsive layout with:
- Collapsible sidebar navigation
- Mobile hamburger menu
- Navigation items: Dashboard, Licenses, Download, Billing, Settings
- Back to site link
- Sign out button

Key features:
- Uses `signOut` from next-auth/react
- Active route highlighting based on pathname
- Responsive design with lg breakpoint

### 3. Portal User API
**File:** `src/app/api/portal/user/route.ts`

Created API endpoint to fetch user data with:
- Authentication check using `auth()`
- Fetches user with active/trial licenses and machines
- Returns formatted data for frontend

```typescript
const user = await db.user.findUnique({
  where: { id: session.user.id },
  select: {
    id: true,
    name: true,
    email: true,
    company: true,
    licenses: {
      where: { status: { in: ['ACTIVE', 'TRIAL'] } },
      include: { machines: { orderBy: { lastSeenAt: 'desc' } } },
    },
  },
});
```

### 4. Portal Dashboard Page
**File:** `src/app/portal/page.tsx`

Updated dashboard to:
- Fetch real data from `/api/portal/user`
- Display loading state with spinner
- Show error state if fetch fails
- Display license info (key, plan, machines, expiry)
- Show "No License" state with CTA to pricing
- List activated machines with deactivate button
- Quick actions sidebar
- Account info display

### 5. Schema Updates
**File:** `prisma/schema.prisma`

Added `TRIAL` status to LicenseStatus enum:
```prisma
enum LicenseStatus {
  ACTIVE
  TRIAL
  EXPIRED
  REVOKED
  PENDING
}
```

### 6. Password Utilities
**File:** `src/lib/password.ts`

Moved password utilities to separate file to avoid Edge Runtime issues:
- `hashPassword()`
- `verifyPassword()`
- `generateToken()`

### 7. Translations Updates
Added portal navigation translations:
- `nav.dashboard`, `nav.licenses`, `nav.download`, `nav.billing`, `nav.settings`
- `nav.backToSite`, `nav.signOut`
- `license.trial`, `license.noLicense`, `license.noLicenseMessage`, `license.getPlan`
- `machines.deactivate`

## Files Changed/Created
1. `src/middleware.ts` - Auth middleware with route protection
2. `src/app/portal/layout.tsx` - NEW - Sidebar layout
3. `src/app/portal/page.tsx` - Updated dashboard with real data
4. `src/app/api/portal/user/route.ts` - NEW - User data API
5. `src/lib/password.ts` - NEW - Password utilities
6. `prisma/schema.prisma` - Added TRIAL status
7. `messages/en.json` - Added portal nav translations
8. `messages/es.json` - Added portal nav translations

## Build Status
- **Status:** PASSED
- **Command:** `npm run build`

## Key Technical Decisions
1. Used `getToken` instead of `auth` wrapper in middleware to avoid bcryptjs Edge Runtime issue
2. Separated password utilities to prevent bundling bcrypt in middleware
3. Added TRIAL status for free trial licenses
4. Created responsive sidebar that collapses on mobile
