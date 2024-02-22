import { FetchAllClientsService } from '@/domain/application/services/fetch-all-clients'
import { DynamoClientRepository } from '@/infra/database/repositories/DynamoClientRepository'

const clientRepository = new DynamoClientRepository()
const fetchAllClientsService = new FetchAllClientsService(clientRepository)

export { fetchAllClientsService }
