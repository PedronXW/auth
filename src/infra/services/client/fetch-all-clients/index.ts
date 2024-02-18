import { FetchAllClientsService } from '@/domain/application/services/client/fetch-all-clients'
import { MongoConnection } from '@/infra/database/mongo-connection'
import { MongoClientRepository } from '@/infra/database/repositories/MongoClientRepository'

const mongoConnection = new MongoConnection()
const clientRepository = new MongoClientRepository(mongoConnection)
const fetchAllClientsService = new FetchAllClientsService(clientRepository)

export { fetchAllClientsService }
