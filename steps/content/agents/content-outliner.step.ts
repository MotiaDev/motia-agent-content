import { EventConfig, FlowContext, StepHandler } from 'motia'
import zodToJsonSchema from 'zod-to-json-schema'
import Mustache from 'mustache'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import { openai } from '../../../src/openai'
import { contentOutlineSchema } from '../../../src/types/content-outline'
import { ContentState } from '../../../src/content-state'

const input = z.object({ contentId: z.string() })

export const config: EventConfig<typeof input> = {
  name: 'Content Outliner',
  description: 'Creates detailed content outline based on the initial idea',
  type: 'event',
  emits: [{ topic: 'write-content', label: 'Write first content' }],
  virtualEmits: ['virtual-write-content'],
  flows: ['Content'],
  subscribes: ['build-outline'],
  input,
  includeFiles: ['./content-outliner.mustache'],
}

const outlineSchemaJson = zodToJsonSchema(contentOutlineSchema)

type ContentOutline = z.infer<typeof contentOutlineSchema>

export const handler: StepHandler<typeof config> = async (input, { logger, state, emit }: FlowContext) => {
  const { contentId } = input
  const contentState = new ContentState(state)

  const initialIdea = await contentState.getContentIdea(contentId)

  if (!initialIdea) {
    throw new Error('Initial idea not found')
  }

  await contentState.setStatus(contentId, 'outline-processing')

  const template = fs.readFileSync(path.join(__dirname, 'content-outliner.mustache'), 'utf8')
  const prompt = Mustache.render(template, { initialIdea })

  logger.info('Content outliner prompt', { prompt })

  const result = await openai.chat.completions.create({
    messages: [{ role: 'system', content: prompt }],
    model: 'gpt-4o',
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'content-outline', strict: true, schema: outlineSchemaJson },
    },
  })

  const outline: ContentOutline = JSON.parse(result.choices[0].message.content!)

  logger.info('Content outline generated', { outline })

  await contentState.setStatus(contentId, 'outline-generated')
  await contentState.setContentOutline(contentId, outline)

  await emit({
    topic: 'write-content',
    data: { contentId, stage: 'content' },
  })
}
