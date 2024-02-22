import { ServiceError } from '@/@shared/errors/use-case-error'

export class WrongCredentialError extends Error implements ServiceError {
  constructor() {
    super(`Wrong credentials`)
  }
}
