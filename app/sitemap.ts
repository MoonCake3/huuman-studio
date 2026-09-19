import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://huuman.studio';
  const locales = ['en', 'th', 'sv'];
  const pages = ['', '/work', '/services', '/studio', '/process'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
