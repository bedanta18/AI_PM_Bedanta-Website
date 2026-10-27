// Rehype plugin: links the first mention of each glossary concept in blog posts
// and concept pages to that concept's page. Terms live in concept-terms.mjs.
import { conceptMatchers, findConcept } from './concept-terms.mjs';

const MAX_LINKS = 8;
// Never link inside these — headings stay clean, existing links stay intact.
const SKIP_TAGS = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'th', 'button', 'script', 'style']);
const CONTENT_PATH = /[\\/]src[\\/]content[\\/](blog|ai-concepts|pm-concepts)[\\/]([^\\/]+)\.mdx?$/;

const classList = (node) => {
  const c = node.properties?.className;
  return Array.isArray(c) ? c : typeof c === 'string' ? c.split(/\s+/) : [];
};

const collectHrefs = (node, out) => {
  if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string') {
    out.add(node.properties.href.replace(/^https:\/\/www\.aipmbedanta\.com/, '').replace(/[#?].*$/, '').replace(/\/?$/, '/'));
  }
  node.children?.forEach((child) => collectHrefs(child, out));
  return out;
};

export default function rehypeConceptLinks() {
  return (tree, file) => {
    const path = file.path ?? file.history?.[0] ?? '';
    const match = path.match(CONTENT_PATH);
    if (!match) return;
    const [, collection, slug] = match;
    const selfHref = collection === 'blog' ? null : `/${collection}/${slug}/`;

    // Concepts this page already links to (or is) are never auto-linked.
    const done = collectHrefs(tree, new Set());
    if (selfHref) done.add(selfHref);
    let count = 0;

    const linkify = (text) => {
      const out = [];
      let rest = text;
      while (count < MAX_LINKS) {
        let best = null;
        for (const m of conceptMatchers) {
          if (done.has(m.href)) continue;
          const hit = findConcept(m, rest);
          if (hit && (!best || hit.index < best.hit.index)) best = { m, hit };
        }
        if (!best) break;
        const { m, hit } = best;
        if (hit.index > 0) out.push({ type: 'text', value: rest.slice(0, hit.index) });
        out.push({
          type: 'element',
          tagName: 'a',
          properties: { href: m.href, className: ['concept-link'] },
          children: [{ type: 'text', value: hit[0] }],
        });
        done.add(m.href);
        count++;
        rest = rest.slice(hit.index + hit[0].length);
      }
      if (rest) out.push({ type: 'text', value: rest });
      return out;
    };

    const walk = (node, skipping) => {
      if (!node.children) return;
      const skip =
        skipping ||
        (node.type === 'element' && (SKIP_TAGS.has(node.tagName) || classList(node).some((c) => c.startsWith('download-cta'))));
      const next = [];
      for (const child of node.children) {
        if (child.type === 'text' && !skip && count < MAX_LINKS) next.push(...linkify(child.value));
        else {
          walk(child, skip);
          next.push(child);
        }
      }
      node.children = next;
    };

    walk(tree, false);
  };
}
