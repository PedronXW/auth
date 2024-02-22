import { ServiceError } from '@/@shared/errors/use-case-error'

export class ClientAlreadyExistsError extends Error implements ServiceError {
  constructor() {
    super(`Client already exists`)
  }
}
