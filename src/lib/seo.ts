// Shared SEO/Schema.org entities so every page's JSON-LD references the same
// Organization and Person — never redeclares them with different details.

export const SITE_URL = 'https://www.aipmbedanta.com';
export const SITE_NAME = 'aipmbedanta';

// The site's only real logo-sized image asset (already used for app icons).
export const SITE_LOGO_URL = `${SITE_URL}/icon-512.png`;

// The site's shared social-share image (already used as og:image everywhere).
export const DEFAULT_ARTICLE_IMAGE = `${SITE_URL}/og-image.png`;

export const PUBLISHER = {
  '@type': 'Organization' as const,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject' as const,
    url: SITE_LOGO_URL,
  },
};

// Known author profiles. Only add an entry here once a real profile URL
// exists for that person — getAuthorSchema() falls back to a bare Person
// (name only) for anyone not listed, rather than inventing a URL.
const AUTHOR_PROFILES: Record<string, string> = {
  'Bedanta Gogoi': `${SITE_URL}/about/`,
};

export function getAuthorSchema(name: string) {
  const url = AUTHOR_PROFILES[name];
  return {
    '@type': 'Person' as const,
    name,
    ...(url ? { url } : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}
