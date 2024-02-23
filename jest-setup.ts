import { dbClient } from '@/infra/database/DynamoConnection'
import {
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb'
import { randomInt } from 'crypto'
import * as matchers from 'jest-extended'
expect.extend(matchers)

beforeEach(async () => {
  const TABLE_NUMBER = randomInt(1000).toString()

  process.env.NODE_ENV = 'test'
  process.env.COLLECTION_ID = TABLE_NUMBER

  const result = await dbClient.send(
    new CreateTableCommand({
      TableName: 'teste_' + TABLE_NUMBER,
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'email-index',
          KeySchema: [
            {
              AttributeName: 'email',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ],
    }),
  )

  let initiated = false

  while (!initiated) {
    try {
      const result = await dbClient.send(
        new DescribeTableCommand({
          TableName: 'teste_' + TABLE_NUMBER,
        }),
      )
      if (result.Table?.TableStatus === 'ACTIVE') {
        initiated = true
      }
    } catch (err) {
      console.log('Waiting for DynamoDB to be initiated...')
    }
  }
}, 40000)

afterEach(async () => {
  await dbClient.send(
    new DeleteTableCommand({
      TableName: 'teste_' + process.env.COLLECTION_ID,
    }),
  )
}, 40000)
