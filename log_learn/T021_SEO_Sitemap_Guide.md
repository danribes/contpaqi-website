# Task 021: SEO Sitemap - Learning Guide

## What Was Developed

### SEO Sitemap Generation
A dynamic sitemap generator for the ContPAQi AI Bridge website that helps search engines discover and index all public pages efficiently.

## Why Was This Developed

### SEO Benefits
1. **Search Engine Discovery**: Sitemaps help search engines like Google find all pages on your site
2. **Crawl Efficiency**: Search engine bots can crawl your site more intelligently
3. **Index Priority**: Priority hints tell search engines which pages are most important
4. **Update Frequency**: changeFrequency helps search engines know how often to re-crawl
5. **International SEO**: Including both English and Spanish URLs helps with geo-targeting

### Business Impact
- Improved organic search visibility
- Better ranking potential for target keywords
- Faster indexing of new pages
- Proper crawling of bilingual content

## How It Works

### Next.js App Router Sitemap Convention

Next.js 14 provides a built-in way to generate sitemaps using the App Router. By creating a `sitemap.ts` file in the `app` directory, Next.js automatically:

1. Generates the sitemap at build time
2. Serves it at `/sitemap.xml`
3. Uses the correct XML format for sitemaps

### The Sitemap Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://contpaqi-ai-bridge.com</loc>
    <lastmod>2025-12-11</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- More URLs... -->
</urlset>
```

### Priority Guidelines
| Priority | Usage |
|----------|-------|
| 1.0 | Homepage only |
| 0.9 | Main conversion pages (Features, Pricing) |
| 0.8 | Important secondary pages (Download) |
| 0.7 | Contact/Support pages |
| 0.3-0.5 | Legal/utility pages |

### Change Frequency Guidelines
| Frequency | Usage |
|-----------|-------|
| weekly | Pages that change often (home, features, pricing) |
| monthly | Pages that change occasionally (download, contact) |
| yearly | Pages that rarely change (legal pages) |

## Testing Infrastructure

### Vitest Setup
Vitest was chosen for testing because:
1. **Speed**: Much faster than Jest for Vite-based projects
2. **Compatibility**: Works seamlessly with React and TypeScript
3. **API**: Jest-compatible API for easy migration
4. **ESM**: Native ES Modules support

### Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test-Driven Development (TDD)
The implementation followed TDD methodology:
1. **Write tests first** - Define expected behavior
2. **Run tests (Red)** - Confirm they fail
3. **Implement code** - Write minimum code to pass
4. **Run tests (Green)** - Confirm they pass
5. **Refactor** - Clean up if needed

## Key Concepts Learned

### 1. Next.js MetadataRoute.Sitemap
Next.js provides TypeScript types for sitemap generation:
```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
```

### 2. Internationalization in Sitemaps
For multilingual sites, include all language versions:
- Default language: `https://site.com/page`
- Other languages: `https://site.com/es/page`

### 3. What NOT to Include
Never include in sitemap:
- Private routes (`/portal`, `/dashboard`)
- API routes (`/api/*`)
- Authentication pages (`/auth/*`)
- Internal/admin pages

### 4. Dynamic vs Static Sitemaps
- **Static**: Fixed list of pages (what we implemented)
- **Dynamic**: Fetch from database (for blogs, products, etc.)

For dynamic content:
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.products.findMany();

  return products.map(product => ({
    url: `https://site.com/products/${product.slug}`,
    lastModified: product.updatedAt,
  }));
}
```

## Best Practices

1. **Keep it updated**: Regenerate sitemap when content changes
2. **Submit to Search Console**: Register sitemap in Google Search Console
3. **Reference in robots.txt**: Point to sitemap location
4. **Monitor crawl stats**: Check Search Console for crawl issues
5. **Limit size**: Max 50,000 URLs per sitemap (use sitemap index for more)

## Related Tasks
- **Task 22**: Create robots.txt (references the sitemap)
- **Task 28**: Production Deployment (submit sitemap to Search Console)

## Resources
- [Next.js Sitemap Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Sitemaps Protocol](https://www.sitemaps.org/protocol.html)
