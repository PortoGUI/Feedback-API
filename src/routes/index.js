const express = require('express')

const router = express.Router()
const authRoutes = require('./authRoutes')
const userRoutes = require('./userRoutes')
const apiKeyRoutes = require('./apiKeyRoutes')
const feedbackRoutes = require('./feedbackRoutes')

router.get('/ping', (_, res) => { res.json('Pong 🏓') })

router.use('/api', userRoutes)
router.use('/api', apiKeyRoutes)
router.use('/api', authRoutes)
router.use('/api', feedbackRoutes)

module.exports = router
