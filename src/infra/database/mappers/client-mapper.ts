import { EntityId } from '@/@shared/entities/entity-id'
import { Client } from '@/domain/enterprise/entities/client'

export class ClientMapper {
  static toDomain(raw): Client {
    return Client.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new EntityId(raw.id),
    )
  }

  static toPersistence(Client: Client) {
    return {
      id: Client.id.getValue(),
      name: Client.name,
      email: Client.email,
      status: Client.status,
      password: Client.password,
      createdAt: Client.createdAt,
      updatedAt: Client.updatedAt,
    }
  }
}
