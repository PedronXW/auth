import amqp from 'amqplib'

export class RabbitMQConsumer {
  private connection: amqp.Connection
  private channel: amqp.Channel

  constructor(url: string) {
    this.setup(url)
  }

  private async setup(url: string) {
    this.connection = await amqp.connect(url)
    this.channel = await this.connection.createChannel()
  }

  public async consume(
    queue: string,
    callback: (msg: amqp.ConsumeMessage | null) => void,
  ) {
    await this.channel.assertQueue(queue, {
      durable: false,
    })

    this.channel.consume(queue, callback)
  }
}
