import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { env } from '../env'

const environment = env.NODE_ENV

const dbClient = new DynamoDBClient(
  environment === 'test'
    ? {
        region: 'local',
        endpoint: 'http://dynamodb-local:8000',
        credentials: {
          accessKeyId: 'accessKeyId',
          secretAccessKey: 'secretAccessKey',
        },
      }
    : {
        region: env.DYNAMODB_REGION,
        endpoint: env.DYNAMODB_ENDPOINT,
        credentials: {
          accessKeyId: env.DYNAMODB_ACCESS_KEY,
          secretAccessKey: env.DYNAMODB_SECRET_KEY,
        },
      },
)

export { dbClient }
