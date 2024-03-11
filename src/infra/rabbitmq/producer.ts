import amqp from 'amqplib'

export class RabbitMQProducer {
  private connection: amqp.Connection
  private channel: amqp.Channel

  constructor(private url: string) {}

  async connect() {
    this.connection = await amqp.connect(this.url)
    this.channel = await this.connection.createChannel()
  }

  async send(queue: string, message: string) {
    await this.channel.assertQueue(queue, {
      durable: false,
    })

    await this.channel.sendToQueue(queue, Buffer.from(message))
  }
}
