import 'dotenv/config'
import { z } from 'zod'
import { AppError } from '../http/errors/AppError'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  MONGO_URL_PRODUCTION: z.string().url(),
  MONGO_URL_DEVELOPMENT: z.string().url(),
  JWT_SECRET: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format())

  throw new AppError(_env.error.message)
}

export const env = _env.data
