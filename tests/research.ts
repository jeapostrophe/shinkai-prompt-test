import { TestData } from "../types.ts";

export const researchTests: TestData[] = [
  {
    code: `topic-researcher`,
    prompt:
      `Generate a tool that can conduct comprehensive research on a given topic.`,
    prompt_type:
      "type INPUT = { topic: string, depth: 'basic' | 'intermediate' | 'advanced' }",
    inputs: {
      topic: "quantum computing",
      depth: "intermediate",
    },
    tools: [],
    config: {},
  },
  {
    code: `method-researcher`,
    prompt:
      `Generate a tool that can research and recommend the best methods for accomplishing a task.`,
    prompt_type: "type INPUT = { task: string, constraints?: string[] }",
    inputs: {
      task: "Learn a new programming language",
      constraints: ["limited time", "self-paced"],
    },
    tools: [],
    config: {},
  },
  {
    code: `research-paper-ranker`,
    prompt:
      `Generate a tool that can find and rank research papers on a given topic.`,
    prompt_type:
      "type INPUT = { topic: string, sort_by: 'citations' | 'relevance' | 'date', limit?: number }",
    inputs: {
      topic: "machine learning",
      sort_by: "citations",
      limit: 10,
    },
    tools: [],
    config: {},
  },
  {
    code: `research-paper-analyzer`,
    prompt: `Generate a tool that can analyze and summarize research papers.`,
    prompt_type:
      "type INPUT = { paper_urls: string[], focus_areas?: string[] }",
    inputs: {
      paper_urls: [
        "https://arxiv.org/abs/paper1",
        "https://arxiv.org/abs/paper2",
      ],
      focus_areas: ["methodology", "results", "conclusions"],
    },
    tools: [],
    config: {},
  },
];
