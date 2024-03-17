import { AuthenticateClientService } from '@/domain/application/services/authenticate-client'
import { Crypto } from '@/infra/cryptography/crypto'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { DynamoClientRepository } from '@/infra/database/repositories/DynamoClientRepository'

const encrypter = new Encrypter()
const hashComparer = new Crypto()
const clientRepository = new DynamoClientRepository()

const authenticateDeveloperService = new AuthenticateClientService(
  clientRepository,
  hashComparer,
  encrypter,
)

export { authenticateDeveloperService }
