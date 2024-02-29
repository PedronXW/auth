import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
/*
environment === 'test'
    ? {
        region: env.DYNAMODB_REGION,
        endpoint: env.DYNAMODB_ENDPOINT,
        credentials: {
          accessKeyId: env.DYNAMODB_ACCESS_KEY,
          secretAccessKey: env.DYNAMODB_SECRET_KEY,
        },
      }
    : 
*/
const dbClient = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://dynamodb-local:8000',
  credentials: {
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
  },
})

export { dbClient }
