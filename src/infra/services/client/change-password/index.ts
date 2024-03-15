import { ChangePasswordService } from '@/domain/application/services/change-password'
import { Crypto } from '@/infra/cryptography/crypto'
import { DynamoClientRepository } from '@/infra/database/repositories/DynamoClientRepository'

const clientRepository = new DynamoClientRepository()
const crypto = new Crypto()
const changePasswordService = new ChangePasswordService(
  clientRepository,
  crypto,
  crypto,
)

export { changePasswordService }
