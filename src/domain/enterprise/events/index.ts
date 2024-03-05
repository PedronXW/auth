import { OnClientCreated } from '@/domain/application/subscribers/on-client-created'

export const setupEvents = () => {
  new OnClientCreated()
}
