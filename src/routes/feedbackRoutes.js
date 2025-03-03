const express = require('express')

const createService = require('../services')
const createMockService = require('../services/mock')
const CreateFeedbackController = require('../controllers/feedbackController')

const { expressjwt: jwt } = require('express-jwt')

const secret = process.env.SECRET_KEY || 'yek_terces'
const authMiddleware = jwt({ secret, algorithms: ['HS256'] })

function createFeedbackRoutes(database) {
  const router = express.Router()
  const service = createService()
  const mockService = createMockService(database)
  const feedbacksController = CreateFeedbackController(process.env.NODE_ENV === 'production' ? service : mockService)

  router.post('/feedbacks', feedbacksController.create)
  router.get('/feedbacks', authMiddleware, feedbacksController.getFeedbacks)
  router.get('/feedbacks/summary', authMiddleware, feedbacksController.getSummary)

  return router
}

module.exports = createFeedbackRoutes
