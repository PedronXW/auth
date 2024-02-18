import { AuthenticateClientService } from '@/domain/application/services/client/authenticate-client'
import { Crypto } from '@/infra/cryptography/crypto'
import { JwtEncrypter } from '@/infra/cryptography/encrypter'
import { MongoConnection } from '@/infra/database/mongo-connection'
import { MongoClientRepository } from '@/infra/database/repositories/MongoClientRepository'

const mongoConnection = new MongoConnection()
const developerRepository = new MongoClientRepository(mongoConnection)
const jwtEncrypter = new JwtEncrypter()
const hashComparer = new Crypto()

const authenticateDeveloperService = new AuthenticateClientService(
  developerRepository,
  hashComparer,
  jwtEncrypter,
)

export { authenticateDeveloperService }
