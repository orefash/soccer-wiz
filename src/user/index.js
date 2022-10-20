const User = require('./user.model')
const UserService = require('./user.service')
const AuthController = require('./auth.controller')
const UserController = require('./user.controller')

const userService = UserService(User);

module.exports = {
    userService: userService,
    // User: User,
    AuthController: AuthController.authRoutes(),
    UserController: UserController.userRoutes(userService)
}