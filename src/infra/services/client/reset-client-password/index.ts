import { ResetClientPasswordService } from '@/domain/application/services/reset-client-password'
import { Crypto } from '@/infra/cryptography/crypto'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { DynamoClientRepository } from '@/infra/database/repositories/DynamoClientRepository'

const clientRepository = new DynamoClientRepository()
const crypto = new Crypto()
const encrypter = new Encrypter()
const resetClientPasswordService = new ResetClientPasswordService(
  clientRepository,
  crypto,
  encrypter,
)
export { resetClientPasswordService }
