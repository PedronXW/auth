import { ChangeClientStatusService } from '@/domain/application/services/client/change-client-status'
import { MongoConnection } from '@/infra/database/mongo-connection'
import { MongoClientRepository } from '@/infra/database/repositories/MongoClientRepository'

const mongoConnection = new MongoConnection()
const clientsRepository = new MongoClientRepository(mongoConnection)
const changeClientStatusService = new ChangeClientStatusService(
  clientsRepository,
)

export { changeClientStatusService }
