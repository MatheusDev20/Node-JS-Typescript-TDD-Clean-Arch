
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'
import { config } from 'dotenv'

config()
MongoHelper.connect(process.env.MONGO_URL).then(async () => {
  console.log('Sucesfully connected to the Database')
  const app = (await import('./config/app')).default
  app.listen(env.port, () => console.log(`Server Running at http://localhost:${env.port}`))
}).catch(console.error)
