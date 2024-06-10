import { authenticateDeveloperService } from '@/infra/services/authentication'
import { AuthenticateClientController } from './authenticate-developer-controller'

const authenticateDeveloperController = new AuthenticateClientController(
  authenticateDeveloperService,
)

export { authenticateDeveloperController }
