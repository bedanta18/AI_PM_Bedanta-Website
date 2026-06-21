import { copyFile } from 'node:fs/promises';

const distDir = new URL('../dist/', import.meta.url);
const sitemapIndex = new URL('sitemap-index.xml', distDir);
const sitemap = new URL('sitemap.xml', distDir);

await copyFile(sitemapIndex, sitemap);
console.log('Created dist/sitemap.xml');
