import { getCollection, type CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

export const RELATED_COUNT = 4;

// Words nearly every post shares — they say nothing about topical similarity.
const STOPWORDS = new Set(
  `a an and are as at be by for from how in into is it its of on or the to vs what when why with your you
   ai pm pms product products manager managers management guide practical complete explained
   example examples framework frameworks using use tips best top`.split(/\s+/)
);

const tokens = (post: Post) =>
  new Set(
    [post.data.title, ...post.data.keywords]
      .join(' ')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );

const sharesCategory = (a: Post, b: Post) => a.data.categories.some((c) => b.data.categories.includes(c));

// 0 when the posts share no category, so keyword overlap alone never links them.
const similarity = (a: Post, b: Post, ta: Set<string>, tb: Set<string>) => {
  if (!sharesCategory(a, b)) return 0;
  let score = 0;
  for (const cat of a.data.categories) {
    if (!b.data.categories.includes(cat)) continue;
    score += 2;
    const sa = a.data.subcategory[cat];
    if (sa && sa === b.data.subcategory[cat]) score += 6;
  }
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared++;
  return score + Math.min(shared, 5);
};

/**
 * Picks related posts for every published post in one pass so links can be
 * spread across the whole archive:
 * 1. relatedSlugs pinned in frontmatter come first;
 * 2. remaining slots go to the most similar posts (shared subcategory,
 *    category, and title/keyword terms), with a small penalty for posts that
 *    have already been recommended many times;
 * 3. any post still recommended nowhere is swapped into the last slot of its
 *    most similar neighbour.
 */
function buildRelatedMap(posts: Post[]) {
  const tok = new Map(posts.map((p) => [p.id, tokens(p)]));
  const byId = new Map(posts.map((p) => [p.id, p]));
  const picks = new Map<string, Post[]>();
  const pinnedCount = new Map<string, number>();
  const inbound = new Map<string, number>(posts.map((p) => [p.id, 0]));
  const pairScore = (a: Post, b: Post) => similarity(a, b, tok.get(a.id)!, tok.get(b.id)!);

  // Oldest first, so older posts aren't left with only leftovers.
  const ordered = [...posts].sort((a, b) => a.data.date.getTime() - b.data.date.getTime());

  for (const post of ordered) {
    const pinned = (post.data.relatedSlugs ?? [])
      .map((slug) => byId.get(slug))
      .filter((p): p is Post => p !== undefined && p.id !== post.id)
      .slice(0, RELATED_COUNT);

    const candidates = posts
      .filter((p) => p.id !== post.id && !pinned.includes(p))
      .map((p) => ({ p, base: pairScore(post, p) }))
      .filter((c) => c.base > 0)
      .map((c) => ({ ...c, score: c.base - 1.2 * inbound.get(c.p.id)! }))
      .sort((a, b) => b.score - a.score || b.p.data.date.getTime() - a.p.data.date.getTime());

    const chosen = [...pinned, ...candidates.slice(0, RELATED_COUNT - pinned.length).map((c) => c.p)];
    chosen.forEach((p) => inbound.set(p.id, inbound.get(p.id)! + 1));
    picks.set(post.id, chosen);
    pinnedCount.set(post.id, pinned.length);
  }

  // Coverage pass: give every unrecommended post at least one inbound link.
  for (const orphan of posts) {
    if (inbound.get(orphan.id)! > 0) continue;
    const host = posts
      .filter((h) => h.id !== orphan.id && pinnedCount.get(h.id)! < RELATED_COUNT)
      .map((h) => {
        const list = picks.get(h.id)!;
        const last = list[list.length - 1];
        // Only displace a post that keeps at least one other inbound link.
        const canSwap = list.length < RELATED_COUNT || (last && inbound.get(last.id)! > 1);
        return { h, score: canSwap ? pairScore(orphan, h) : -1 };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)[0]?.h;
    if (!host) continue;
    const list = picks.get(host.id)!;
    if (list.length >= RELATED_COUNT) {
      const removed = list.pop()!;
      inbound.set(removed.id, inbound.get(removed.id)! - 1);
    }
    list.push(orphan);
    inbound.set(orphan.id, 1);
  }

  return picks;
}

let cache: Promise<Map<string, Post[]>> | undefined;

/** Related posts keyed by post id, computed once per build across all templates. */
export function getRelatedMap() {
  cache ??= getCollection('blog', (post) => post.data.ispublished).then(buildRelatedMap);
  return cache;
}

/**
 * URL for a related post when shown under a category hub: stay within the
 * hub when the post belongs to it, otherwise fall back to the /blog/ URL.
 */
export const relatedHref = (post: Post, base: string, category?: string) =>
  category && !post.data.categories.includes(category) ? `/blog/${post.id}/` : `${base}${post.id}/`;
