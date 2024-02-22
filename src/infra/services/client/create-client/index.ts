import { CreateClientService } from '@/domain/application/services/create-client'
import { Crypto } from '@/infra/cryptography/crypto'
import { DynamoClientRepository } from '@/infra/database/repositories/DynamoClientRepository'

const clientRepository = new DynamoClientRepository()
const crypto = new Crypto()
const createClientService = new CreateClientService(clientRepository, crypto)

export { createClientService }
