import { DomainEvents } from '@/@shared/events/event-dispatcher'
import { EventHandler } from '@/@shared/events/event-handler'
import { CreateClientEvent } from '@/domain/enterprise/events/CreateClientEvent'

export class OnClientCreated implements EventHandler {
  constructor() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewClientNotification.bind(this),
      CreateClientEvent.name,
    )
  }

  private async sendNewClientNotification({ client }: CreateClientEvent) {
    console.log(client.email)
  }
}
