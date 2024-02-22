import { ServiceError } from '@/@shared/errors/use-case-error'

export class ClientNonExistsError extends Error implements ServiceError {
  constructor() {
    super(`Client non exists`)
  }
}
