import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import { ZodError } from 'zod'
import { AppError } from './errors/AppError'
import { router } from './routes'

const app = express()

app.use(cors())

app.use(express.json())

app.use(router)

app.use((err, request, response, next) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ error: err.message })
  }

  if (err instanceof ZodError) {
    return response.status(400).json({
      error: err.errors.map((error) => error.path[0] + ' - ' + error.message),
    })
  }

  return response.status(500).json({
    status: 'error',
    message: `Internal Server Error - ${err.message}`,
  })
})

export { app }
