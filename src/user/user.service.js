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

const addGoogleUser = (User) => async ({ googleId, email, profilePhoto }) => {

    // let generatedUsername = await generateUniqueUserName(User, email);

    // console.log("Gen uname: ", generatedUsername)


    const user = new User({
        googleId, email, profilePhoto, source: "google",
    })
    return await user.save()
}

const addFacebookUser = (User) => async ({ facebookId, email, profilePhoto }) => {

    // let generatedUsername = await generateUniqueUserName(User, email);

    // console.log("Gen uname: ", generatedUsername)


    const user = new User({
        facebookId, email, profilePhoto, source: "facebook",
    })
    return await user.save()
}

const addLocalUser =  (User) => async ({ email, phone, password, country }) => {

    const hashedPassword = await bcrypt.hash(password, 10)

    // let generatedUsername = await generateUniqueUserName(User, email);


    const user = new User({
        email, password: hashedPassword, source: "local", country
    })
    return user.save()
}

const getUsers = (User) => async () => {
    // console.log("in users service")
    let users = await User.find({});
    // console.log("in users service: users: - ", users)
    return users
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

const updateUsername = (User) => async (id, { username }) => {

    let user = await getUserByUsername(User)(username);

    if(user) throw new Error('Username Already Exists!!')

    const updatedUser = await User.findByIdAndUpdate(id, { username }, {
        new: true,
    });

    return updatedUser
}


const updateGameRecords = (User) => async ({ id, score }) => {

    // console.log('in update records: score: ', score)
    

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

const updateWalletBalance = (User) => async ({ id, credits }) => {

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            $inc: { 'wallet_balance': credits } 
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
        addFacebookUser: addFacebookUser(User),
        addLocalUser: addLocalUser(User),
        getUsers: getUsers(User),
        getUserByEmail: getUserByEmail(User),
        getUserById: getUserById(User),
        updateUsernameAndCountry: updateUsernameAndCountry(User),
        updateUsername: updateUsername(User),
        getUserByUsername: getUserByUsername(User),
        updateGameRecords: updateGameRecords(User),
        updateWalletBalance: updateWalletBalance(User)
    }
}