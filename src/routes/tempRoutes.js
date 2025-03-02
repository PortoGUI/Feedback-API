const express = require('express')

const createService = require('../services')
const CreateTempController = require('../controllers/tempControleer')

const { expressjwt: jwt } = require('express-jwt')
const secret = process.env.SECRET_KEY || 'yek_terces'
const authMiddleware = jwt({ secret, algorithms: ['HS256'] })

function createTempRoutes(database) {
  const router = express.Router()
  const service = createService(database)
  const tempController = CreateTempController(service)

  router.post('/auth/login', tempController.login)
  router.post('/auth/register', tempController.create)

  router.head('/apikey/exists', tempController.checkIfApiKeyExists)

  router.post('/feedbacks', tempController.createF)
  router.get('/feedbacks', authMiddleware, tempController.getFeedbacks)
  router.get('/feedbacks/summary', authMiddleware, tempController.getSummary)

  router.get('/users/me', authMiddleware, tempController.getLoggerUser)
  router.post('/users/me/apikey', authMiddleware, tempController.generateApiKey)

  return router
}

module.exports = createTempRoutes
