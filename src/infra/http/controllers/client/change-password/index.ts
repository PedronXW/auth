import { changePasswordService } from '@/infra/services/client/change-password'
import { ChangePasswordController } from './change-password'

const changePasswordController = new ChangePasswordController(
  changePasswordService,
)

export { changePasswordController }
