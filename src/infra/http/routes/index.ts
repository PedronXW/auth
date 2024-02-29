import amqp from 'amqplib'
import { Router } from 'express'
import { Kafka, Partitioners } from 'kafkajs'
import { authenticationRoutes } from './authentication'
import { clientsRouter } from './clients'

const router = Router()
const kafka = new Kafka({
  brokers: ['kafka:9092'],
  clientId: 'auth',
})

router.use('/sessions', authenticationRoutes)

router.use('/clients', clientsRouter)

router.get('/', async (request, response) => {
  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  })
  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [{ value: 'Hello KafkaJS user!' }],
  })
})

router.get('/test', async (request, response) => {
  const consumer = kafka.consumer({ groupId: 'test-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value!.toString(),
      })
    },
  })
})

router.get('/test-mq', async (request, response) => {
  const connection = await amqp.connect('amqp://rabbitmq')
  const channel = await connection.createChannel()
  await channel.assertQueue('hello', {
    durable: false,
  })
  await channel.sendToQueue('hello', Buffer.from('Hello World!'))
})

router.get('/test-mq-consumer', async (request, response) => {
  const connection = await amqp.connect('amqp://rabbitmq')
  const channel = await connection.createChannel()
  await channel.assertQueue('hello', {
    durable: false,
  })

  channel.consume('hello', (msg) => {
    console.log(' [x] Received %s', msg!.content.toString())
  })
})

export { router }
