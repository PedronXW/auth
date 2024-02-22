import { env } from './env'
import { app } from './http/app'

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`)
})
