# Task 17: Build Download Page - Learning Log

## Date
2025-12-11

## Key Learnings

### 1. Server to Client Component Conversion
**Pattern:** Convert server components to client when needed

When a page needs to:
- Fetch data on the client
- Have interactive state (like copy buttons)
- Show loading states

Convert by:
```typescript
'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/endpoint').then(res => res.json()).then(setData);
  }, []);

  return data ? <Content data={data} /> : <Loading />;
}
```

Trade-offs:
- Loses static generation
- Requires loading state
- Enables interactivity
- Data fetched on each visit

### 2. Graceful API Fallbacks
**Pattern:** Return defaults on error

```typescript
export async function GET() {
  try {
    const data = await db.model.findFirst({ ... });

    if (!data) {
      return NextResponse.json(defaultValues);
    }

    return NextResponse.json(formatData(data));
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(defaultValues);
  }
}
```

Benefits:
- Page always works even without database
- No error state on frontend
- Consistent response shape

### 3. File Size Formatting
**Pattern:** Human-readable file sizes

```typescript
const formatFileSize = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  return `~${Math.round(mb)} MB`;
};

// Use cases:
formatFileSize(157286400)  // "~150 MB"
formatFileSize(52428800)   // "~50 MB"
```

For more precision:
```typescript
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
};
```

### 4. Copy to Clipboard Pattern
**Pattern:** Copy with visual feedback

```typescript
const [copied, setCopied] = useState(false);

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

// In JSX
<button onClick={() => copyToClipboard(value)}>
  {copied ? <Check /> : <Copy />}
</button>
```

### 5. Conditional Content with Optional Chaining
**Pattern:** Only render when data exists

```typescript
{downloadInfo?.checksum && (
  <div>
    <code>SHA256: {downloadInfo.checksum}</code>
  </div>
)}
```

Benefits:
- No render if null/undefined
- Clean conditional rendering
- Type-safe

### 6. Loading States for Async Data
**Pattern:** Show placeholder while loading

```typescript
const [data, setData] = useState<Data | null>(null);

// In JSX
{data ? (
  <div>Version {data.version}</div>
) : (
  <Loader2 className="animate-spin" />
)}
```

Better patterns:
- Skeleton loaders for layout
- Spinner for small areas
- Full-page loader for critical data

### 7. Date Formatting with Intl
**Pattern:** Locale-aware date formatting

```typescript
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Results:
// en: "December 11, 2025"
// es: "11 de diciembre de 2025"
```

The `undefined` locale uses browser default.

### 8. Static Prerendering Detection
In Next.js build output:
- `○` = Static (prerendered)
- `ƒ` = Dynamic (server-rendered on demand)

The downloads API is `○` because it doesn't use dynamic features:
```
├ ○ /api/downloads                       0 B                0 B
```

## Best Practices Established

1. **Graceful fallbacks** - API always returns usable data
2. **Visual feedback** - Show loading, copied states
3. **Locale-aware** - Use Intl for dates/numbers
4. **Optional rendering** - Only show sections with data
5. **Type safety** - Define interfaces for API responses

## Code Patterns Reference

### API with Fallback
```typescript
const DEFAULT_DATA = { version: '1.0.0', ... };

export async function GET() {
  try {
    const data = await fetchData();
    return NextResponse.json(data || DEFAULT_DATA);
  } catch {
    return NextResponse.json(DEFAULT_DATA);
  }
}
```

### Client Component with API Data
```typescript
'use client';

export default function Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return <Content data={data} />;
}
```
