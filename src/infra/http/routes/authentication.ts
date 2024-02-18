import { Router } from 'express'
import { authenticateDeveloperController } from '../controllers/authentication'

const authenticationRoutes = Router()

authenticationRoutes.post('/', (req, res) => {
  return authenticateDeveloperController.handle(req, res)
})

export { authenticationRoutes }
