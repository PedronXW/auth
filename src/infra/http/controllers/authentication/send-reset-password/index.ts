import { sendResetPasswordService } from '@/infra/services/client/send-reset-password'
import { SendResetPasswordController } from './send-reset-password'

const sendResetPasswordController = new SendResetPasswordController(
  sendResetPasswordService,
)
export { sendResetPasswordController }
