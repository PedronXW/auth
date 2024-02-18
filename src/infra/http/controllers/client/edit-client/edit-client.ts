import { EditClientService } from '@/domain/application/services/client/edit-client'
import { Response } from 'express'
import { z } from 'zod'

const editClientZodBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

export type EditClientBodySchema = z.infer<typeof editClientZodBodySchema>

const editClientZodParamsSchema = z.object({
  id: z.string().uuid(),
})

export class EditClientController {
  constructor(private readonly editClientService: EditClientService) {}

  async handle(req, res): Promise<Response> {
    const { id } = editClientZodParamsSchema.parse(req.user)

    const { name, email } = editClientZodBodySchema.parse(req.body)

    const editedClient = await this.editClientService.execute(id, {
      name,
      email,
    })

    if (editedClient.isLeft()) {
      return res.status(404).send({ error: editedClient.value.message })
    }

    return res.status(201).send({ client: editedClient.value })
  }
}
