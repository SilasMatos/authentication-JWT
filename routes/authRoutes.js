// routes/userRoutes.js
const express = require('express')
const router = express.Router()
const userController = require('../controllers/authController')
const checkToken = require('../middleware/checkToken')

router.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem vindo a nossa API' })
})

router.get('/user/:id', checkToken, userController.getUserById)

router.post('/auth/register', userController.registerUser)

router.post('/auth/login', userController.loginUser)

module.exports = router
