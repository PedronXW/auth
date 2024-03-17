import { Either, left, right } from '@/@shared/either'
import { Client } from '@/domain/enterprise/entities/client'
import { env } from '@/infra/env'
import { Encrypter } from '../criptography/encrypter'
import { ClientEmailAlreadyVerifiedError } from '../errors/ClientEmailAlreadyVerifiedError'
import { ClientNonExistsError } from '../errors/ClientNonExists'
import { ClientRepository } from '../repositories/client-repository'

interface VerifyClientEmailServiceRequest {
  id: string
}

type VerifyClientEmailServiceResponse = Either<
  ClientNonExistsError | ClientEmailAlreadyVerifiedError,
  Client
>

export class VerifyClientEmailService {
  constructor(
    private clientRepository: ClientRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    id,
  }: VerifyClientEmailServiceRequest): Promise<VerifyClientEmailServiceResponse> {
    const userId = await this.encrypter.decrypt(id, env.VERIFY_EMAIL_SECRET)

    const client = await this.clientRepository.getClientById(userId)

    if (!client) {
      return left(new ClientNonExistsError())
    }

    if (client.emailVerified) {
      return left(new ClientEmailAlreadyVerifiedError())
    }

    client.emailVerified = true

    await this.clientRepository.verifyClientEmail(userId)

    return right(client)
  }
}
