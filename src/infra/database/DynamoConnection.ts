import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { env } from '../env'

const dbClient = new DynamoDBClient({
  region: env.DYNAMODB_REGION,
  endpoint: env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: env.DYNAMODB_ACCESS_KEY,
    secretAccessKey: env.DYNAMODB_SECRET_KEY,
  },
})

export { dbClient }
