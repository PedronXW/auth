import { DomainEvents } from '@/@shared/events/event-dispatcher'
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
        TableName: env.NODE_ENV === 'test' ? 'teste' : env.DYNAMODB_TABLE,
        Item: { ...ClientMapper.toPersistence(client) },
      }),
    )

    DomainEvents.markAggregateForDispatch(client)

    DomainEvents.dispatchEventsForAggregate(client.id)

    console.log('Client created')

    return client
  }

  async changePassword(id: string, password: string): Promise<Client> {
    const client = await dbClient.send(
      new UpdateItemCommand({
        TableName: env.NODE_ENV === 'test' ? 'teste' : env.DYNAMODB_TABLE,
        Key: { id: { S: id } },
        UpdateExpression: 'SET #p = :p',
        ExpressionAttributeValues: {
          ':p': { S: password },
        },
        ExpressionAttributeNames: {
          '#p': 'password',
        },
        ReturnValues: 'ALL_NEW',
      }),
    )

    return ClientMapper.toDomain(client.Attributes)
  }

  async deleteClient(id: string): Promise<boolean> {
    const deleteResult = await dbClient.send(
      new DeleteItemCommand({
        TableName: env.NODE_ENV === 'test' ? 'teste' : env.DYNAMODB_TABLE,
        Key: { id: { S: id } },
      }),
    )

    return !!deleteResult
  }

  async verifyClientEmail(id: string): Promise<Client> {
    const client = await dbClient.send(
      new UpdateItemCommand({
        TableName: env.NODE_ENV === 'test' ? 'teste' : env.DYNAMODB_TABLE,
        Key: { id: { S: id } },
        UpdateExpression: 'SET #e = :e',
        ExpressionAttributeValues: {
          ':e': { BOOL: true },
        },
        ExpressionAttributeNames: {
          '#e': 'emailVerified',
        },
        ReturnValues: 'ALL_NEW',
      }),
    )

    return ClientMapper.toDomain(client.Attributes)
  }

  async editClient(id: string, { name, email }: EditClient): Promise<Client> {
    const expression = {}

    let updateExpression = 'SET '

    const expressionAttributeNames = {}

    if (name) {
      expressionAttributeNames['#n'] = 'name'
      expression[':n'] = { S: name }
      updateExpression += '#n = :n'
    }

    if (name && email) {
      updateExpression += ','
    }

    if (email) {
      expressionAttributeNames['#e'] = 'email'
      expression[':e'] = { S: email }
      updateExpression += ' #e = :e'
    }

    const client = await dbClient.send(
      new UpdateItemCommand({
        TableName: env.NODE_ENV === 'test' ? 'teste' : env.DYNAMODB_TABLE,
        Key: { id: { S: id } },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expression,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW',
      }),
    )

    return ClientMapper.toDomain(client.Attributes)
  }

  async getClientByEmail(email: string): Promise<Client | null> {
    const client = await dbClient.send(
      new QueryCommand({
        TableName: env.NODE_ENV === 'test' ? 'teste' : env.DYNAMODB_TABLE,
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
        TableName: env.NODE_ENV === 'test' ? 'teste' : env.DYNAMODB_TABLE,
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

  async getAllClients(page: number, limit: number): Promise<Client[]> {
    const clients = await dbClient.send(
      new ScanCommand({
        TableName: env.NODE_ENV === 'test' ? 'teste' : env.DYNAMODB_TABLE,
        Limit: limit,
        ExclusiveStartKey:
          page > 1 ? { id: { S: page.toString() } } : undefined,
      }),
    )

    if (!clients.Items) {
      return []
    }

    return clients.Items.map((client) => ClientMapper.toDomain(client))
  }
}
