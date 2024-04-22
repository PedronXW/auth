import { VerifyClientEmailService } from '@/domain/application/services/verify-client-email'
import { ClientPresenter } from '@/infra/http/presenters/presenter-client'
import { z } from 'zod'

const verifyClientEmailZodSchema = z.object({
  id: z.string(),
})

export class VerifyClientEmailController {
  constructor(
    private readonly verifyClientEmailService: VerifyClientEmailService,
  ) {}

  async handle(req, res): Promise<Response> {
    const { id } = verifyClientEmailZodSchema.parse(req.body)

    const client = await this.verifyClientEmailService.execute({ id })

    if (client.isLeft()) {
      return res.status(400).send({ error: client.value.message })
    }

    return res
      .status(200)
      .send({ client: ClientPresenter.toHTTP(client.value) })
  }
}
