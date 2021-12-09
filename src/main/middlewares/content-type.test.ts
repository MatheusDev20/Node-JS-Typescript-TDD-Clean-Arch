import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('Should Return default Content Type as JSON', async () => {
    app.get('/test_content', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_content')
      .expect('content-type', /json/)
  })
})
