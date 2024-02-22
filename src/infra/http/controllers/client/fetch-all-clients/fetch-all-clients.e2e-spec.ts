import { app } from '@/infra/http/app'
import request from 'supertest'

describe('AppController (e2e)', () => {
  it('[GET] /clients', async () => {
    const result = await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    console.log(result.body)

    const authentication = await request(app).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    console.log(authentication.body)

    const fetchResponse = await request(app)
      .get(`/clients`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)

    console.log(fetchResponse.body)

    expect(fetchResponse.status).toBe(200)
    expect(fetchResponse.body.clients).toHaveLength(1)
  })
})
