// Phrases that identify each glossary concept in article text. Used by
// rehype-concept-links (in-text links) and the concept pages ("Articles that
// mention …"). When you add a concept page, add its entry here too.
//
// Terms with two or more capitals (RAG, OKRs, MoSCoW) match case-sensitively so
// ordinary words aren't linked; everything else is case-insensitive. Longer
// phrases win over shorter ones that start at the same place.

/** @type {Record<string, { href: string; terms: string[] }>} */
export const CONCEPT_TERMS = {
  // ── AI concepts ─────────────────────────────
  'ai-agents': { href: '/ai-concepts/ai-agents/', terms: ['AI agents', 'AI agent'] },
  attention: { href: '/ai-concepts/attention/', terms: ['attention mechanisms', 'attention mechanism', 'self-attention'] },
  'context-engineering': { href: '/ai-concepts/context-engineering/', terms: ['context engineering'] },
  'context-summarization': { href: '/ai-concepts/context-summarization/', terms: ['context summarization'] },
  'few-shot-prompting': { href: '/ai-concepts/few-shot-prompting/', terms: ['few-shot prompting', 'few-shot'] },
  'fine-tuning': { href: '/ai-concepts/fine-tuning/', terms: ['fine-tuning', 'fine tuning', 'fine-tuned', 'fine-tune'] },
  'knowledge-distillation': { href: '/ai-concepts/knowledge-distillation/', terms: ['knowledge distillation', 'model distillation'] },
  llm: { href: '/ai-concepts/llm/', terms: ['large language models', 'large language model', 'LLMs', 'LLM'] },
  mcp: { href: '/ai-concepts/mcp/', terms: ['Model Context Protocol', 'MCP'] },
  'multimodal-ai': { href: '/ai-concepts/multimodal-ai/', terms: ['multimodal AI', 'multimodal models', 'multimodal model'] },
  quantization: { href: '/ai-concepts/quantization/', terms: ['quantization'] },
  rag: { href: '/ai-concepts/rag/', terms: ['retrieval-augmented generation', 'retrieval augmented generation', 'RAG'] },
  'reasoning-models': { href: '/ai-concepts/reasoning-models/', terms: ['reasoning models', 'reasoning model'] },
  'reinforcement-learning': { href: '/ai-concepts/reinforcement-learning/', terms: ['reinforcement learning', 'RLHF'] },
  'self-supervised-learning': { href: '/ai-concepts/self-supervised-learning/', terms: ['self-supervised learning'] },
  'small-language-models': { href: '/ai-concepts/small-language-models/', terms: ['small language models', 'small language model', 'SLMs', 'SLM'] },
  tokenization: { href: '/ai-concepts/tokenization/', terms: ['tokenization', 'tokenizer'] },
  transformer: { href: '/ai-concepts/transformer/', terms: ['transformer architecture', 'transformer models', 'transformer model', 'Transformers', 'Transformer'] },
  'vector-database': { href: '/ai-concepts/vector-database/', terms: ['vector databases', 'vector database', 'vector stores', 'vector store', 'vector DB'] },
  vectors: { href: '/ai-concepts/vectors/', terms: ['vector representations', 'vector representation', 'vectors'] },

  // ── PM concepts ─────────────────────────────
  'jobs-to-be-done': { href: '/pm-concepts/jobs-to-be-done/', terms: ['jobs to be done', 'jobs-to-be-done', 'JTBD'] },
  'kano-model': { href: '/pm-concepts/kano-model/', terms: ['Kano model'] },
  'minimum-viable-product': { href: '/pm-concepts/minimum-viable-product/', terms: ['minimum viable product', 'MVPs', 'MVP'] },
  'moscow-prioritization': { href: '/pm-concepts/moscow-prioritization/', terms: ['MoSCoW'] },
  'north-star-metric': { href: '/pm-concepts/north-star-metric/', terms: ['north star metric'] },
  okrs: { href: '/pm-concepts/okrs/', terms: ['objectives and key results', 'OKRs', 'OKR'] },
  'opportunity-solution-tree': { href: '/pm-concepts/opportunity-solution-tree/', terms: ['opportunity solution trees', 'opportunity solution tree'] },
  'product-market-fit': { href: '/pm-concepts/product-market-fit/', terms: ['product-market fit', 'product market fit', 'PMF'] },
  'rice-prioritization': { href: '/pm-concepts/rice-prioritization/', terms: ['RICE prioritization', 'RICE framework', 'RICE score', 'RICE'] },
};

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isCaseSensitive = (term) => (term.match(/[A-Z]/g) ?? []).length >= 2;

/** One regex per concept, matching any of its terms as a whole word. */
export const conceptMatchers = Object.entries(CONCEPT_TERMS).map(([slug, { href, terms }]) => {
  const sorted = [...terms].sort((a, b) => b.length - a.length);
  const sensitive = sorted.filter(isCaseSensitive);
  const insensitive = sorted.filter((t) => !isCaseSensitive(t));
  const wrap = (list) => `(?<![\\w-])(?:${list.map(escape).join('|')})(?![\\w-])`;
  return {
    slug,
    href,
    sensitive: sensitive.length ? new RegExp(wrap(sensitive), 'g') : null,
    insensitive: insensitive.length ? new RegExp(wrap(insensitive), 'gi') : null,
  };
});

/** First match of a concept in `text`, or null. */
export function findConcept(matcher, text) {
  let best = null;
  for (const re of [matcher.sensitive, matcher.insensitive]) {
    if (!re) continue;
    re.lastIndex = 0;
    const m = re.exec(text);
    if (m && (!best || m.index < best.index || (m.index === best.index && m[0].length > best[0].length))) best = m;
  }
  return best;
}
