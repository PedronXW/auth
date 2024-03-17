import { Client } from '@/domain/enterprise/entities/client'

export class ClientPresenter {
  static toHTTP(client: Client) {
    return {
      id: client.id.getValue(),
      name: client.name,
      email: client.email,
      emailVerified: client.emailVerified,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }
  }
}
