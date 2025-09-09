import fs from 'fs'
import { EventConfig, Handlers } from 'motia'
import Mustache from 'mustache'
import path from 'path'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { ContentState } from '../../../src/content-state'
import { openai } from '../../../src/openai'
import { contentOutlineSchema } from '../../../src/types/content-outline'

const input = z.object({ contentId: z.string() })

export const config: EventConfig = {
  name: 'ContentOutliner',
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

export const handler: Handlers['ContentOutliner'] = async (input, { logger, state, emit }) => {
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

  await emit({ topic: 'write-content', data: { contentId } })
}
