import { ApiRequest, ApiRouteConfig, FlowContext, StepHandler } from 'motia'
import { z } from 'zod'
import { ContentState } from '../../../src/content-state'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'Get Content',
  description: 'Get the content',
  method: 'GET',
  path: '/content/:contentId',
  emits: [],
  flows: ['Content'],
  bodySchema: z.object({ contentId: z.string() }),
  virtualSubscribes: ['/api/get-content'],
}

export const handler: StepHandler<typeof config> = async (req: ApiRequest, ctx: FlowContext) => {
  const { contentId } = req.pathParams
  const contentState = new ContentState(ctx.state)

  ctx.logger.info('Getting content', { contentId })

  const [status, content, outline, idea] = await Promise.all([
    contentState.getStatus(contentId),
    contentState.getContent(contentId),
    contentState.getContentOutline(contentId),
    contentState.getContentIdea(contentId),
  ])

  ctx.logger.info('Content', { contentId, status, content, outline, idea })

  return {
    status: 200,
    body: {
      contentId,
      status,
      idea,
      outline,
      content,
      version: process.env.MOTIA_VERSION,
    },
  }
}
