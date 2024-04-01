import { SendVerificationClientEmailService } from '@/domain/application/services/send-verification-client-email'
import { z } from 'zod'

const sendVerificationClientEmailZodSchema = z.object({
  id: z.string().uuid(),
})

export class SendVerificationClientEmailController {
  constructor(
    private readonly sendVerificationClientEmailService: SendVerificationClientEmailService,
  ) {}

  async handle(req, res): Promise<Response> {
    const { id } = sendVerificationClientEmailZodSchema.parse(req.user)

    const code = await this.sendVerificationClientEmailService.execute({ id })

    if (code.isLeft()) {
      return res.status(404).send({ error: code.value.message })
    }

    return res.status(200).send({ validatorCode: code.value })
  }
}
