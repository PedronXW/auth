import 'dotenv/config'
import { z } from 'zod'
import { AppError } from '../http/errors/AppError'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  VERIFY_EMAIL_SECRET: z.string(),
  DYNAMODB_TABLE: z.string(),
  DYNAMODB_ACCESS_KEY: z.string(),
  DYNAMODB_SECRET_KEY: z.string(),
  DYNAMODB_REGION: z.string(),
  DYNAMODB_ENDPOINT: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format())

  throw new AppError(_env.error.message)
}

export const env = _env.data
