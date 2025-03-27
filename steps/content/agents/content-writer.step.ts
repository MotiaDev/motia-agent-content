import { EventConfig, FlowContext, StepHandler } from 'motia'
import Mustache from 'mustache'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import { openai } from '../../../src/openai'
import { ContentState } from '../../../src/content-state'

const input = z.object({ contentId: z.string() })

export const config: EventConfig<typeof input> = {
  name: 'Content Writer',
  description: 'Responsible for writing content based on the detailed outline',
  type: 'event',
  emits: [{ topic: 'edit-content', label: 'Edit content' }],
  flows: ['Content'],
  subscribes: ['write-content'],
  input,
  virtualEmits: ['content-created'],
  includeFiles: ['./content-writer.mustache'],
}

export const handler: StepHandler<typeof config> = async (input, { logger, state, emit, traceId }: FlowContext) => {
  const { contentId } = input
  const contentState = new ContentState(state)

  const outline = await contentState.getContentOutline(contentId)
  const initialIdea = await contentState.getContentIdea(contentId)

  const props = { outline, initialIdea }
  const template = fs.readFileSync(path.join(__dirname, 'content-writer.mustache'), 'utf8')
  const prompt = Mustache.render(template, props)

  await contentState.setStatus(contentId, 'content-writing')

  logger.info('Content writer prompt', { prompt })
  logger.info('Executing prompt')

  const result = await openai.chat.completions.create({
    messages: [{ role: 'system', content: prompt }],
    model: 'gpt-4o',
    response_format: { type: 'text' },
  })
  logger.info('Prompt executed')

  const content: string = result.choices[0].message.content!

  logger.info('Content writer result', { contentLength: content.length })

  await contentState.setStatus(contentId, 'content-generated')
  await contentState.setContent(contentId, content)

  await emit({
    topic: 'edit-content',
    data: { contentId },
  })
}
