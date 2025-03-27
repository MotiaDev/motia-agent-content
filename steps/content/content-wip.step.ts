import { NoopConfig } from 'motia'

export const config: NoopConfig = {
  type: 'noop',
  name: 'Content Work in Progress',
  description: 'Indicates that content generation is currently in progress',
  virtualSubscribes: ['virtual-write-content', 'virtual-build-outline', 'virtual-ideator'],
  virtualEmits: ['/api/get-content'],
  flows: ['Content'],
}
