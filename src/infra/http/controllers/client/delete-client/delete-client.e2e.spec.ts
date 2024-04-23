import { app } from '@/infra/http/app'
import request from 'supertest'

describe('Delete Client', () => {
  beforeEach(async () => {
    jest.setTimeout(30000)
  })

  it('should be able to delete a client', async () => {
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

    const response = await request(app)
      .delete(`/clients`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    expect(response.status).toBe(204)
  })
})
