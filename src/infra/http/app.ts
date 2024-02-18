import cors from 'cors'
import express from 'express'
import 'express-async-errors'
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

  return response.status(500).json({
    status: 'error',
    message: `Internal Server Error - ${err.message}`,
  })
})

export { app }
