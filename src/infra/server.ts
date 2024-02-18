import { env } from './env'
import { server } from './socket/socket'

server.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`)
})
