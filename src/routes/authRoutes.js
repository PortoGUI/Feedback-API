const express = require('express')

const service = require('../services')
const CreateUserController = require('../controllers/authContoller')

const router = express.Router()
const authController = CreateUserController(service)

router.post('/auth/login', authController.login)
router.post('/auth/register', authController.create)

module.exports = router
