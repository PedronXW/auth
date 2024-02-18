import { AuthenticateClientService } from '@/domain/application/services/client/authenticate-client'
import { z } from 'zod'

const authenticateClientZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export class AuthenticateClientController {
  constructor(private authenticateClientService: AuthenticateClientService) {}

  async handle(req, res): Promise<any> {
    const { email, password } = authenticateClientZodSchema.parse(req.body)

    const token = await this.authenticateClientService.execute({
      email,
      password,
    })

    if (token.isLeft()) {
      return res.status(401).send({ error: token.value.message })
    }

    return res.status(200).send({ token: token.value.token })
  }
}
