import { Either, left, right } from '@/@shared/either'
import { Client } from '@/domain/enterprise/entities/client'
import { ClientRepository } from '../../repositories/client-repository'
import { ClientNonExistsError } from '../errors/ClientNonExists'

type FetchAllClientsServiceResponse = Either<ClientNonExistsError, Client[]>

export class FetchAllClientsService {
  constructor(private clientRepository: ClientRepository) {}

  async execute(): Promise<FetchAllClientsServiceResponse> {
    const client = await this.clientRepository.getAllClients()

    if (!client) {
      return left(new ClientNonExistsError())
    }

    return right(client)
  }
}
