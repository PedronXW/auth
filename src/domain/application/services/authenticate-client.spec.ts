import { Crypto } from '@/infra/cryptography/crypto'
import { JwtEncrypter } from '@/infra/cryptography/encrypter'
import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { AuthenticateClientService } from './authenticate-client'

let sut: AuthenticateClientService
let inMemoryClientRepository: InMemoryClientRepository
let crypto: Crypto
let jwtEncrypter: JwtEncrypter

describe('AuthenticateClient', () => {
  beforeAll(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    crypto = new Crypto()
    jwtEncrypter = new JwtEncrypter()
    sut = new AuthenticateClientService(
      inMemoryClientRepository,
      crypto,
      jwtEncrypter,
    )
  })

  it('should be able to authenticate a client', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({
      email: 'any_email@gmail.com',
      password: 'any_password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientRepository.clients[0].name).toEqual('any_name')
    expect(result.value).toHaveProperty('token')
  })
})
