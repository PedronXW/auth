import { Either, left, right } from '@/@shared/either'
import { env } from '@/infra/env'
import { Encrypter } from '../criptography/encrypter'
import { ClientEmailAlreadyVerifiedError } from '../errors/ClientEmailAlreadyVerifiedError'
import { ClientNonExistsError } from '../errors/ClientNonExists'
import { ClientRepository } from '../repositories/client-repository'

interface SendResetPasswordServiceRequest {
  email: string
}

type SendResetPasswordServiceResponse = Either<
  ClientNonExistsError | ClientEmailAlreadyVerifiedError,
  string
>

export class SendResetPasswordService {
  constructor(
    private clientRepository: ClientRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
  }: SendResetPasswordServiceRequest): Promise<SendResetPasswordServiceResponse> {
    const clientExists = await this.clientRepository.getClientByEmail(email)

    if (!clientExists) {
      return left(new ClientNonExistsError())
    }

    const encryptedId = await this.encrypter.encrypt(
      { id: clientExists.id.getValue() },
      env.RESET_PASSWORD_SECRET,
    )

    return right(encryptedId)
  }
}
