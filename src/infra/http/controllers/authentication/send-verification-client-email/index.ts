import { sendVerificationClientEmailService } from '@/infra/services/client/send-verification-client-email'
import { SendVerificationClientEmailController } from './send-verification-client-email'

const sendVerificationClientEmailController =
  new SendVerificationClientEmailController(sendVerificationClientEmailService)

export { sendVerificationClientEmailController }
