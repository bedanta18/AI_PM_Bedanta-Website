// Generates /llms.txt (a curated index) and /llms-full.txt (full content inlined)
// per the llms.txt convention (https://llmstxt.org), so AI crawlers/assistants
// get a clean, complete picture of the site without having to render HTML.
//
// Reads straight from the markdown source in src/content/ (not the Astro
// content-collection API, so this stays a plain Node script) with a small
// tolerant frontmatter parser — good enough for this project's consistently
// flat frontmatter, and deliberately ignores fields/shapes it doesn't need
// (e.g. work's nested `metrics` list) rather than trying to be a full YAML
// parser.
//
// Runs as a build step (see package.json) so both files regenerate from
// whatever content currently exists — never hand-edit the output directly.

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const distDir = new URL('dist/', root);
const contentDir = new URL('src/content/', root);
const SITE = 'https://www.aipmbedanta.com';

/** Tolerant frontmatter parser: flat `key: value` scalars, plus a few named
 *  array fields (`categories`, `keywords`) collected from indented `- item`
 *  lines. Anything else (nested objects/arrays like work's `metrics`) is
 *  simply skipped, not parsed. */
function parseFrontmatter(raw, arrayFields = ['categories', 'keywords']) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const [, fmBlock, body] = match;
  const lines = fmBlock.split(/\r?\n/);
  const data = {};
  let currentArrayField = null;

  for (const line of lines) {
    const arrayItem = line.match(/^\s+-\s+(.*)$/);
    if (arrayItem && currentArrayField) {
      const value = arrayItem[1].trim().replace(/^"(.*)"$/, '$1');
      (data[currentArrayField] ??= []).push(value);
      continue;
    }

    const topLevel = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!topLevel) continue;

    const [, key, rawValue] = topLevel;
    if (rawValue === '' && arrayFields.includes(key)) {
      currentArrayField = key;
      data[key] = [];
      continue;
    }
    currentArrayField = null;
    data[key] = rawValue.trim().replace(/^"(.*)"$/, '$1');
  }

  return { data, body: body.trim() };
}

// Astro's glob() loader slugifies the filename to produce each entry's `id`
// (and therefore its URL) — e.g. "What is a Product.md" becomes the route
// /blog/what-is-a-product/, not /blog/What is a Product/. Replicate that
// here so generated links match the real, live URLs.
function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function loadCollection(dirName, arrayFields) {
  const dirUrl = new URL(dirName + '/', contentDir);
  if (!existsSync(fileURLToPath(dirUrl))) return [];

  const files = (await readdir(dirUrl)).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  const entries = [];

  for (const file of files) {
    const raw = await readFile(new URL(file, dirUrl), 'utf8');
    const { data, body } = parseFrontmatter(raw, arrayFields);
    const id = slugify(file.replace(/\.mdx?$/, ''));
    entries.push({ id, data, body });
  }

  return entries;
}

function isPublished(entry) {
  return entry.data.ispublished === 'true' || entry.data.ispublished === undefined;
}

// ── Load all content ─────────────────────────────────────────────────────

const blog = (await loadCollection('blog'))
  .filter(isPublished)
  .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

const pmConcepts = (await loadCollection('pm-concepts'))
  .filter(isPublished)
  .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

const aiConcepts = (await loadCollection('ai-concepts'))
  .filter(isPublished)
  .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

const work = (await loadCollection('work'))
  .filter(isPublished)
  .sort((a, b) => Number(a.data.order ?? 0) - Number(b.data.order ?? 0));

// ── Build llms.txt (curated index: links + one-line descriptions) ───────

const link = (title, path, desc) => `- [${title}](${SITE}${path})${desc ? `: ${desc}` : ''}`;

const llmsTxt = `# aipmbedanta.

> A free content hub for Product Management, Marketing, Growth & AI — practical frameworks, field-tested templates, and clear explanations, written by Bedanta Gogoi.

aipmbedanta.com covers four pillars — Product Management, Marketing, Growth, and AI — through in-depth articles, a growing glossary of PM and AI concepts, free downloadable templates, and real product management case studies from SaaS, Quick Commerce, and PropTech.

## Category Hubs

${link('Product Management', '/product-management/', 'Frameworks, case studies, and field notes on building products people love')}
${link('Marketing', '/marketing/', 'Strategy, positioning, and execution for modern marketing teams')}
${link('Growth', '/growth/', 'Activation, retention, PLG, and the metrics that move the needle')}
${link('AI', '/ai/', 'AI concepts, tools, and how AI is changing product and marketing work')}

## Articles

${blog.map((p) => link(p.data.title, `/blog/${p.id}/`, p.data.desc)).join('\n')}

## PM Concepts

${pmConcepts.map((p) => link(p.data.title, `/pm-concepts/${p.id}/`, p.data.desc)).join('\n')}

## AI Concepts

${aiConcepts.map((p) => link(p.data.title, `/ai-concepts/${p.id}/`, p.data.desc)).join('\n')}

## Case Studies

${work.map((p) => link(p.data.title, `/work/${p.id}/`, p.data.desc)).join('\n')}

## Pages

${link('Home', '/', 'Overview of all four content pillars and latest articles')}
${link('About', '/about/', 'Bio, work experience timeline, and skills')}
${link('Resources', '/resources/', 'Free templates for PMs, marketers, and growth teams')}
${link('AI & Marketing Tools', '/ai-tools/', 'Curated toolkit of AI and marketing tools, plus recommended books')}
${link('Blog', '/blog/', 'Full article listing with category filters')}
${link('Contact', '/contact/', 'Get in touch')}

## Optional

${link('Privacy Policy', '/privacy-policy/')}
${link('Terms of Use', '/terms/')}
`;

// ── Build llms-full.txt (full content inlined, no need to fetch each page) ─

const section = (heading, entries, urlPrefix, extraFields = []) =>
  entries
    .map((p) => {
      const meta = extraFields
        .map(([label, field]) => {
          const value = p.data[field];
          if (!value) return null;
          return `${label}: ${Array.isArray(value) ? value.join(', ') : value}`;
        })
        .filter(Boolean)
        .join(' · ');
      return [
        `## ${p.data.title}`,
        '',
        `URL: ${SITE}${urlPrefix}${p.id}/`,
        meta && `${meta}`,
        p.data.desc && `Summary: ${p.data.desc}`,
        '',
        p.body,
      ]
        .filter((line) => line !== undefined && line !== false)
        .join('\n');
    })
    .join('\n\n---\n\n');

const llmsFullTxt = `# aipmbedanta. — Full Content

> A free content hub for Product Management, Marketing, Growth & AI, written by Bedanta Gogoi. This file inlines the full text of every article, concept-glossary entry, and case study on the site — see /llms.txt for a shorter link-only index that also covers navigational pages.

# Articles

${section('Articles', blog, '/blog/', [
  ['Date', 'date'],
  ['Author', 'author'],
  ['Categories', 'categories'],
])}

---

# PM Concepts

${section('PM Concepts', pmConcepts, '/pm-concepts/', [['Categories', 'categories']])}

---

# AI Concepts

${section('AI Concepts', aiConcepts, '/ai-concepts/', [['Categories', 'categories']])}

---

# Case Studies

${section('Case Studies', work, '/work/', [
  ['Company', 'company'],
  ['Role', 'role'],
  ['Dates', 'dateRange'],
])}
`;

// ── Write output ──────────────────────────────────────────────────────────

await writeFile(new URL('llms.txt', distDir), llmsTxt);
await writeFile(new URL('llms-full.txt', distDir), llmsFullTxt);

console.log(
  `Created dist/llms.txt and dist/llms-full.txt (${blog.length} articles, ${pmConcepts.length} PM concepts, ${aiConcepts.length} AI concepts, ${work.length} case studies)`
);
