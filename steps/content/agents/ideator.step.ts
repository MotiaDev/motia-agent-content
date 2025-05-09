import { EventConfig, FlowContext, StepHandler } from 'motia'
import zodToJsonSchema from 'zod-to-json-schema'
import Mustache from 'mustache'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import { openai } from '../../../src/openai'
import { contentIdeaSchema, ContentIdea } from '../../../src/types/content-idea'
import { ContentState } from '../../../src/content-state'

const input = z.object({ contentIdea: z.string(), contentType: z.string() })

export const config: EventConfig<typeof input> = {
  name: 'Ideator Agent',
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

export const handler: StepHandler<typeof config> = async (input, { logger, state, emit, traceId }: FlowContext) => {
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
