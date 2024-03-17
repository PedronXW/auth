import { ServiceError } from '@/@shared/errors/use-case-error'

export class ClientEmailNotVerifiedError extends Error implements ServiceError {
  constructor() {
    super(`Client email not verified`)
  }
}
