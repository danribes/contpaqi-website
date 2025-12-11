# Task 16: Implement License Management in Portal - Learning Log

## Date
2025-12-11

## Key Learnings

### 1. Ownership Verification Pattern
**Pattern:** Always verify resource ownership before modifications

```typescript
// Find resource with owner info
const machine = await db.machine.findUnique({
  where: { id: machineId },
  include: {
    license: { select: { userId: true } },
  },
});

// Verify ownership
if (machine.license.userId !== session.user.id) {
  return NextResponse.json(
    { error: 'Unauthorized - you do not own this license' },
    { status: 403 }
  );
}
```

Key points:
- Always join to get owner info
- Return 403 (Forbidden) not 401 (Unauthorized) for ownership failures
- Include clear error message

### 2. Expandable Card Pattern
**Pattern:** State-based expansion with Set

```typescript
const [expandedLicenses, setExpandedLicenses] = useState<Set<string>>(new Set());

const toggleLicenseExpanded = (licenseId: string) => {
  setExpandedLicenses((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(licenseId)) {
      newSet.delete(licenseId);
    } else {
      newSet.add(licenseId);
    }
    return newSet;
  });
};

// Auto-expand active licenses on load
useEffect(() => {
  const activeLicenses = licenses
    .filter((l) => l.status === 'ACTIVE' || l.status === 'TRIAL')
    .map((l) => l.id);
  setExpandedLicenses(new Set(activeLicenses));
}, [licenses]);
```

### 3. License Key Masking Pattern
**Pattern:** Show partial key for identification

```typescript
const maskKey = (key: string) => {
  // Show first 4 and last 4 characters
  if (key.length <= 8) return key;
  return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4);
};
```

Better than full masking because:
- Users can identify which key is which
- Provides some context without full exposure

### 4. Copy to Clipboard with Feedback
**Pattern:** Visual feedback for copy action

```typescript
const [copiedKey, setCopiedKey] = useState<string | null>(null);

const copyKey = (key: string, licenseId: string) => {
  navigator.clipboard.writeText(key);
  setCopiedKey(licenseId);
  setTimeout(() => setCopiedKey(null), 2000);
};

// In JSX
{copiedKey === license.id ? (
  <Check className="h-5 w-5 text-green-500" />
) : (
  <Copy className="h-5 w-5 text-gray-500" />
)}
```

### 5. Confirmation Before Destructive Action
**Pattern:** Browser confirm for destructive actions

```typescript
const deactivateMachine = async (machineId: string) => {
  if (!confirm(tLicenses('confirmDeactivate'))) return;

  // Proceed with deactivation
  setDeactivating(machineId);
  // ...
};
```

Consider upgrading to custom modal for:
- Better styling
- More information
- Undo option

### 6. Status Color Mapping
**Pattern:** Centralize status to color mapping

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-700';
    case 'TRIAL':
      return 'bg-yellow-100 text-yellow-700';
    case 'EXPIRED':
    case 'REVOKED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
```

### 7. Multiple Translation Hooks
**Pattern:** Use multiple useTranslations for nested namespaces

```typescript
const t = useTranslations('portal');
const tLicenses = useTranslations('portal.licensesPage');

// Use appropriate hook
<h1>{tLicenses('title')}</h1>
<span>{t('license.active')}</span>
```

### 8. API Response Formatting
**Pattern:** Format dates consistently in API responses

```typescript
const formattedLicenses = licenses.map((license) => ({
  id: license.id,
  // ... other fields
  expiresAt: license.expiresAt?.toISOString() || null,
  activatedAt: license.activatedAt?.toISOString() || null,
  createdAt: license.createdAt.toISOString(),
  machines: license.machines.map((m) => ({
    // ... machine fields
    lastSeenAt: m.lastSeenAt?.toISOString() || null,
    createdAt: m.createdAt.toISOString(),
  })),
}));
```

## Best Practices Established

1. **Verify ownership** - Always check user owns resource before modification
2. **Use 403 for ownership** - Use 403 Forbidden, not 401 Unauthorized
3. **Partial key masking** - Show enough to identify, hide for security
4. **Copy feedback** - Visual confirmation when copying
5. **Confirm destructive** - Always confirm before irreversible actions
6. **Centralize colors** - Keep status-to-style mapping in one place
7. **Format dates in API** - Return ISO strings from API, format in client

## Common Patterns Reference

### Ownership Check Template
```typescript
const resource = await db.resource.findUnique({
  where: { id },
  include: { owner: { select: { id: true } } },
});

if (!resource) {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

if (resource.owner.id !== session.user.id) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### Expandable List Template
```typescript
const [expanded, setExpanded] = useState<Set<string>>(new Set());

const toggle = (id: string) => {
  setExpanded((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
};
```
