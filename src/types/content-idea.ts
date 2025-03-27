import { z } from 'zod'

export const contentIdeaSchema = z
  .object({
    topic: z.string().describe('Main topic or title of the content.'),
    subtopics: z.array(z.string()).describe('List of key subtopics or sections to cover.'),
    keywords: z.array(z.string()).describe('Relevant keywords for SEO and content focus.'),
    tone: z.string().describe('Intended tone of the content (e.g., professional, casual, technical).'),
    audience: z.string().describe('Target audience for the content.'),
  })
  .strict()

export type ContentIdea = z.infer<typeof contentIdeaSchema>
