import { Router } from 'express'
import { authenticationRoutes } from './authentication'
import { clientsRouter } from './clients'

const router = Router()

router.use('/sessions', authenticationRoutes)

router.use('/clients', clientsRouter)

export { router }
