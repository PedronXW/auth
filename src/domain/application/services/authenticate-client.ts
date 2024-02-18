import { Either, left, right } from '@/@shared/either'
import { Encrypter } from '../../cryptography/encrypter'
import { HashComparer } from '../../cryptography/hash-comparer'
import { ClientRepository } from '../../repositories/client-repository'
import { WrongCredentialError } from '../errors/WrongCredentialsError'

type AuthenticateClientServiceRequest = {
  email: string
  password: string
}

type AuthenticateClientServiceResponse = Either<
  WrongCredentialError,
  { token: string }
>

export class AuthenticateClientService {
  constructor(
    private clientRepository: ClientRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateClientServiceRequest): Promise<AuthenticateClientServiceResponse> {
    const client = await this.clientRepository.getClientByEmail(email)

    if (!client) {
      return left(new Error('Client not found'))
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      client.password,
    )

    if (!passwordMatch) {
      return left(new Error('Password does not match'))
    }

    const token = await this.encrypter.encrypt({
      id: client.id.getValue(),
    })

    return right({ token })
  }
}
