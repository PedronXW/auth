import { editClientService } from '@/infra/services/client/edit-client'
import { EditClientController } from './edit-client'

const editClientController = new EditClientController(editClientService)

export { editClientController }
