import { app } from '@/infra/http/app'
import request from 'supertest'

describe('ClientController (e2e)', () => {
  beforeEach(async () => {
    jest.setTimeout(30000)
  })

  it('[POST] /clients', async () => {
    const response = await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'John Doe',
      emailVerified: false,
      email: 'johndoe@johndoe.com',
      createdAt: expect.any(String),
    })
  })
})
