import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // G — /vendeur ajouté (tableau de bord vendeur ne doit pas être indexé)
        disallow: ['/admin', '/vendeur', '/en/admin', '/en/vendeur', '/ar/admin', '/ar/vendeur', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
