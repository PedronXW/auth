import { fetchAllClientsService } from '@/infra/services/client/fetch-all-clients'
import { FetchAllClientsController } from './fetch-all-clients'

const fetchAllClientsController = new FetchAllClientsController(
  fetchAllClientsService,
)

export { fetchAllClientsController }
