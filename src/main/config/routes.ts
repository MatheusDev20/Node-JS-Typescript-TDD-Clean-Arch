import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path/posix'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  // fg.sync('**/src/main/routes/**routes.ts').map(async (file) => {
  //   (await import(`../../../${file}`)).default(router)
  // })
  readdirSync(path.resolve(__dirname, '..', 'routes')).map(async file => {
    if (!file.includes('.spec')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}

// setupRoutes being exported Here
