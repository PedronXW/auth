import { verifyClientEmailService } from '@/infra/services/client/verify-client-email'
import { VerifyClientEmailController } from './verify-client-email'

const verifyClientEmailController = new VerifyClientEmailController(
  verifyClientEmailService,
)

export { verifyClientEmailController }
