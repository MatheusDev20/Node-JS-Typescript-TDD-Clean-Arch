
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl).then(async () => {
  console.log('Connected to the Database at port 27017')
  const app = (await import('./config/app')).default
  app.listen(env.port, () => console.log(`Server Running at http://localhost:${env.port}`))
}).catch(console.error)
