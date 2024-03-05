import { setupEvents } from '@/domain/enterprise/events'
import { env } from './env'
import { app } from './http/app'

setupEvents()

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`)
})
