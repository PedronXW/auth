import { Either, left, right } from '@/@shared/either'
import { env } from '@/infra/env'
import { Encrypter } from '../criptography/encrypter'
import { HashGenerator } from '../criptography/hash-generator'
import { ClientNonExistsError } from '../errors/ClientNonExists'
import { ClientRepository } from '../repositories/client-repository'

type ResetClientPasswordServiceRequest = {
  id: string
  password: string
}

type ResetClientPasswordServiceResponse = Either<ClientNonExistsError, null>

export class ResetClientPasswordService {
  constructor(
    private clientRepository: ClientRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter,
  ) {}

  async execute({
    id,
    password,
  }: ResetClientPasswordServiceRequest): Promise<ResetClientPasswordServiceResponse> {
    const userId = await this.encrypter.decrypt(id, env.RESET_PASSWORD_SECRET)

    const clientExists = await this.clientRepository.getClientById(userId)

    if (!clientExists) {
      return left(new ClientNonExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    await this.clientRepository.changePassword(userId, hashedPassword)

    return right(null)
  }
}
