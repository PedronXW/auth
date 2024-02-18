import {
  ClientRepository,
  EditClient,
} from '@/domain/application/repositories/client-repository'
import { Client } from '@/domain/enterprise/entities/client'
import { env } from '@/infra/env'
import { ClientMapper } from '../mappers/client-mapper'
import { MongoConnection } from '../mongo-connection'

export class MongoClientRepository implements ClientRepository {
  constructor(private mongoConnection: MongoConnection) {}

  async createClient(client: Client): Promise<Client> {
    const collection = this.mongoConnection.getCollection(
      'teste',
      env.NODE_ENV === 'test'
        ? 'teste_' + process.env.COLLECTION_ID
        : 'clients',
    )

    await collection.insertOne(ClientMapper.toPersistence(client))

    return client
  }

  async deleteClient(id: string): Promise<boolean> {
    const collection = this.mongoConnection.getCollection(
      'teste',
      env.NODE_ENV === 'test'
        ? 'teste_' + process.env.COLLECTION_ID
        : 'clients',
    )

    const deleteResult = await collection.deleteOne({ id })
    return deleteResult.deletedCount === 1
  }

  async editClient(id: string, { name, email }: EditClient): Promise<Client> {
    const collection = this.mongoConnection.getCollection(
      'teste',
      env.NODE_ENV === 'test'
        ? 'teste_' + process.env.COLLECTION_ID
        : 'clients',
    )

    const newClient = collection.updateOne(
      { id },
      {
        $set: {
          name,
          email,
        },
      },
    )

    return ClientMapper.toDomain(newClient)
  }

  async getClientByEmail(email: string): Promise<Client | null> {
    const collection = this.mongoConnection.getCollection(
      'teste',
      env.NODE_ENV === 'test'
        ? 'teste_' + process.env.COLLECTION_ID
        : 'clients',
    )

    const client = await collection.findOne({ email })

    if (!client) {
      return null
    }

    return ClientMapper.toDomain(client)
  }

  async getClientById(id: string): Promise<Client | null> {
    const collection = this.mongoConnection.getCollection(
      'teste',
      env.NODE_ENV === 'test'
        ? 'teste_' + process.env.COLLECTION_ID
        : 'clients',
    )

    const client = await collection.findOne({ id })

    if (!client) {
      return null
    }

    return ClientMapper.toDomain(client)
  }

  async getAllClients(): Promise<Client[]> {
    const collection = this.mongoConnection.getCollection(
      'teste',
      env.NODE_ENV === 'test'
        ? 'teste_' + process.env.COLLECTION_ID
        : 'clients',
    )

    const clients = await collection.find().toArray()

    return clients.map((client) => ClientMapper.toDomain(client))
  }

  async changeStatus(
    id: string,
    status: 'online' | 'offline',
  ): Promise<Client> {
    const collection = this.mongoConnection.getCollection(
      'teste',
      env.NODE_ENV === 'test'
        ? 'teste_' + process.env.COLLECTION_ID
        : 'clients',
    )

    await collection.updateOne(
      { id },
      {
        $set: {
          status,
        },
      },
    )

    const client = await collection.findOne({ id })

    return ClientMapper.toDomain(client)
  }
}
