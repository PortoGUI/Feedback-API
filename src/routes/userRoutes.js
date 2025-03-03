const express = require('express')

const createService = require('../services')
const createMockService = require('../services/mock')
const CreateUserController = require('../controllers/userController')

const { expressjwt: jwt } = require('express-jwt')

const secret = process.env.SECRET_KEY || 'yek_terces'
const authMiddleware = jwt({ secret, algorithms: ['HS256'] })

function createUserRoutes(database) {
  const router = express.Router()
  const service = createService()
  const mockService = createMockService(database)
  const usersController = CreateUserController(process.env.NODE_ENV === 'production' ? service : mockService)

  router.get('/users/me', authMiddleware, usersController.getLoggerUser)
  router.post('/users/me/apikey', authMiddleware, usersController.generateApiKey)

  return router
}
module.exports = createUserRoutes
