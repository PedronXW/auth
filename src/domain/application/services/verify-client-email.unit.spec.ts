import { Crypto } from '@/infra/cryptography/crypto'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { env } from '@/infra/env'
import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { VerifyClientEmailService } from './verify-client-email'

let sut: VerifyClientEmailService
let inMemoryClientRepository: InMemoryClientRepository
let crypto: Crypto
let encrypter: Encrypter
describe('VerifyClientEmail', () => {
  beforeAll(() => {
    crypto = new Crypto()
    encrypter = new Encrypter()
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new VerifyClientEmailService(inMemoryClientRepository, encrypter)
  })

  it('should be able to verify a client email', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const id = await encrypter.encrypt(
      { id: client.id.getValue() },
      env.VERIFY_EMAIL_SECRET,
    )

    const result = await sut.execute({ id })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientRepository.clients[0].name).toEqual({ S: 'any_name' })
    expect(inMemoryClientRepository.clients[0].emailVerified).toEqual({
      BOOL: true,
    })
  })
})
