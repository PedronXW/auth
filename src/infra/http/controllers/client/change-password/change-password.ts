import { ChangePasswordService } from '@/domain/application/services/change-password'
import { ClientPresenter } from '@/infra/http/presenters/presenter-client'
import { Response } from 'express'
import { z } from 'zod'

const changePasswordZodBodySchema = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
})

export type ChangePasswordBodySchema = z.infer<
  typeof changePasswordZodBodySchema
>

const changePasswordZodParamsSchema = z.object({
  id: z.string().uuid(),
})

export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  async handle(req, res): Promise<Response> {
    const { id } = changePasswordZodParamsSchema.parse(req.user)

    const { password, newPassword } = changePasswordZodBodySchema.parse(
      req.body,
    )

    const editedClient = await this.changePasswordService.execute(
      id,
      password,
      newPassword,
    )

    if (editedClient.isLeft()) {
      return res.status(404).send({ error: editedClient.value.message })
    }

    return res.status(201).send(ClientPresenter.toHTTP(editedClient.value))
  }
}
