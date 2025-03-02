const express = require('express')

const createService = require('../services')
const { expressjwt: jwt } = require('express-jwt')
const CreateUserController = require('../controllers/userController')

const secret = process.env.SECRET_KEY || 'yek_terces'
const authMiddleware = jwt({ secret, algorithms: ['HS256'] })

function createUserRoutes(database) {
  const router = express.Router()
  const service = createService(database)
  const usersController = CreateUserController(service)

  router.get('/users/me', authMiddleware, usersController.getLoggerUser)
  router.post('/users/me/apikey', authMiddleware, usersController.generateApiKey)

  return router
}
module.exports = createUserRoutes
