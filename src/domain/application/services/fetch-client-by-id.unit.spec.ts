import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { FetchClientByIdService } from './fetch-client-by-id'

let sut: FetchClientByIdService
let inMemoryClientRepository: InMemoryClientRepository

describe('Fetch Client By ID', () => {
  beforeAll(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new FetchClientByIdService(inMemoryClientRepository)
  })

  it('should be able to fetch a client by id', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({ id: client.id.getValue() })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientRepository.clients[0].name).toEqual('any_name')
  })
})
