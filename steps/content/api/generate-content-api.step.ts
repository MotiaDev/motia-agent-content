import { ApiRequest, ApiRouteConfig, FlowContext, StepHandler } from 'motia'
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
}

export const handler: StepHandler<typeof config> = async (req: ApiRequest, ctx: FlowContext) => {
  const { contentIdea, contentType } = req.body

  await ctx.state.set(ctx.traceId, 'status', 'pending')
  await ctx.emit({ data: { contentIdea, contentType }, topic: 'create-content' })

  return { status: 200, body: { contentId: ctx.traceId } }
}
