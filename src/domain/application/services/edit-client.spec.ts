import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { EditClientService } from './edit-client'

let sut: EditClientService
let inMemoryClientRepository: InMemoryClientRepository

describe('EditClient', () => {
  beforeAll(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new EditClientService(inMemoryClientRepository)
  })

  it('should be able to edit a client', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute(client.id.getValue(), {
      name: 'any_name2',
      email: 'any_email2@gmail.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientRepository.clients[0].name).toEqual('any_name2')
  })
})
