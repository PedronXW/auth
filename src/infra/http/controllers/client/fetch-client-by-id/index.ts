import { fetchClientByIdService } from '@/infra/services/client/fetch-client-by-id'
import { FetchClientByIdController } from './fetch-client-by-id'

const fetchClientByIdController = new FetchClientByIdController(
  fetchClientByIdService,
)

export { fetchClientByIdController }
