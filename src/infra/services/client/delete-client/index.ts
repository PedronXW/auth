import { DeleteClientService } from '@/domain/application/services/client/delete-client'
import { MongoConnection } from '@/infra/database/mongo-connection'
import { MongoClientRepository } from '@/infra/database/repositories/MongoClientRepository'

const mongoConnection = new MongoConnection()
const clientRepository = new MongoClientRepository(mongoConnection)
const deleteClientService = new DeleteClientService(clientRepository)
export { deleteClientService }
