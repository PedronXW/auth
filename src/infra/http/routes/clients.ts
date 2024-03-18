import { Router } from 'express'
import { changePasswordController } from '../controllers/client/change-password'
import { createClientController } from '../controllers/client/create-client'
import { deleteClientController } from '../controllers/client/delete-client'
import { editClientController } from '../controllers/client/edit-client'
import { fetchAllClientsController } from '../controllers/client/fetch-all-clients'
import { fetchClientByIdController } from '../controllers/client/fetch-client-by-id'
import { sendVerificationClientEmailController } from '../controllers/client/send-verification-client-email'
import { verifyClientEmailController } from '../controllers/client/verify-client-email'
import { verifyAuthentication } from '../middlewares/verifyAuthentication'
import { verifyUserExistence } from '../middlewares/verifyUserExistence'

const clientsRouter = Router()

clientsRouter.put('/password', verifyAuthentication, (req, res) => {
  return changePasswordController.handle(req, res)
})

clientsRouter.put('/verify', (req, res) => {
  return verifyClientEmailController.handle(req, res)
})

clientsRouter.get('/verify', verifyUserExistence, (req, res) => {
  return sendVerificationClientEmailController.handle(req, res)
})

clientsRouter.post('/', (req, res) => {
  return createClientController.handle(req, res)
})

clientsRouter.delete('/', verifyAuthentication, (req, res) => {
  return deleteClientController.handle(req, res)
})

clientsRouter.get('/', verifyAuthentication, (req, res) => {
  return fetchAllClientsController.handle(req, res)
})

clientsRouter.put('/', verifyAuthentication, (req, res) => {
  return editClientController.handle(req, res)
})

clientsRouter.get('/:id', verifyAuthentication, (req, res) => {
  return fetchClientByIdController.handle(req, res)
})

export { clientsRouter }
