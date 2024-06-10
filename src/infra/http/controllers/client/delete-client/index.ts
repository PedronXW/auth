import { deleteClientService } from '@/infra/services/client/delete-client'
import { DeleteClientController } from './delete-client'

const deleteClientController = new DeleteClientController(deleteClientService)

export { deleteClientController }
