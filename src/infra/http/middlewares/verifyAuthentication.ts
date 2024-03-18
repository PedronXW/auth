import { verify } from 'jsonwebtoken'

import { ClientEmailNotVerifiedError } from '@/domain/application/errors/ClientEmailNotVerifiedError'
import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { DynamoClientRepository } from '@/infra/database/repositories/DynamoClientRepository'
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
    const developersRepository = new DynamoClientRepository()
    const user = await developersRepository.getClientById(id)

    if (!user) {
      throw new ClientNonExistsError()
    }

    if (!user.emailVerified) {
      throw new ClientEmailNotVerifiedError()
    }

    request.user = {
      id,
    }

    next()
  } catch (error) {
    if (error instanceof ClientEmailNotVerifiedError) {
      throw new AppError('Client e-mail not verified', 401)
    } else {
      throw new AppError('Invalid token', 401)
    }
  }
}
