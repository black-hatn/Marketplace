// D — Données structurées Schema.org pour les produits et le site

interface ProductJsonLdProps {
  product: {
    nom?: string;
    title?: string;
    images?: string[];
    image?: string;
    description: string;
    prix_ttc?: number | string;
    price?: number;
    rating?: number;
    reviews?: number;
    brand?: { name: string } | null;
    vendor?: string;
    stock?: number;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const name = product.nom || product.title || '';
  const image = product.images?.[0] || product.image || '';
  const price = Number(product.prix_ttc || product.price || 0);
  const brandName = product.brand?.name || product.vendor || 'Immersive';
  const inStock = (product.stock ?? 1) > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    image,
    description: product.description?.slice(0, 300),
    brand: { '@type': 'Brand', name: brandName },
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'XAF', // D — Franc CFA (était EUR)
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Immersive Marketplace' },
    },
    ...(product.rating && product.reviews && product.reviews > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating.toFixed(1),
            reviewCount: product.reviews,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://marketplace-immersive.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Immersive Marketplace',
    url: siteUrl,
    inLanguage: ['fr', 'en', 'ar'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/produits?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://marketplace-immersive.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Immersive Marketplace',
    url: siteUrl,
    logo: `${siteUrl}/app_icon_512.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+235-60-90-90-92',
      contactType: 'customer service',
      areaServed: 'TD',
      availableLanguage: ['French', 'Arabic'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: "N'Djaména",
      addressCountry: 'TD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
