const express = require('express')

const service = require('../services')
const { expressjwt: jwt } = require('express-jwt')
const CreateFeedbackController = require('../controllers/feedbackController')

const secret = process.env.SECRET_KEY || 'yek_terces'
const authMiddleware = jwt({ secret, algorithms: ['HS256'] })

const router = express.Router()
const feedbacksController = CreateFeedbackController(service)

router.post('/feedbacks', feedbacksController.create)
router.get('/feedbacks', authMiddleware, feedbacksController.getFeedbacks)
router.get('/feedbacks/summary', authMiddleware, feedbacksController.getSummary)

module.exports = router
