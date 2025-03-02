const express = require('express')

const createService = require('../services')
const CreateUserController = require('../controllers/authContoller')

function createAuthRoutes(database) {
  const router = express.Router()
  const service = createService(database)
  const authController = CreateUserController(service)

  router.post('/auth/login', authController.login)
  router.post('/auth/register', authController.create)

  return router
}

module.exports = createAuthRoutes
