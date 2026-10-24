// AI side projects, shown as cards on /about/ and /projects/. Each project's
// full write-up lives at src/pages/projects/<slug>/index.astro.
export interface Project {
  slug: string;
  title: string;
  summary: string;
  image?: string;
  imageAlt?: string;
  // Short label drawn on the generated cover when there is no image.
  coverLabel?: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    slug: 'message-to-task',
    title: 'Message-to-Task — AI-Powered Agency Action Hub',
    summary:
      'Built an AI-powered tool that transforms client emails into structured, trackable tasks. Using LLM-based classification and information extraction, it identifies actionable requirements, captures deadlines and priorities, and suggests team assignments. A human-in-the-loop workflow ensures users review and approve tasks before creation.',
    image: '/project-images/message-to-task-dashboard.webp',
    imageAlt: 'Message-to-Task dashboard showing synced emails, action-required items, task queue, and overdue tasks',
    tags: [
      'AI Product Management',
      'LLMs',
      'Prompt Engineering',
      'Workflow Automation',
      'Human-in-the-Loop AI',
      'Product Metrics',
    ],
  },
  {
    slug: 'zerodha-kite-coin-ai-features',
    coverLabel: 'Kite × Coin',
    title: 'AI Features for Zerodha Kite & Coin — Design Thinking Case Study',
    summary:
      'A design-thinking case study on where AI can help Zerodha’s traders and long-term investors. Starting from the revenue model and two user personas, I defined five core problems, scored 13 AI feature ideas with RICE, specified the top five — from a Portfolio Health & Risk Analyzer to a Fundamental Research Copilot — and set measurable success criteria to validate each one.',
    tags: [
      'AI Product Management',
      'Design Thinking',
      'User Personas',
      'RICE Prioritization',
      'RAG & Generative AI',
      'Success Metrics',
    ],
  },
];
