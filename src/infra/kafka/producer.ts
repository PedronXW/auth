import { Kafka, Message, Partitioners, Producer } from 'kafkajs'

export class KafkaProducer {
  private producer: Producer

  private kafka = new Kafka({
    brokers: ['kafka:9092'],
    clientId: 'auth',
  })

  constructor() {
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    })
  }

  async send(topic: string, messages: Message[]) {
    await this.producer.connect()
    await this.producer.send({
      topic,
      messages,
    })
  }
}
