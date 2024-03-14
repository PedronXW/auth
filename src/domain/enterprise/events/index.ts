import { OnClientCreated } from '@/domain/application/subscribers/on-client-created'
import { RabbitMQModule } from '@/infra/rabbitmq/rabbitmqModule'

export const setupEvents = () => {
  new OnClientCreated(new RabbitMQModule())
}
