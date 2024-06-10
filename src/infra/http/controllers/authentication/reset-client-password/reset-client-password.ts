import { ResetClientPasswordService } from '@/domain/application/services/reset-client-password'
import { z } from 'zod'

const resetClientPasswordZodSchema = z.object({
  id: z.string(),
  newPassword: z.string(),
})

export class ResetClientPasswordController {
  constructor(
    private readonly resetClientPasswordService: ResetClientPasswordService,
  ) {}

  async handle(req, res): Promise<Response> {
    const { id, newPassword } = resetClientPasswordZodSchema.parse(req.body)

    const code = await this.resetClientPasswordService.execute({
      id,
      password: newPassword,
    })

    if (code.isLeft()) {
      return res.status(400).send({ error: code.value.message })
    }

    return res.status(200).send()
  }
}
