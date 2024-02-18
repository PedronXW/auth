import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { FetchAllClientsService } from './fetch-all-clients'

let sut: FetchAllClientsService
let inMemoryClientRepository: InMemoryClientRepository

describe('Fetch All Clients', () => {
  beforeAll(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new FetchAllClientsService(inMemoryClientRepository)
  })

  it('should be able to fetch all clients', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual([client])
  })
})
