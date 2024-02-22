import {
  ClientRepository,
  EditClient,
} from '@/domain/application/repositories/client-repository'
import { Client } from '@/domain/enterprise/entities/client'
import { ClientMapper } from '@/infra/database/mappers/client-mapper'

type ClientPersistenceType = {
  id: Record<string, unknown>
  name: Record<string, unknown>
  email: Record<string, unknown>
  password: Record<string, unknown>
  createdAt: Record<string, unknown>
  updatedAt: Record<string, unknown>
}

export class InMemoryClientRepository implements ClientRepository {
  clients: ClientPersistenceType[] = []

  async createClient(client: Client): Promise<Client> {
    this.clients.push(ClientMapper.toPersistence(client))

    return client
  }

  async getClientByEmail(email: string): Promise<Client | null> {
    const client = this.clients.find((c) => c.email.S === email)

    if (!client) return null

    return ClientMapper.toDomain(client)
  }

  async getClientById(id: string): Promise<Client | null> {
    const client = this.clients.find((c) => c.id.S === id)

    if (!client) return null

    return ClientMapper.toDomain(client)
  }

  async deleteClient(id: string): Promise<boolean> {
    const clientIndex = this.clients.findIndex((c) => c.id.S === id)

    this.clients.splice(clientIndex, 1)

    return true
  }

  async editClient(id: string, { name, email }: EditClient): Promise<Client> {
    const clientIndex = this.clients.findIndex((c) => c.id.S === id)

    this.clients[clientIndex] = {
      ...this.clients[clientIndex],
      name: name ? { S: name } : this.clients[clientIndex].name,
      email: email ? { S: email } : this.clients[clientIndex].email,
      updatedAt: { S: new Date() },
    }

    return ClientMapper.toDomain(this.clients[clientIndex])
  }

  async getAllClients(): Promise<Client[]> {
    return this.clients.map((c) => ClientMapper.toDomain(c))
  }

  async changeStatus(id: string): Promise<Client> {
    const clientIndex = this.clients.findIndex((c) => c.id.S === id)

    this.clients[clientIndex] = {
      ...this.clients[clientIndex],
      updatedAt: { S: new Date() },
    }

    return ClientMapper.toDomain(this.clients[clientIndex])
  }
}
