import {
  ClientRepository,
  EditClient,
} from '@/domain/application/repositories/client-repository'
import { Client } from '@/domain/enterprise/entities/client'
import { env } from '@/infra/env'
import {
  DeleteItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { dbClient } from '../DynamoConnection'
import { ClientMapper } from '../mappers/client-mapper'

export class DynamoClientRepository implements ClientRepository {
  async createClient(client: Client): Promise<Client> {
    await dbClient.send(
      new PutItemCommand({
        TableName:
          env.NODE_ENV === 'test'
            ? 'teste_' + process.env.COLLECTION_ID
            : env.DYNAMODB_TABLE,
        Item: { ...ClientMapper.toPersistence(client) },
      }),
    )

    return client
  }

  async deleteClient(id: string): Promise<boolean> {
    const deleteResult = await dbClient.send(
      new DeleteItemCommand({
        TableName:
          env.NODE_ENV === 'test'
            ? 'teste_' + process.env.COLLECTION_ID
            : env.DYNAMODB_TABLE,
        Key: { id: { S: id } },
      }),
    )

    return !!deleteResult
  }

  async editClient(id: string, { name, email }: EditClient): Promise<Client> {
    const expression = {}

    let updateExpression = 'set '

    if (name) {
      expression['#n'] = 'name'
      expression[':n'] = { S: name }
      updateExpression += '#n = :n'
    }

    if (email) {
      expression['#e'] = 'email'
      expression[':e'] = { S: email }
      updateExpression += ', #e = :e'
    }

    console.log(expression, id, env.DYNAMODB_TABLE, process.env.COLLECTION_ID)

    const client = await dbClient.send(
      new UpdateItemCommand({
        TableName:
          env.NODE_ENV === 'test'
            ? 'teste_' + process.env.COLLECTION_ID
            : env.DYNAMODB_TABLE,
        Key: { id: { S: id } },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expression,
      }),
    )

    return ClientMapper.toDomain(client.Attributes)
  }

  async getClientByEmail(email: string): Promise<Client | null> {
    const client = await dbClient.send(
      new QueryCommand({
        TableName:
          env.NODE_ENV === 'test'
            ? 'teste_' + process.env.COLLECTION_ID
            : env.DYNAMODB_TABLE,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': { S: email },
        },
        Limit: 1,
      }),
    )

    if (!client.Items?.length) {
      return null
    }

    return ClientMapper.toDomain(client.Items[0])
  }

  async getClientById(id: string): Promise<Client | null> {
    const client = await dbClient.send(
      new QueryCommand({
        TableName:
          env.NODE_ENV === 'test'
            ? 'teste_' + process.env.COLLECTION_ID
            : env.DYNAMODB_TABLE,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': { S: id },
        },
        Limit: 1,
      }),
    )

    if (!client.Items) {
      return null
    }

    return ClientMapper.toDomain(client.Items[0])
  }

  async getAllClients(): Promise<Client[]> {
    const clients = await dbClient.send(
      new ScanCommand({
        TableName:
          env.NODE_ENV === 'test'
            ? 'teste_' + process.env.COLLECTION_ID
            : env.DYNAMODB_TABLE,
      }),
    )

    if (!clients.Items) {
      return []
    }

    return clients.Items.map((client) => ClientMapper.toDomain(client))
  }
}
