import { app } from '@/infra/http/app'
import request from 'supertest'

describe('AppController (e2e)', () => {
  it('[PUT] /clients/:id', async () => {
    await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    jest.setTimeout(20000)

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

    const responseUpdate = await request(app)
      .put(`/clients`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        name: 'John Doe2',
        email: 'arroze@johndoe.com',
      })

    expect(responseUpdate.status).toBe(201)
  })
})
