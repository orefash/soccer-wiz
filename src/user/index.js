const User = require('./user.model')
const UserService = require('./user.service')
const AuthController = require('./auth.controller')



module.exports = {
    userService: UserService(User),
    AuthController: AuthController.authRoutes(UserService(User))
}