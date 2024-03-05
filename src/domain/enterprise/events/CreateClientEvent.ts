import { EntityId } from '@/@shared/entities/entity-id'
import { DomainEvent } from '@/@shared/events/domain-event'
import { Client } from '../entities/client'

export class CreateClientEvent implements DomainEvent {
  public ocurredAt: Date
  public client: Client

  constructor(client: Client) {
    this.ocurredAt = new Date()
    this.client = client
  }

  getAggregateId(): EntityId {
    return this.client.id
  }
}
