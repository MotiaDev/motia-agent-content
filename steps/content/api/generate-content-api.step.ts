import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'Content',
  description: 'Generate content API',
  method: 'POST',
  path: '/generate-content',
  emits: ['create-content'],
  flows: ['Content'],
  bodySchema: z.object({ contentIdea: z.string(), contentType: z.string() }),

  responseSchema: {
    200: z.object({ contentId: z.string() }),
  },
}

export const handler: Handlers['Content'] = async (req, ctx) => {
  const { contentIdea, contentType } = req.body

  await ctx.state.set(ctx.traceId, 'status', 'pending')

  await ctx.emit({
    topic: 'create-content',
    data: { contentIdea, contentType },
  })

  return { status: 200, body: { contentId: ctx.traceId } }
}
