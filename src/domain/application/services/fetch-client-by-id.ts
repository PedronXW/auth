import { Either, left, right } from '@/@shared/either'
import { Client } from '@/domain/enterprise/entities/client'
import { ClientRepository } from '../../repositories/client-repository'
import { ClientNonExistsError } from '../errors/ClientNonExists'

type FetchClientByIdServiceRequest = {
  id: string
}

type FetchClientByIdServiceResponse = Either<ClientNonExistsError, Client>

export class FetchClientByIdService {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    id,
  }: FetchClientByIdServiceRequest): Promise<FetchClientByIdServiceResponse> {
    const client = await this.clientRepository.getClientById(id)

    if (!client) {
      return left(new ClientNonExistsError())
    }

    return right(client)
  }
}
