import { Either, left, right } from '@/@shared/either'
import { ClientRepository } from '../../repositories/client-repository'
import { ClientNonExistsError } from '../errors/ClientNonExists'

type DeleteClientServiceRequest = {
  id: string
}

type DeleteClientServiceResponse = Either<ClientNonExistsError, boolean>

export class DeleteClientService {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    id,
  }: DeleteClientServiceRequest): Promise<DeleteClientServiceResponse> {
    const client = await this.clientRepository.getClientById(id)

    if (!client) {
      return left(new ClientNonExistsError())
    }

    const result = await this.clientRepository.deleteClient(id)

    return right(result)
  }
}
