import { DomainEvents } from '@/@shared/events/event-dispatcher'
import { EventHandler } from '@/@shared/events/event-handler'
import { CreateClientEvent } from '@/domain/enterprise/events/CreateClientEvent'
import { env } from '@/infra/env'
import { RabbitMQOptions } from '@/infra/rabbitmq/rabbitmqModule'
import { Broker } from '../brokers/broker'

export class OnClientCreated implements EventHandler {
  constructor(private rabbitProducer: Broker<RabbitMQOptions>) {
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
      await this.rabbitProducer.connect(env.RABBIT_MQ_LINK)
      console.log('Sending message to client-created queue')
      await this.rabbitProducer.send(
        {
          queue: 'client-created',
          exchange: 'client',
          exchangeType: 'fanout',
        },
        JSON.stringify(client),
      )
    }
  }
}
