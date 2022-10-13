const uuid = require("uuid");
const bcrypt = require("bcrypt");

// const addGoogleUser = (User) => ({ id, email, firstName, lastName, profilePhoto }) => {
//     const user = new User({
//         id, email, firstName, lastName, profilePhoto, source: "google"
//     })
//     return user.save()
// }

const addAdminUser = async (Admin) => ({ email, firstName, lastName, password }) => {

    const hashedPassword = bcrypt.hash(password, 10)

    const admin = new Admin({
        id: uuid.v4(), email, firstName, lastName, password: hashedPassword, source: "local"
    })
    return admin.save()
}

const getAdmins = (Admin) => () => {
    return Admin.find({})
}

const getAdminByEmail = (Admin) => async ({ email }) => {
    return await Admin.findOne({ email })
}

module.exports = (Admin) => {
    return {
        // addGoogleUser: addGoogleUser(User),

        addAdminUser: addAdminUser(Admin),
        getAdmins: getAdmins(Admin),
        getAdminByEmail: getAdminByEmail(Admin)
    }
}