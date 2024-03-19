import { SendResetPasswordService } from '@/domain/application/services/send-reset-password'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { DynamoClientRepository } from '@/infra/database/repositories/DynamoClientRepository'

const clientRepository = new DynamoClientRepository()
const encrypter = new Encrypter()
const sendResetPasswordService = new SendResetPasswordService(
  clientRepository,
  encrypter,
)
export { sendResetPasswordService }
