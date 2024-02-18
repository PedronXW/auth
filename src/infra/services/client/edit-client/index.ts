import { EditClientService } from '@/domain/application/services/client/edit-client'
import { MongoConnection } from '@/infra/database/mongo-connection'
import { MongoClientRepository } from '@/infra/database/repositories/MongoClientRepository'

const mongoConnection = new MongoConnection()
const clientsRepository = new MongoClientRepository(mongoConnection)
const editClientService = new EditClientService(clientsRepository)

export { editClientService }
