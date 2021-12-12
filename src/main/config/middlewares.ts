import { Express } from 'express'

import { bodyParser, enableCors, contentType } from '../middlewares'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(enableCors)
  app.use(contentType)
}
// setupMiddlewars function being exported here
