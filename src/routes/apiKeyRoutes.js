const express = require('express')

const createService = require('../services')
const CreateApiKeyController = require('../controllers/apiKeyController')

function createApiKeyRoutes(database) {
  const router = express.Router()
  const service = createService(database)
  const apiKeyController = CreateApiKeyController(service)

  router.head('/apikey/exists', apiKeyController.checkIfApiKeyExists)

  return router
}

module.exports = createApiKeyRoutes
