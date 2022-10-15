const User = require('./user.model')
const UserService = require('./user.service')
const AuthController = require('./auth.controller')

const userService = UserService(User);

module.exports = {
    userService: userService,
    AuthController: AuthController.authRoutes()
}