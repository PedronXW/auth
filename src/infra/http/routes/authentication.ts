import { Router } from 'express'
import { authenticateDeveloperController } from '../controllers/authentication/authentication'
import { resetClientPasswordController } from '../controllers/authentication/reset-client-password'
import { sendResetPasswordController } from '../controllers/authentication/send-reset-password'
import { sendVerificationClientEmailController } from '../controllers/authentication/send-verification-client-email'
import { verifyClientEmailController } from '../controllers/authentication/verify-client-email'
import { verifyUserExistence } from '../middlewares/verifyUserExistence'

const authenticationRoutes = Router()

authenticationRoutes.post('/', (req, res) => {
  return authenticateDeveloperController.handle(req, res)
})

authenticationRoutes.put('/reset-password', (req, res) => {
  return resetClientPasswordController.handle(req, res)
})

authenticationRoutes.post('/reset-password', (req, res) => {
  return sendResetPasswordController.handle(req, res)
})

authenticationRoutes.put('/verify', (req, res) => {
  return verifyClientEmailController.handle(req, res)
})

authenticationRoutes.get('/verify', verifyUserExistence, (req, res) => {
  return sendVerificationClientEmailController.handle(req, res)
})

export { authenticationRoutes }
