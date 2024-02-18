import { FetchAllClientsService } from '@/domain/application/services/client/fetch-all-clients'
import { ClientPresenter } from '@/infra/http/presenters/presenter-client'
import { Response } from 'express'

export class FetchAllClientsController {
  constructor(
    private readonly fetchAllClientsService: FetchAllClientsService,
  ) {}

  async handle(req, res): Promise<Response> {
    const clients = await this.fetchAllClientsService.execute()

    if (clients.isLeft()) {
      return res.status(404).send({ error: clients.value.message })
    }

    return res
      .status(200)
      .send({ clients: clients.value.map(ClientPresenter.toHTTP) })
  }
}
