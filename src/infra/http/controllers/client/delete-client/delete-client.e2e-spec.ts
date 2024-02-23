import { app } from '@/infra/http/app'
import request from 'supertest'

describe('ClientController (e2e)', () => {
  it('[DELETE] /clients', async () => {
    await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const authentication = await request(app).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    console.log(authentication.body)

    const response = await request(app)
      .delete(`/clients`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    console.log(response.body)

    expect(response.status).toBe(204)
  })
})
