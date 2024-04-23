import { app } from '@/infra/http/app'
import request from 'supertest'

describe('Change Password', () => {
  it('should be able to change a client password', async () => {
    await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

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

    const responseUpdate = await request(app)
      .put(`/clients/password`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        password: '12345678',
        newPassword: '123456789',
      })

    expect(responseUpdate.status).toBe(200)
  })

  it('should not be able to change a client password because a invalid password', async () => {
    await request(app).post('/clients').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

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

    const responseUpdate = await request(app)
      .put(`/clients/password`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        password: '123',
        newPassword: '123456789',
      })

    expect(responseUpdate.status).toBe(400)
    expect(responseUpdate.body).toEqual({
      error: ['password - String must contain at least 8 character(s)'],
    })
  })
})
