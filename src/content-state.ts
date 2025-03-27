import { FlowContext } from 'motia'
import { ContentIdea } from './types/content-idea'
import { ContentStatus } from './types/content-status'
import { ContentOutline } from './types/content-outline'

type State = FlowContext['state']

export class ContentState {
  constructor(private readonly state: State) {}

  async getContent(contentId: string): Promise<string | null> {
    return this.state.get<string>(contentId, 'content')
  }

  async setContent(contentId: string, content: string) {
    return this.state.set(contentId, 'content', content)
  }

  async getContentIdea(contentId: string): Promise<ContentIdea | null> {
    return this.state.get<ContentIdea>(contentId, 'content.idea')
  }

  async setContentIdea(contentId: string, idea: ContentIdea) {
    return this.state.set(contentId, 'content.idea', idea)
  }

  async getContentOutline(contentId: string): Promise<ContentOutline | null> {
    return this.state.get<ContentOutline>(contentId, 'content.outline')
  }

  async setContentOutline(contentId: string, outline: ContentOutline) {
    return this.state.set(contentId, 'content.outline', outline)
  }

  async setStatus(contentId: string, status: ContentStatus) {
    return this.state.set(contentId, 'status', status)
  }

  async getStatus(contentId: string): Promise<ContentStatus | null> {
    return this.state.get<ContentStatus>(contentId, 'status')
  }
}
