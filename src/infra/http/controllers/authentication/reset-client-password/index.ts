import { resetClientPasswordService } from '@/infra/services/client/reset-client-password'
import { ResetClientPasswordController } from './reset-client-password'

const resetClientPasswordController = new ResetClientPasswordController(
  resetClientPasswordService,
)

export { resetClientPasswordController }
