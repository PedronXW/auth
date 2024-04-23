import { FetchAllClientsService } from '@/domain/application/services/fetch-all-clients'
import { ClientPresenter } from '@/infra/http/presenters/presenter-client'
import { Response } from 'express'
import { z } from 'zod'

const paginationZodSchema = z.object({
  page: z.string().transform(Number),
  limit: z.string().transform(Number),
})

export class FetchAllClientsController {
  constructor(
    private readonly fetchAllClientsService: FetchAllClientsService,
  ) {}

  async handle(req, res): Promise<Response> {
    const { page, limit } = paginationZodSchema.parse(req.query)

    const clients = await this.fetchAllClientsService.execute(page, limit)

    if (clients.isLeft()) {
      return res.status(400).send({ error: clients.value.message })
    }

    return res
      .status(200)
      .send({ clients: clients.value.map(ClientPresenter.toHTTP) })
  }
}
