import { SendVerificationClientEmailService } from '@/domain/application/services/send-verification-client-email'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { DynamoClientRepository } from '@/infra/database/repositories/DynamoClientRepository'

const clientRepository = new DynamoClientRepository()
const encrypter = new Encrypter()
const sendVerificationClientEmailService =
  new SendVerificationClientEmailService(clientRepository, encrypter)

export { sendVerificationClientEmailService }
