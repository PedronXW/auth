import { app } from '@/infra/http/app'
import request from 'supertest'

describe('', () => {
  it('[GET] /clients', async () => {
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

    const fetchResponse = await request(app)
      .get(`/clients`)
      .set('Content-Type', 'application/json')
      .query({ page: 1, limit: 10 })
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    expect(fetchResponse.status).toBe(200)
    expect(fetchResponse.body.clients).toHaveLength(1)
  })
})
