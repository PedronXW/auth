import { VerifyClientEmailService } from '@/domain/application/services/verify-client-email'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { DynamoClientRepository } from '@/infra/database/repositories/DynamoClientRepository'

const clientRepository = new DynamoClientRepository()
const encrypter = new Encrypter()
const verifyClientEmailService = new VerifyClientEmailService(
  clientRepository,
  encrypter,
)

export { verifyClientEmailService }
