import fs from 'fs'
import { EventConfig, Handlers } from 'motia'
import Mustache from 'mustache'
import path from 'path'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { ContentState } from '../../../src/content-state'
import { openai } from '../../../src/openai'
import { ContentIdea, contentIdeaSchema } from '../../../src/types/content-idea'

const input = z.object({ contentIdea: z.string(), contentType: z.string() })

export const config: EventConfig = {
  name: 'IdeatorAgent',
  description: 'Responsible for generating initial content ideas and high-level direction.',
  type: 'event',
  emits: [{ topic: 'build-outline', label: 'Create content outline' }],
  flows: ['Content'],
  subscribes: ['create-content'],
  virtualEmits: ['virtual-build-outline'],
  input,
  includeFiles: ['./ideator.mustache'],
}

const contentIdeaSchemaJson = zodToJsonSchema(contentIdeaSchema)

export const handler: Handlers['IdeatorAgent'] = async (input, { logger, state, emit, traceId }) => {
  const { contentIdea, contentType } = input
  const props = { contentIdea, contentType }

  const contentId = traceId
  const contentState = new ContentState(state)
  const template = fs.readFileSync(path.join(__dirname, 'ideator.mustache'), 'utf8')
  const prompt = Mustache.render(template, props)

  logger.info('Idea generator prompt', { prompt })

  const result = await openai.chat.completions.create({
    messages: [{ role: 'system', content: prompt }],
    model: 'gpt-4o-mini',
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'content-idea', strict: true, schema: contentIdeaSchemaJson },
    },
  })

  const output: ContentIdea = JSON.parse(result.choices[0].message.content!)

  logger.info('Idea generator result', { output })

  await contentState.setContentIdea(contentId, output)
  await contentState.setStatus(contentId, 'idea-generated')

  await emit({ topic: 'build-outline', data: { contentId } })
}
