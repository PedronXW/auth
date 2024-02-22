import { AuthenticateClientService } from '@/domain/application/services/authenticate-client'
import { Crypto } from '@/infra/cryptography/crypto'
import { JwtEncrypter } from '@/infra/cryptography/encrypter'
import { DynamoClientRepository } from '@/infra/database/repositories/DynamoClientRepository'

const jwtEncrypter = new JwtEncrypter()
const hashComparer = new Crypto()
const clientRepository = new DynamoClientRepository()

const authenticateDeveloperService = new AuthenticateClientService(
  clientRepository,
  hashComparer,
  jwtEncrypter,
)

export { authenticateDeveloperService }
