import { app } from '@/infra/http/app'
import request from 'supertest'

describe('Create Client', () => {
  beforeEach(async () => {
    jest.setTimeout(30000)
  })

  it('should be able to create a client', async () => {
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

  it('should not be able to create a client because a invalid name', async () => {
    const response = await request(app).post('/clients').send({
      name: 'J',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: ['name - String must contain at least 2 character(s)'],
    })
  })

  it('should not be able to create a client because a invalid password', async () => {
    const response = await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '123',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: ['password - String must contain at least 6 character(s)'],
    })
  })

  it('should not be able to create a client because a invalid password', async () => {
    const response = await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe',
      password: '12345678',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: ['email - Invalid email'],
    })
  })
})
