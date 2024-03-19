import { Crypto } from '@/infra/cryptography/crypto'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { env } from '@/infra/env'
import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { ResetClientPasswordService } from './reset-client-password'

let sut: ResetClientPasswordService
let inMemoryClientRepository: InMemoryClientRepository
let crypto: Crypto
let encrypter: Encrypter
describe('ResetClientPassword', () => {
  beforeAll(() => {
    crypto = new Crypto()
    encrypter = new Encrypter()
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new ResetClientPasswordService(
      inMemoryClientRepository,
      crypto,
      encrypter,
    )
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
      env.RESET_PASSWORD_SECRET,
    )

    const result = await sut.execute({
      id,
      password: 'new_password',
    })

    expect(result.isRight()).toBe(true)
    expect(
      await crypto.compare(
        'new_password',
        Object.values(inMemoryClientRepository.clients[0].password).toString(),
      ),
    ).toEqual(true)
  })
})
