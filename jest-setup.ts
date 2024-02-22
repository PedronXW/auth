import { dbClient } from '@/infra/database/DynamoConnection'
import {
  CreateTableCommand,
  DeleteTableCommand,
} from '@aws-sdk/client-dynamodb'
import { randomInt } from 'crypto'
import * as matchers from 'jest-extended'
expect.extend(matchers)

beforeEach(async () => {
  const TABLE_NUMBER = randomInt(1000).toString()

  process.env.NODE_ENV = 'test'
  process.env.COLLECTION_ID = TABLE_NUMBER

  await dbClient.send(
    new CreateTableCommand({
      TableName: 'teste_' + TABLE_NUMBER,
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    }),
  )

  await new Promise((resolve) => setTimeout(resolve, 20000))
})

afterEach(async () => {
  await dbClient.send(
    new DeleteTableCommand({
      TableName: 'teste_' + process.env.COLLECTION_ID,
    }),
  )
})
