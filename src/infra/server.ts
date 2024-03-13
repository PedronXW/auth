import { setupEvents } from '@/domain/enterprise/events'
import { env } from './env'
import { app } from './http/app'
import { RabbitMQModule } from './rabbitmq/rabbitmqModule'

setupEvents()

app.listen(env.PORT, async () => {
  const rabbit = new RabbitMQModule()
  await rabbit.connect('amqp://rabbitmq')
  rabbit.consume(
    {
      exchange: 'client',
      exchangeType: 'fanout',
      queue: 'client-created',
    },
    (msg) => {
      console.log(`New client created: ${msg?.content.toString()}`)
    },
  )

  console.log(`Server listening on port ${env.PORT}`)
})
