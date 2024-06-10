import { createClientService } from '@/infra/services/client/create-client'
import { CreateClientController } from './create-client'

const createClientController = new CreateClientController(createClientService)

export { createClientController }
