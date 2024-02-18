import { CreateClientService } from '@/domain/application/services/client/create-client'
import { Crypto } from '@/infra/cryptography/crypto'
import { MongoConnection } from '@/infra/database/mongo-connection'
import { MongoClientRepository } from '@/infra/database/repositories/MongoClientRepository'

const mongoConnection = new MongoConnection()
const clientRepository = new MongoClientRepository(mongoConnection)
const crypto = new Crypto()
const createClientService = new CreateClientService(clientRepository, crypto)

export { createClientService }
