const express = require('express')

const service = require('../services')
const CreateApiKeyController = require('../controllers/apiKeyController')

const router = express.Router()
const apiKeyController = CreateApiKeyController(service)

router.head('/apikey/exists', apiKeyController.checkIfApiKeyExists)

module.exports = router
