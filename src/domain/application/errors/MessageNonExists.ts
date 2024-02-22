import { ServiceError } from '@/@shared/errors/use-case-error'

export class MessageNonExistsError extends Error implements ServiceError {
  constructor() {
    super(`Message non exists`)
  }
}
