import { Either, left, right } from '@/@shared/either'
import { env } from '@/infra/env'
import { Encrypter } from '../criptography/encrypter'
import { ClientEmailAlreadyVerifiedError } from '../errors/ClientEmailAlreadyVerifiedError'
import { ClientNonExistsError } from '../errors/ClientNonExists'
import { ClientRepository } from '../repositories/client-repository'

interface SendVerificationClientEmailServiceRequest {
  id: string
}

type SendVerificationClientEmailServiceResponse = Either<
  ClientNonExistsError | ClientEmailAlreadyVerifiedError,
  string
>

export class SendVerificationClientEmailService {
  constructor(
    private clientRepository: ClientRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    id,
  }: SendVerificationClientEmailServiceRequest): Promise<SendVerificationClientEmailServiceResponse> {
    const clientExists = await this.clientRepository.getClientById(id)

    if (!clientExists) {
      return left(new ClientNonExistsError())
    }

    if (clientExists.emailVerified) {
      return left(new ClientEmailAlreadyVerifiedError())
    }

    const encryptedId = await this.encrypter.encrypt(
      { id },
      env.VERIFY_EMAIL_SECRET,
    )

    return right(encryptedId)
  }
}
