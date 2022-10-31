// const uuid = require("uuid");
const bcrypt = require("bcrypt");

const { generateUsernameFromEmail } = require("../utils/usernameGenerator");

function generateUniqueUserName(User, email) {
    let proposedName = generateUsernameFromEmail(email, 2);
    return User
      .findOne({username: proposedName})
      .then(function(account) {
        if (account) {
        //   console.log('no can do try again: ' + proposedName);
          return generateUniqueUserName(User, email); 
        }
        // console.log('proposed name is unique' + proposedName);
        return proposedName;
      })
      .catch(function(err) {
        console.error(err);
        throw err;
      });
  }

const addGoogleUser = (User) => async ({ email, firstName, lastName, profilePhoto }) => {

    let generatedUsername = await generateUniqueUserName(User, email);

    // console.log("Gen uname: ", generatedUsername)

    const user = new User({
        email, firstName, lastName, profilePhoto, source: "google", username: generatedUsername
    })
    return await user.save()
}

const addLocalUser =  (User) => async ({ email, firstName, lastName, password }) => {

    const hashedPassword = await bcrypt.hash(password, 10)

    let generatedUsername = await generateUniqueUserName(User, email);


    const user = new User({
        email, firstName, lastName, password: hashedPassword, source: "local", username: generatedUsername
    })
    return user.save()
}

const getUsers = (User) => () => {
    return User.find({})
}

const getUserByEmail = (User) => async ( email ) => {
    return await User.findOne({ email })
}

const getUserById = (User) => async (id) => {
    return await User.findOne({ _id: id })
}

const getUserByUsername = (User) => async (username) => {
    return await User.findOne({ username })
}

const updateUsernameAndCountry = (User) => async (id, { username, country }) => {

    const updatedUser = await User.findByIdAndUpdate(id, { username, country }, {
        new: true,
    });

    return updatedUser
}


const updateGameRecords = (User) => async ({ id, score }) => {

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            $inc: { 'totalScore': score, 'gamesPlayed': 1  } 
        },
        {
            new: true,
        }
    );

    return updatedUser
}



module.exports = (User) => {
    return {
        addGoogleUser: addGoogleUser(User),
        addLocalUser: addLocalUser(User),
        getUsers: getUsers(User),
        getUserByEmail: getUserByEmail(User),
        getUserById: getUserById(User),
        updateUsernameAndCountry: updateUsernameAndCountry(User),
        getUserByUsername: getUserByUsername(User),
        updateGameRecords: updateGameRecords(User)
    }
}