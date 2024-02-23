import { Router } from 'express'
import { createClientController } from '../controllers/client/create-client'
import { deleteClientController } from '../controllers/client/delete-client'
import { editClientController } from '../controllers/client/edit-client'
import { fetchAllClientsController } from '../controllers/client/fetch-all-clients'
import { fetchClientByIdController } from '../controllers/client/fetch-client-by-id'
import { verifyAuthentication } from '../middlewares/verifyAuthentication'

const clientsRouter = Router()

clientsRouter.post('/', (req, res) => {
  return createClientController.handle(req, res)
})

clientsRouter.delete('/', verifyAuthentication, (req, res) => {
  return deleteClientController.handle(req, res)
})

clientsRouter.get('/', verifyAuthentication, (req, res) => {
  return fetchAllClientsController.handle(req, res)
})

clientsRouter.put('/:id', verifyAuthentication, (req, res) => {
  return editClientController.handle(req, res)
})

clientsRouter.get('/:id', verifyAuthentication, (req, res) => {
  return fetchClientByIdController.handle(req, res)
})

export { clientsRouter }
