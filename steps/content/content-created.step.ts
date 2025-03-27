import { NoopConfig } from 'motia'

export const config: NoopConfig = {
  type: 'noop',
  name: 'Content is generated',
  description: 'When content is generated, users can use the API to get the content',
  virtualSubscribes: ['content-created'],
  virtualEmits: ['/api/get-content'],
  flows: ['Content'],
}
