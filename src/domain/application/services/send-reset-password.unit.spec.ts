import { Crypto } from '@/infra/cryptography/crypto'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { env } from '@/infra/env'
import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { SendResetPasswordService } from './send-reset-password'

let sut: SendResetPasswordService
let inMemoryClientRepository: InMemoryClientRepository
let crypto: Crypto
let encrypter: Encrypter
describe('SendResetPassword', () => {
  beforeAll(() => {
    crypto = new Crypto()
    encrypter = new Encrypter()
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new SendResetPasswordService(inMemoryClientRepository, encrypter)
  })

  it('should be able to verify a client email', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({ email: client.email })

    const encryptedId = await encrypter.decrypt(
      result.value as string,
      env.RESET_PASSWORD_SECRET,
    )

    expect(result.isRight()).toBe(true)
    expect(encryptedId).toEqual(client.id.getValue())
  })
})
