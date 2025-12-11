import { MetadataRoute } from 'next';

const BASE_URL = 'https://contpaqi-ai-bridge.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/portal/',
          '/portal',
          '/api/',
          '/api',
          '/auth/',
          '/auth',
          '/_next/',
          '/checkout/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
