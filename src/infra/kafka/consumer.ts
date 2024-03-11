import { Kafka } from 'kafkajs'

export class KafkaConsumer {
  private kafka = new Kafka({
    brokers: ['kafka:9092'],
    clientId: 'auth',
  })

  constructor(private groupId: string) {}

  async consume(topic: string) {
    const consumer = this.kafka.consumer({ groupId: this.groupId })

    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value!.toString(),
        })
      },
    })
  }
}
