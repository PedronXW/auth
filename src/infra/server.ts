import { setupEvents } from '@/domain/enterprise/events'
import { env } from './env'
import { app } from './http/app'
import { RabbitMQModule } from './rabbitmq/rabbitmqModule'

setupEvents()

app.listen(env.PORT, async () => {
  const rabbitmq = new RabbitMQModule()
  await rabbitmq.connect('amqp://rabbitmq')
  await rabbitmq.consume(
    {
      queue: 'client-created',
      exchange: 'client',
      exchangeType: 'fanout',
    },
    (msg) => {
      console.log('user', msg)
    },
  )

  console.log(`Server listening on port ${env.PORT}`)
})
