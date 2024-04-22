import { setupEvents } from '@/domain/enterprise/events'
import { env } from './env'
import { app } from './http/app'

app.listen(env.PORT, async () => {
  setupEvents()
  console.log(`Server listening on port ${env.PORT}`)
})
