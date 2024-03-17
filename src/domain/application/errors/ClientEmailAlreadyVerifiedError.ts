import { ServiceError } from '@/@shared/errors/use-case-error'

export class ClientEmailAlreadyVerifiedError
  extends Error
  implements ServiceError
{
  constructor() {
    super(`Client email already verified`)
  }
}
