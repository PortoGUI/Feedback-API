const express = require('express')

const { expressjwt: jwt } = require('express-jwt')
const service = require('../services')
const CreateUserController = require('../controllers/userController')

const secret = process.env.SECRET_KEY || 'yek_terces'
const authMiddleware = jwt({ secret, algorithms: ['HS256'] })

const router = express.Router()
const usersController = CreateUserController(service)

router.get('/users/me', authMiddleware, usersController.getLoggerUser)
router.post('/users/me/apikey', authMiddleware, usersController.generateApiKey)

module.exports = router
