import { RabbitMQModule } from '@/infra/rabbitmq/rabbitmqModule'
import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { OnClientCreated } from './on-client-created'

let inMemoryClientRepository: InMemoryClientRepository

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
  })

  it('should  send a notification when an answer is created', async () => {
    new OnClientCreated(new RabbitMQModule())

    const client = makeClient()

    inMemoryClientRepository.createClient(client)
  })
})
