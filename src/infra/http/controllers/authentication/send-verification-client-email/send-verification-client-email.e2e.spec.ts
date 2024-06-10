import { app } from '@/infra/http/app'
import request from 'supertest'

describe('Send Verification Client Email', () => {
  it('should be able to send a verification client email', async () => {
    await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const auth = await request(app).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const verifyCode = await request(app)
      .get('/sessions/verify')
      .set('Authorization', `Bearer ${auth.body.token}`)
      .send()

    expect(verifyCode.status).toBe(200)
  })
})
