import { DomainEvents } from '@/@shared/events/event-dispatcher'
import { EventHandler } from '@/@shared/events/event-handler'
import { CreateClientEvent } from '@/domain/enterprise/events/CreateClientEvent'
import { env } from '@/infra/env'
import { RabbitMQProducer } from '@/infra/rabbitmq/producer'

export class OnClientCreated implements EventHandler {
  constructor() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewClientNotification.bind(this),
      CreateClientEvent.name,
    )
  }

  private async sendNewClientNotification({ client }: CreateClientEvent) {
    if (env.NODE_ENV === 'test') {
      console.log(`New client created: ${client.name}`)
    } else {
      const rabbitProducer = new RabbitMQProducer('amqp://rabbitmq')
      await rabbitProducer.connect()
      rabbitProducer.send('teste', JSON.stringify(client))
    }
  }
}
