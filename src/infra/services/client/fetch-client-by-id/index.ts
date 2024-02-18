import { FetchClientByIdService } from '@/domain/application/services/client/fetch-client-by-id'
import { MongoConnection } from '@/infra/database/mongo-connection'
import { MongoClientRepository } from '@/infra/database/repositories/MongoClientRepository'

const mongoConnection = new MongoConnection()
const clientRepository = new MongoClientRepository(mongoConnection)
const fetchClientByIdService = new FetchClientByIdService(clientRepository)

export { fetchClientByIdService }
