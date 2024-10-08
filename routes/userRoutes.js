const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.post('/forgotpassword', userController.forgotPassword)
router.post('/resetpassword', userController.resetPassword)

module.exports = router