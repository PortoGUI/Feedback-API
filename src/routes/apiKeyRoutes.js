const express = require('express')

const createService = require('../services')
const createMockService = require('../services/mock')
const CreateApiKeyController = require('../controllers/apiKeyController')

function createApiKeyRoutes(database) {
  const router = express.Router()
  const service = createService()
  const mockService = createMockService(database)
  const apiKeyController = CreateApiKeyController(process.env.NODE_ENV === 'production' ? service : mockService)

  router.head('/apikey/exists', apiKeyController.checkIfApiKeyExists)

  return router
}

module.exports = createApiKeyRoutes
