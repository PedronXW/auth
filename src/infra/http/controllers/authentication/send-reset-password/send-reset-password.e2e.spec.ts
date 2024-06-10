import { app } from '@/infra/http/app'
import request from 'supertest'

describe('Send Reset Password Email', () => {
  it('should be able to send a reset password email', async () => {
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
      .set('Authorization', `Bearer ${auth.body.token}`)
      .send()

    await request(app).put('/sessions/verify').send({
      id: verifyCode.body.validatorCode,
    })

    const getResetPassword = await request(app)
      .post('/sessions/reset-password')
      .set('Authorization', `Bearer ${auth.body.token}`)
      .send({
        email: 'johndoe@johndoe.com',
      })

    const response = await request(app).put('/sessions/reset-password').send({
      id: getResetPassword.body.validatorCode,
      newPassword: '123456789',
    })

    expect(response.status).toBe(200)
  })

  it('should not be able to send a reset password email because a wrong email', async () => {
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
      .set('Authorization', `Bearer ${auth.body.token}`)
      .send()

    await request(app).put('/sessions/verify').send({
      id: verifyCode.body.validatorCode,
    })

    const sendMail = await request(app)
      .post('/sessions/reset-password')
      .set('Authorization', `Bearer ${auth.body.token}`)
      .send({
        email: 'wrongemail@wrong.com',
      })

    expect(sendMail.status).toBe(400)
    expect(sendMail.body).toEqual({ error: 'Client non exists' })
  })
})
