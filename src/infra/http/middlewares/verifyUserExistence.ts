import { verify } from 'jsonwebtoken'

import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { DynamoClientRepository } from '@/infra/database/repositories/DynamoClientRepository'
import { env } from '@/infra/env'
import { AppError } from '../errors/AppError'

interface IPayload {
  sub: string
}

export async function verifyUserExistence(request, response, next) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Token missing', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub: id } = verify(token, env.JWT_SECRET) as IPayload
    const developersRepository = new DynamoClientRepository()
    const user = await developersRepository.getClientById(id)

    if (!user) {
      throw new ClientNonExistsError()
    }

    request.user = {
      id,
    }

    next()
  } catch (error) {
    throw new AppError('Invalid token', 401)
  }
}
