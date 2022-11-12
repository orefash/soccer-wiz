const User = require('./user.model')
const UserService = require('./user.service')
const GoogleAuthController = require('./auth/googleAuth.controller')
const LocalAuthController = require('./auth/localAuth.controller')
const FacebookAuthController = require('./auth/facebookAuth.controller')
const UserController = require('./user.controller')

const userService = UserService(User);

module.exports = {
    userService: userService,
    User: User,
    LocalAuthController: LocalAuthController.authRoutes(),
    GoogleAuthController: GoogleAuthController.authRoutes(),
    FacebookAuthController: FacebookAuthController.authRoutes(),
    UserController: UserController.userRoutes(userService)
}