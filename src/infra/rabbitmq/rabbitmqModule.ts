import { Broker } from '@/domain/application/brokers/broker'
import amqp from 'amqplib'

type RabbitMQExchange = 'fanout' | 'direct' | 'topic' | 'headers'

export type RabbitMQOptions = {
  queue: string
  exchange: string
  exchangeType: RabbitMQExchange
  routingKey?: string
}

export class RabbitMQModule implements Broker<RabbitMQOptions> {
  private connection: amqp.Connection | null = null
  private channel: amqp.Channel | null = null

  private async setExchange(name: string, exchangeType: RabbitMQExchange) {
    await this.channel!.assertExchange(name, exchangeType, {
      durable: true,
    })
  }

  private async setQueue(name: string) {
    await this.channel!.assertQueue(name, {
      durable: true,
    })
  }

  private async bind(queue: string, exchange: string, pattern: string) {
    await this.channel!.bindQueue(queue, exchange, pattern)
  }

  public async connect(url: string) {
    this.connection = await amqp.connect(url)
    this.channel = await this.connection.createChannel()
    this.channel.prefetch(1)
  }

  public async send(
    { exchange, routingKey = '' }: RabbitMQOptions,
    message: string,
  ) {
    this.channel!.publish(exchange, routingKey, Buffer.from(message), {
      persistent: true,
    })
  }

  public async consume(
    { exchange, queue, exchangeType, routingKey = '' }: RabbitMQOptions,
    callback: (msg: amqp.ConsumeMessage | null) => void,
  ) {
    await this.setExchange(exchange, exchangeType)
    await this.setQueue(queue)
    await this.bind(queue, exchange, routingKey)

    await this.channel!.consume(queue, callback, { noAck: true })
  }
}
