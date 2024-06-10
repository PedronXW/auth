import { app } from '@/infra/http/app'
import request from 'supertest'

describe('Verify Client Email', () => {
  it('should be able to verify a client email', async () => {
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
      .get('/sessions/verify')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${auth.body.token}`)
      .send()

    const response = await request(app).put('/sessions/verify').send({
      id: verifyCode.body.validatorCode,
    })

    expect(response.status).toBe(200)
  })

  it('should not be able to verify a client email because a wrong id', async () => {
    await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const auth = await request(app).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    await request(app)
      .get('/sessions/verify')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${auth.body.token}`)
      .send()

    const response = await request(app).put('/sessions/verify').send({
      id: 'wrong id', // invalid id
    })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error - jwt malformed',
    })
  })

  it('should not be able to verify a client email because a wrong id', async () => {
    await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const auth = await request(app).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    await request(app)
      .get('/sessions/verify')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${auth.body.token}`)
      .send()

    const response = await request(app).put('/sessions/verify').send({
      id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', // invalid signature
    })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error - invalid signature',
    })
  })
})
