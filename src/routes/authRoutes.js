const express = require('express')

const createService = require('../services')
const createMockService = require('../services/mock')
const CreateUserController = require('../controllers/authContoller')

function createAuthRoutes(database) {
  const router = express.Router()
  const service = createService()
  const mockService = createMockService(database)
  const authController = CreateUserController(process.env.NODE_ENV === 'production' ? service : mockService)

  router.post('/auth/login', authController.login)
  router.post('/auth/register', authController.create)

  return router
}

module.exports = createAuthRoutes
