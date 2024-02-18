import { FetchClientByIdService } from '@/domain/application/services/client/fetch-client-by-id'
import { ClientPresenter } from '@/infra/http/presenters/presenter-client'
import { Response } from 'express'
import { z } from 'zod'

const fetchClientByIdZodSchema = z.object({
  id: z.string().uuid(),
})

export class FetchClientByIdController {
  constructor(
    private readonly fetchClientByIdService: FetchClientByIdService,
  ) {}

  async handle(req, res): Promise<Response> {
    const { id } = fetchClientByIdZodSchema.parse(req.params)

    const client = await this.fetchClientByIdService.execute({ id })

    if (client.isLeft()) {
      return res.status(404).send({ error: client.value.message })
    }

    return res
      .status(200)
      .send({ client: ClientPresenter.toHTTP(client.value) })
  }
}
