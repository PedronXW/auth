import { Encrypter } from '@/domain/application/cryptography/encrypter'
import { sign } from 'jsonwebtoken'
import { env } from '../env'

export class JwtEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return sign({}, env.JWT_SECRET, {
      subject: payload.id as string,
      expiresIn: '1d',
    })
  }
}
