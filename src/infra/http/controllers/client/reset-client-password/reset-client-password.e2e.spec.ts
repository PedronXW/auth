import { app } from '@/infra/http/app'
import request from 'supertest'

describe('AppController (e2e)', () => {
  it('[POST] /sessions', async () => {
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
      .get('/clients/verify')
      .set('Authorization', `Bearer ${auth.body.token}`)
      .send()

    await request(app).put('/clients/verify').send({
      id: verifyCode.body.validatorCode,
    })

    const getResetPassword = await request(app)
      .post('/clients/reset-password')
      .set('Authorization', `Bearer ${auth.body.token}`)
      .send({
        email: 'johndoe@johndoe.com',
      })

    const response = await request(app).put('/clients/reset-password').send({
      id: getResetPassword.body.validatorCode,
      newPassword: '123456789',
    })

    expect(response.status).toBe(200)
  })
})
