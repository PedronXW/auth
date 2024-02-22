import { Either, left, right } from '@/@shared/either'
import { Client } from '@/domain/enterprise/entities/client'
import { ClientNonExistsError } from '../errors/ClientNonExists'
import { ClientRepository } from '../repositories/client-repository'

type EditClientServiceRequest = {
  name: string
  email: string
}

type EditClientServiceResponse = Either<ClientNonExistsError, Client>

export class EditClientService {
  constructor(private clientRepository: ClientRepository) {}

  async execute(
    id: string,
    { name, email }: EditClientServiceRequest,
  ): Promise<EditClientServiceResponse> {
    const client = await this.clientRepository.getClientById(id)

    if (!client) {
      return left(new Error('Client not found'))
    }

    const updatedClient = await this.clientRepository.editClient(id, {
      ...client,
      name,
      email,
    })

    return right(updatedClient)
  }
}
