import express from 'express'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
const app = express()
console.log(setupMiddlewares)

setupMiddlewares(app)
setupRoutes(app)

export default app
