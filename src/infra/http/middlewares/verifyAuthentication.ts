import { verify } from 'jsonwebtoken'

import { MongoConnection } from '@/infra/database/mongo-connection'
import { MongoClientRepository } from '@/infra/database/repositories/MongoClientRepository'
import { env } from '@/infra/env'
import { AppError } from '../errors/AppError'

interface IPayload {
  sub: string
}

export async function verifyAuthentication(request, response, next) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Token missing', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub: id } = verify(token, env.JWT_SECRET) as IPayload
    const mongoConnection = new MongoConnection()
    const developersRepository = new MongoClientRepository(mongoConnection)
    const user = developersRepository.getClientById(id)

    if (!user) {
      throw new AppError('User does not exists', 401)
    }

    request.user = {
      id,
    }

    next()
  } catch (error) {
    throw new AppError('Invalid token', 401)
  }
}
