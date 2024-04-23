import { app } from '@/infra/http/app'
import request from 'supertest'

describe('Fetch Client By Id', () => {
  it('should be able to fetch a client by id', async () => {
    const response = await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const { id } = response.body

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
      .get(`/clients/${id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)

    expect(fetchResponse.status).toBe(200)
  })

  it('should not be able to fetch a client by id because a wrong id', async () => {
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
      .get(`/clients/${'wrong_id'}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)

    expect(fetchResponse.status).toBe(400)
    expect(fetchResponse.body).toEqual({ error: ['id - Invalid uuid'] })
  })
})
