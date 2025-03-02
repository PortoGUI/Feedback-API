const express = require('express')

// const createAuthRoutes = require('./authRoutes')
// const createUserRoutes = require('./userRoutes')
// const createApiKeyRoutes = require('./apiKeyRoutes')
// const createFeedbackRoutes = require('./feedbackRoutes')

const createTempRoutes = require('./tempRoutes')

function createRoutes(database) {
  const router = express.Router()

  router.get('/ping', (_, res) => { res.json('Pong 🏓') })

  // router.use('/api', createUserRoutes(database))
  // router.use('/api', createApiKeyRoutes(database))
  // router.use('/api', createAuthRoutes(database))
  // router.use('/api', createFeedbackRoutes(database))

  router.use('/api', createTempRoutes(database))

  return router
}

module.exports = createRoutes
