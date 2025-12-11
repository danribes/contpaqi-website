# Task 022: Robots.txt - Learning Guide

## What Was Developed

### Robots.txt Generation
A robots.txt file generator for the ContPAQi AI Bridge website that instructs search engine crawlers which pages to index and which to ignore.

## Why Was This Developed

### Purpose of robots.txt
1. **Crawler Control**: Tell search engines which parts of the site to crawl
2. **Privacy Protection**: Prevent indexing of private areas (portal, auth)
3. **Server Load**: Reduce unnecessary crawling of API endpoints
4. **SEO Optimization**: Focus crawler budget on valuable pages
5. **Sitemap Discovery**: Point crawlers to the sitemap location

### Business Impact
- Protects customer portal from appearing in search results
- Prevents API endpoints from being indexed
- Helps search engines find and prioritize public marketing pages
- Improves overall SEO health of the website

## How It Works

### Next.js App Router Robots Convention

Next.js 14 provides a built-in way to generate robots.txt using the App Router. By creating a `robots.ts` file in the `app` directory, Next.js automatically:

1. Generates the robots.txt at build time
2. Serves it at `/robots.txt`
3. Uses the correct format for robots.txt files

### The Robots.txt Structure

```
User-agent: *
Allow: /
Disallow: /portal/
Disallow: /api/
Disallow: /auth/

Sitemap: https://contpaqi-ai-bridge.com/sitemap.xml
```

### Key Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `User-agent` | Which crawler the rules apply to | `*` (all crawlers) |
| `Allow` | Paths crawlers can access | `/` (root) |
| `Disallow` | Paths crawlers should not access | `/portal/` |
| `Sitemap` | Location of XML sitemap | Full URL to sitemap.xml |

## Best Practices Implemented

### 1. Wildcard User-Agent
```typescript
userAgent: '*'
```
Applies rules to all search engine crawlers (Googlebot, Bingbot, etc.)

### 2. Explicit Allow for Root
```typescript
allow: '/'
```
Explicitly allows crawling of the main site content.

### 3. Disallow Private Routes
```typescript
disallow: ['/portal/', '/api/', '/auth/']
```
Blocks sensitive areas from indexing:
- `/portal/` - Customer dashboard
- `/api/` - Backend API endpoints
- `/auth/` - Login/register pages

### 4. Sitemap Reference
```typescript
sitemap: `${BASE_URL}/sitemap.xml`
```
Tells crawlers where to find the complete list of pages.

## Security Considerations

### What to Disallow
| Path | Reason |
|------|--------|
| `/portal/` | Private customer data |
| `/api/` | Backend endpoints |
| `/auth/` | Authentication flows |
| `/_next/` | Framework internals |
| `/admin/` | Admin panels (if any) |

### What NOT to Do
- Don't use robots.txt as security - it's only a suggestion to crawlers
- Don't block CSS/JS files (can hurt rendering)
- Don't block images needed for OG tags
- Don't assume malicious bots will obey

## Common Mistakes to Avoid

### 1. Blocking Important Resources
```
# BAD - blocks all static files
Disallow: /_next/static/

# GOOD - only block internal routes
Disallow: /_next/
```

### 2. Conflicting Rules
```
# BAD - contradictory rules
Allow: /api/public
Disallow: /api/

# GOOD - be specific
Disallow: /api/
Allow: /api/public/
```

### 3. Missing Trailing Slashes
```
# Include both to be safe
Disallow: /portal
Disallow: /portal/
```

## Relationship with Sitemap

The robots.txt and sitemap work together:

```
robots.txt                    sitemap.xml
    │                              │
    │  "Here's what NOT            │  "Here's what TO
    │   to crawl"                  │   crawl"
    │                              │
    └──── Points to ───────────────┘
          (Sitemap: URL)
```

1. Crawler fetches `/robots.txt`
2. Reads rules and sitemap location
3. Fetches `/sitemap.xml`
4. Crawls allowed pages listed in sitemap

## Testing robots.txt

### Google Search Console
1. Go to Search Console > URL Inspection
2. Test specific URLs against robots.txt
3. Check for crawl errors

### Online Tools
- [Google Robots Testing Tool](https://www.google.com/webmasters/tools/robots-testing-tool)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### Local Testing
```bash
# Start dev server
npm run dev

# Visit robots.txt
curl http://localhost:3000/robots.txt
```

## Key Concepts Learned

### 1. MetadataRoute.Robots Type
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [...],
    sitemap: '...',
  };
}
```

### 2. Multiple User-Agent Rules
For different rules per crawler:
```typescript
rules: [
  { userAgent: 'Googlebot', allow: '/', disallow: '/private/' },
  { userAgent: 'Bingbot', allow: '/', disallow: ['/private/', '/test/'] },
  { userAgent: '*', disallow: '/' }, // Block all others
]
```

### 3. Crawl-Delay (Optional)
Some crawlers support crawl delay:
```
User-agent: *
Crawl-delay: 10
```
Note: Google ignores this directive.

## Related Tasks
- **Task 21**: SEO Sitemap (referenced by robots.txt)
- **Task 28**: Production Deployment (verify robots.txt in Search Console)

## Resources
- [Next.js Robots Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Google Robots.txt Specifications](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)
- [Robots Exclusion Protocol](https://www.robotstxt.org/)
