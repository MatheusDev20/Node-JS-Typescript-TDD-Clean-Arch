import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should Return an account on Success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Matheus',
        email: 'matheusdev20@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})