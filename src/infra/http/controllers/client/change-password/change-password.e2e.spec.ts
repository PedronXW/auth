import { app } from '@/infra/http/app'
import request from 'supertest'

describe('AppController (e2e)', () => {
  it('[PUT] /clients', async () => {
    await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const authentication = await request(app).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const verifyCode = await request(app)
      .get('/sessions/verify')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    await request(app).put('/sessions/verify').send({
      id: verifyCode.body.validatorCode,
    })

    const responseUpdate = await await request(app)
      .put(`/clients/password`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        password: '12345678',
        newPassword: '123456789',
      })

    expect(responseUpdate.status).toBe(200)
  })
})
