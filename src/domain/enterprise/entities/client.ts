import { Entity } from '../../../@shared/entities/entity'
import { EntityId } from '../../../@shared/entities/entity-id'
import { Optional } from '../../../@shared/types/optional'

type ClientProps = {
  name: string
  email: string
  password: string
  createdAt: Date | null
  updatedAt?: Date | null
}

export class Client extends Entity<ClientProps> {
  getName(): string {
    return this.props.name
  }

  setName(name: string): void {
    this.props.name = name
  }

  getEmail(): string {
    return this.props.email
  }

  setEmail(email: string): void {
    this.props.email = email
  }

  getPassword(): string {
    return this.props.password
  }

  setPassword(password: string): void {
    this.props.password = password
  }

  get createdAt(): Date | null {
    return this.props.createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  static create(
    props: Optional<ClientProps, 'createdAt'>,
    id?: EntityId,
  ): Client {
    const client = new Client(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
    return client
  }
}
