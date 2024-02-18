import { CreateClientService } from '@/domain/application/services/client/create-client'
import { ClientPresenter } from '@/infra/http/presenters/presenter-client'
import { Request, Response } from 'express'
import { z } from 'zod'

const createClientZodSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export class CreateClientController {
  constructor(private createClientService: CreateClientService) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = createClientZodSchema.parse(req.body)

    const client = await this.createClientService.execute({
      name,
      email,
      password,
    })

    if (client.isLeft()) {
      return res.status(401).json({ error: client.value.message })
    }

    return res.status(201).json(ClientPresenter.toHTTP(client.value))
  }
}
