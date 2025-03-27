import { z } from 'zod'

export const contentOutlineSchema = z
  .object({
    mainTitle: z.string().describe('Refined main title for the content'),
    introduction: z.object({
      hook: z.string().describe('Attention-grabbing opening statement or question'),
      context: z.string().describe('Background information needed to understand the topic'),
      thesis: z.string().describe('Main argument or point of the content'),
    }),
    sections: z.array(
      z.object({
        title: z.string().describe('Section heading'),
        keyPoints: z.array(z.string()).describe('Main points to cover in this section'),
        supportingDetails: z.array(z.string()).describe('Specific examples, data, or explanations'),
      }),
    ),
    conclusion: z.object({
      summary: z.string().describe('Brief recap of main points'),
      callToAction: z.string().describe('What the reader should do with this information'),
    }),
    sourceTypes: z.array(z.string()).describe('Types of sources to reference (e.g., studies, expert opinions)'),
  })
  .strict()

export type ContentOutline = z.infer<typeof contentOutlineSchema>
