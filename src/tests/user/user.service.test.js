const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')

const { User } = require('../../user')
const UserService = require('../../user/user.service');

const userService = UserService(User);

// const getUserById = jest.fn();
// when(getUserById).calledWith('low_bal_id').mockReturnValue({
//     wallet_balance: 0
// })
// when(getUserById).calledWith('invalid_id').mockReturnValue(null)
// when(getUserById).calledWith('good_bal').mockReturnValue({
//     wallet_balance: 100
// })

// let userService = {
//     getUserById: getUserById
// }

// const questionService = QuestionService(Question, userService);


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())

describe('User Service', () => {

    describe('addGoogleUser', () => {
        it('should save details of user logged in with Google and return details', async () => {

            const newUser = {
                email: "orefash@gmail.com",
                profilePhoto: "url",
                source: "google"
            }

            const savedUser = await userService.addGoogleUser(newUser);

            expect(savedUser.email).toEqual(newUser.email)
            expect(savedUser.profilePhoto).toEqual(newUser.profilePhoto)
            expect(savedUser.source).toEqual("google")

        })
    })

    describe('addFacebookUser', () => {
        it('should save details of user logged in with Facebook and return details', async () => {

            const newUser = {
                email: "orefash@gmail.com",
                profilePhoto: "url",
                source: "facebook"
            }

            const savedUser = await userService.addFacebookUser(newUser);

            expect(savedUser.email).toEqual(newUser.email)
            expect(savedUser.profilePhoto).toEqual(newUser.profilePhoto)
            expect(savedUser.source).toEqual("facebook")

        })
    })

    describe('addAdminUser', () => {
        it('should save details of admin user and return details', async () => {

            const newUser = {
                email: "orefash@gmail.com",
                password: "password"
            }

            const savedUser = await userService.addAdminUser(newUser);

            expect(savedUser.email).toEqual(newUser.email)
            expect(savedUser.role).toEqual("ADMIN")
            expect(savedUser.source).toEqual("local")

        })
    })


    describe('addLocalUser', () => {
        it('should save details of user logged in with username and password and return details', async () => {

            const newUser = {
                email: "orefash@gmail.com",
                password: "password",
                source: "local"
            }

            const savedUser = await userService.addLocalUser(newUser);

            expect(savedUser.email).toEqual(newUser.email)
            // expect(savedUser.profilePhoto).toEqual(newUser.profilePhoto)
            expect(savedUser.source).toEqual("local")

        })
    })

    describe('getUsers', () => {
        it('should return all Users', async () => {

            const newUser1 = {
                email: "orefash1@gmail.com",
                source: "google"
            }

            const newUser2 = {
                email: "orefash@gmail.com",
                source: "google"
            }

            await userService.addGoogleUser(newUser1);
            await userService.addGoogleUser(newUser2);

            const allUsers = await userService.getUsers();

            expect(allUsers.length).toEqual(2);

        })
    })


    describe('getUserById', () => {
        it('should be able to get User By Id', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                source: "google"
            }

            const createdUser = await userService.addGoogleUser(newUser1);

            const fetchedUser = await userService.getUserById(createdUser._id);

            expect(createdUser.email).toEqual(fetchedUser.email);

        })

    })


    describe('getUserByEmail', () => {
        it('should be able to get User By Email', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                source: "google"
            }

            const createdUser = await userService.addGoogleUser(newUser1);

            const fetchedUser = await userService.getUserByEmail(createdUser.email);

            expect(createdUser.email).toEqual(fetchedUser.email);

        })

    })

    describe('getUserByPhone', () => {
        it('should be able to get User By Phone', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                phone: "08023238002",
                source: "local",
                country: "NG"
            }

            const createdUser = await userService.addLocalUser(newUser1);

            const fetchedUser = await userService.getUserByPhone(createdUser.phone);

            expect(createdUser.phone).toEqual(fetchedUser.phone);

        })

    })


    describe('getUserByUsername', () => {
        it('should be able to get User By Username', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                firstName: "Ore",
                lastName: "Faseru",
                profilePhoto: "url",
                source: "google",
                username: "user1"
            }

            const user = new User(newUser1)
            const createdUser =  await user.save()

            const fetchedUser = await userService.getUserByUsername(createdUser.username);

            expect(createdUser.username).toEqual(fetchedUser.username);
            expect(createdUser.email).toEqual(fetchedUser.email);

        })

    })


    describe('updateUser', () => {
        it('should be able to get update User country and username', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                firstName: "Ore",
                lastName: "Faseru",
                profilePhoto: "url",
                source: "google",
                username: "user1",
                country: "Nigeria"
            }

            const user = new User(newUser1)
            const createdUser =  await user.save()

            const updateData = {
                username: "user2",
                country: "Kenya"
            }

            const updatedUser = await userService.updateUsernameAndCountry(createdUser._id, updateData);


            const fetchedUser = await userService.getUserById(createdUser._id);


            expect(updateData.username).toEqual(fetchedUser.username);
            expect(updateData.country).toEqual(fetchedUser.country);

        })

    })


    describe('updateWithdrawalSettings', () => {
        it('should be able to get update User reward settings (phone, network, bank, bank account', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                source: "google",
                username: "user1"
            }

            const user = new User(newUser1)
            const createdUser =  await user.save()

            const updateData = {
                phone: "08023238002",
                network: "MTN",
                bank: "GTB",
                account_number: '0012345678'
            }

            const updatedUser = await userService.updateWithdrawalSettings(createdUser._id, updateData);


            const fetchedUser = await userService.getUserById(createdUser._id);


            expect(updateData.phone).toEqual(fetchedUser.phone);
            expect(updateData.network).toEqual(fetchedUser.network);
            expect(updateData.bank).toEqual(fetchedUser.account.bank);
            expect(updateData.account_number).toEqual(fetchedUser.account.number);

        })

    })

    describe('updateProfileDetails', () => {
        it('should be able to get update User profile settings (email, fullName)', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                source: "google",
                username: "user1"
            }

            const user = new User(newUser1)
            const createdUser =  await user.save()

            const updateData = {
                email: "o@mail.com",
                fullName: "John doe",
            }

            const updatedUser = await userService.updateProfileDetails(createdUser._id, updateData);


            const fetchedUser = await userService.getUserById(createdUser._id);

            console.log('fetched: ', updatedUser)


            expect(updateData.email).toEqual(fetchedUser.email);
            expect(updateData.fullName).toEqual(fetchedUser.fullName);

        })

    })


    describe('updateUsername', () => {
        it('should be able to update username', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                source: "google",
                country: "Nigeria"
            }

            const user = new User(newUser1)
            const createdUser =  await user.save()

            const updateData = {
                username: "user2"
            }

            const updatedUser = await userService.updateUsername(createdUser._id, updateData);


            const fetchedUser = await userService.getUserById(createdUser._id);


            expect(updateData.username).toEqual(fetchedUser.username);

        })


        it('should be throw error if username already exists in db', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                source: "google",
                country: "Nigeria"
            }

            const newUser2 = {
                email: "orefash1@gmail.com",
                source: "google",
                country: "Nigeria",
                username: "user2"
            }

            const user = new User(newUser1)
            const createdUser =  await user.save()

            const user1 = new User(newUser2)
            const createdUser2 =  await user1.save()

            const updateData = {
                username: "user2"
            }

            await expect( userService.updateUsername(createdUser._id, updateData) ).rejects.toThrow()

        })

    })


    describe('toggleUserStatus', () => {
        it('should be able to toggle user status from suspended to active', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                source: "google",
                country: "Nigeria",
                status: 'suspended'
            }

            const user = new User(newUser1)
            const createdUser =  await user.save()

            const updatedUser = await userService.toggleUserStatus(createdUser._id);


            const fetchedUser = await userService.getUserById(createdUser._id);


            expect(createdUser.status).not.toEqual(fetchedUser.status);
            expect(fetchedUser.status).toEqual('active');

        })

        it('should be able to toggle user status from active to suspended', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                source: "google",
                country: "Nigeria",
                status: 'active'
            }

            const user = new User(newUser1)
            const createdUser =  await user.save()

            const updatedUser = await userService.toggleUserStatus(createdUser._id);


            const fetchedUser = await userService.getUserById(createdUser._id);


            expect(createdUser.status).not.toEqual(fetchedUser.status);
            expect(fetchedUser.status).toEqual('suspended');

        })


        it('should be throw error if username already exists in db', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                source: "google",
                country: "Nigeria"
            }

            const newUser2 = {
                email: "orefash1@gmail.com",
                source: "google",
                country: "Nigeria",
                username: "user2"
            }

            const user = new User(newUser1)
            const createdUser =  await user.save()

            const user1 = new User(newUser2)
            const createdUser2 =  await user1.save()

            const updateData = {
                username: "user2"
            }

            await expect( userService.updateUsername(createdUser._id, updateData) ).rejects.toThrow()

        })

    })


    describe('updateGameRecords', () => {
        it('should be able to get update User game records - gamesplayed & scores', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                firstName: "Ore",
                lastName: "Faseru",
                profilePhoto: "url",
                source: "google",
                
            }

            const user = new User(newUser1)
            const createdUser =  await user.save()

            expect(createdUser.totalScore).toEqual(0);
            expect(createdUser.gamesPlayed).toEqual(0);

            const updateData = {
                id: createdUser._id,
                score: 23
            }

            const updateData2 = {
                id: createdUser._id,
                score: 10
            }

            const updatedUser = await userService.updateGameRecords(updateData);
            const updatedUser1 = await userService.updateGameRecords(updateData2);

            // console.log('uservice: - ', updatedUser)s

            const fetchedUser = await userService.getUserById(createdUser._id);
            // console.log('uservice: - ', fetchedUser)


            expect(fetchedUser.totalScore).toEqual(33);
            expect(fetchedUser.gamesPlayed).toEqual(2);

        })

    })


    describe('updateWalletBalance', () => {
        it('should be able to update User wallet Balance', async () => {

            const newUser1 = {
                email: "orefash@gmail.com",
                firstName: "Ore",
                lastName: "Faseru",
                profilePhoto: "url",
                source: "google",
            }

            const user = new User(newUser1)
            const createdUser =  await user.save()

            expect(createdUser.wallet_balance).toEqual(0);

            const updateData1 = {
                id: createdUser._id,
                credits: 20
            }

            const updateData2 = {
                id: createdUser._id,
                credits: -8
            }

            await userService.updateWalletBalance(updateData1);

            const fetchedUser1 = await userService.getUserById(createdUser._id);

            expect(fetchedUser1.wallet_balance).toEqual(20);
            

            await userService.updateWalletBalance(updateData2);

            const fetchedUser2 = await userService.getUserById(createdUser._id);

            expect(fetchedUser2.wallet_balance).toEqual(12);

        })

    })


})