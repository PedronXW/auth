import { dbClient } from '@/infra/database/DynamoConnection'
import {
  CreateTableCommand,
  DeleteTableCommand,
} from '@aws-sdk/client-dynamodb'

afterAll(() => {
  dbClient.destroy()
})

beforeEach(async () => {
  await dbClient.send(
    new CreateTableCommand({
      TableName: 'teste',
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
})

afterEach(async () => {
  await dbClient.send(new DeleteTableCommand({ TableName: 'teste' }))
})
