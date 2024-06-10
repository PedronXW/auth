import { app } from '@/infra/http/app'
import request from 'supertest'

describe('Reset Client Password', () => {
  it('should be able to reset a client password', async () => {
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

    await request(app).put('/sessions/verify').send({
      id: verifyCode.body.validatorCode,
    })

    const getResetPassword = await request(app)
      .post('/sessions/reset-password')
      .send({
        email: 'johndoe@johndoe.com',
      })

    const response = await request(app).put('/sessions/reset-password').send({
      id: getResetPassword.body.validatorCode,
      newPassword: '123456789',
    })

    expect(response.status).toBe(200)
  })

  it('should not be able to reset a client password because a invalid signature jwt', async () => {
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

    await request(app).put('/sessions/verify').send({
      id: verifyCode.body.validatorCode,
    })

    const response = await request(app).put('/sessions/reset-password').send({
      id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', // invalid signature
      newPassword: '123456789',
    })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error - invalid signature',
    })
  })

  it('should not be able to reset a client password because a invalid id', async () => {
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

    await request(app).put('/sessions/verify').send({
      id: verifyCode.body.validatorCode,
    })

    const response = await request(app).put('/sessions/reset-password').send({
      id: 'invalid-id', // invalid id - not a jwt
      newPassword: '123456789',
    })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error - jwt malformed',
    })
  })
})
