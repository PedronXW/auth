import { DeleteClientService } from '@/domain/application/services/client/delete-client'
import { Response } from 'express'
import { z } from 'zod'

const deleteClientZodSchema = z.object({
  id: z.string().uuid(),
})

export class DeleteClientController {
  constructor(private deleteClientService: DeleteClientService) {}

  async handle(req, res): Promise<Response> {
    const { id } = deleteClientZodSchema.parse(req.user)

    const client = await this.deleteClientService.execute({ id })

    if (client.isLeft()) {
      return res.status(401).json({ error: client.value.message })
    }

    return res.status(204).json()
  }
}
