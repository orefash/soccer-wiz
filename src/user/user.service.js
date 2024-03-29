

const addGoogleUser = (User) => async ({ googleId, email, profilePhoto }) => {

    const user = new User({
        googleId, email, profilePhoto, source: "google", wallet_balance: 20
    })
    return await user.save()
}

const addFacebookUser = (User) => async ({ facebookId, email, profilePhoto }) => {

    const user = new User({
        facebookId, email, profilePhoto, source: "facebook", wallet_balance: 20
    })
    return await user.save()
}

const addLocalUser = (User) => async ({ email, phone, password, country, role, username }) => {

    const user = new User({
        email, password, source: "local", country, phone, role, username, wallet_balance: 20
    })
    return user.save()
}

const addAdminUser = (User) => async ({ email, password }) => {

    const user = new User({
        email, password, source: "local", role: "ADMIN"
    })
    return user.save()
}

const getUsers = (User) => async (filter = {}) => {
    // console.log("in users service")

    let users = await User.find(filter);
    // console.log("in users service: users: - ", users)
    return users
}

const getUserByEmail = (User) => async (email) => {
    return await User.findOne({ email })
}

const getUserByPhone = (User) => async (phone) => {
    return await User.findOne({ phone })
}

const getUserById = (User) => async (id) => {
    return await User.findOne({ _id: id })
}

const getUserByUsername = (User) => async (username) => {
    return await User.findOne({ username })
}

const updateUser = (User) => async (id, updateQuery) => {

    const updatedUser = await User.findByIdAndUpdate(id, updateQuery, {
        new: true,
    });

    return updatedUser
}


const updateWithdrawalSettings = (User) => async (id, { phone, network, account_number, bank }) => {

    let account = {
        number: account_number,
        bank
    }

    const updatedUser = await User.findByIdAndUpdate(id, { phone, network, account }, {
        new: true,
    });

    if (!updatedUser) throw new Error('Invalid User!!')

    return updatedUser
}


const updateProfileDetails = (User) => async (id, { email, fullName }) => {

    const updatedUser = await User.findByIdAndUpdate(id, { email, fullName }, {
        new: true,
    });

    if (!updatedUser) throw new Error('Invalid User!!')

    return updatedUser
}

const updateUsername = (User) => async (id, { username }) => {

    try {
        let user = await getUserByUsername(User)(username);

        if (user) throw new Error('Username Already Exists!!')

        let updatedUser = await User.findByIdAndUpdate(id, { username }, {
            new: true,
        });

        // console.log('Updated user: ', updatedUser)

        if (!updatedUser) throw new Error('Username is Invalid!!')

        return updatedUser

    } catch (err) {
        // console.log("in upd: ", err.message)
        throw new Error(err.message)
    }


}


const toggleUserStatus = (User) => async (id) => {

    let activeStatus = 'active', suspendedStatus = 'suspended';

    let setStatus = activeStatus;

    let user = await getUserById(User)(id);

    if (!user) throw new Error('User Does not Exist!!!')

    if (user.status == activeStatus) setStatus = suspendedStatus

    const updatedUser = await User.findByIdAndUpdate(id, { status: setStatus }, {
        new: true,
    });

    if (!updatedUser) throw new Error('Username is Invalid!!')

    return updatedUser
}


const updateGameRecords = (User) => async ({ id, score }) => {

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            $inc: { 'totalScore': score, 'gamesPlayed': 1 }
        },
        {
            new: true,
        }
    );

    return updatedUser
}

const updateWalletBalance = (User) => async ({ id, credits }, session = null) => {

    let opts = {
        new: true
    }

    if(session) opts.session = session

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            $inc: { 'wallet_balance': credits }
        },
        opts
    );

    return updatedUser
}




module.exports = (User) => {
    return {
        addGoogleUser: addGoogleUser(User),
        addFacebookUser: addFacebookUser(User),
        addLocalUser: addLocalUser(User),
        addAdminUser: addAdminUser(User),
        getUsers: getUsers(User),
        getUserByEmail: getUserByEmail(User),
        getUserById: getUserById(User),
        updateUser: updateUser(User),
        updateUsername: updateUsername(User),
        getUserByUsername: getUserByUsername(User),
        updateGameRecords: updateGameRecords(User),
        updateWalletBalance: updateWalletBalance(User),
        updateWithdrawalSettings: updateWithdrawalSettings(User),
        updateProfileDetails: updateProfileDetails(User),
        getUserByPhone: getUserByPhone(User),
        toggleUserStatus: toggleUserStatus(User)
    }
}