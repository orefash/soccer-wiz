const Admin = require('./admin.model')
const AdminService = require('./admin.service')
const AdminController = require('./admin.controller')



module.exports = {
    adminService: AdminService(Admin),
    // AdminController: AdminController.authRoutes(UserService(User))
}