const uuid = require("uuid");
const bcrypt = require("bcrypt");

const addGoogleUser = (User) => ({ id, email, firstName, lastName, profilePhoto }) => {
    const user = new User({
        id, email, firstName, lastName, profilePhoto, source: "google"
    })
    return user.save()
}

const addLocalUser = async (User) => ({ email, firstName, lastName, password }) => {

    const hashedPassword = bcrypt.hash(password, 10)

    const user = new User({
        id: uuid.v4(), email, firstName, lastName, password: hashedPassword, source: "local"
    })
    return user.save()
}

const getUsers = (User) => () => {
    return User.find({})
}

const getUserByEmail = (User) => async ({ email }) => {
    return await User.findOne({ email })
}

const getUserById = (User) => async ( id ) => {
    return await User.findOne({ id })
}

const updateUsernameAndCountry = (User) => (id, { username, country }) => {

    const updatedUser = User.findByIdAndUpdate(id, { username, country }, {
        new: true,
    });

    return updatedUser
}



module.exports = (User) => {
    return {
        addGoogleUser: addGoogleUser(User),
        addLocalUser: addLocalUser(User),
        getUsers: getUsers(User),
        getUserByEmail: getUserByEmail(User),
        getUserById: getUserById(User),
        updateUsernameAndCountry: updateUsernameAndCountry(User)
    }
}