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
                firstName: "Ore",
                lastName: "Faseru",
                profilePhoto: "url",
                source: "google"
            }

            const savedUser = await userService.addGoogleUser(newUser);

            expect(savedUser.email).toEqual(newUser.email)
            expect(savedUser.firstName).toEqual(newUser.firstName)
            expect(savedUser.lastName).toEqual(newUser.lastName)
            expect(savedUser.profilePhoto).toEqual(newUser.profilePhoto)
            expect(savedUser.source).toEqual("google")

        })
    })


    describe('addLocalUser', () => {
        it('should save details of user logged in with username and password and return details', async () => {

            const newUser = {
                email: "orefash@gmail.com",
                firstName: "Ore",
                lastName: "Faseru",
                password: "password",
                source: "local"
            }

            const savedUser = await userService.addLocalUser(newUser);

            expect(savedUser.email).toEqual(newUser.email)
            expect(savedUser.firstName).toEqual(newUser.firstName)
            expect(savedUser.lastName).toEqual(newUser.lastName)
            // expect(savedUser.profilePhoto).toEqual(newUser.profilePhoto)
            expect(savedUser.source).toEqual("local")

        })
    })

    describe('getUsers', () => {
        it('should return all Users', async () => {

            const newUser1 = {
                email: "orefash1@gmail.com",
                firstName: "Ore",
                lastName: "Fash",
                profilePhoto: "url",
                source: "google"
            }

            const newUser2 = {
                email: "orefash@gmail.com",
                firstName: "Ore",
                lastName: "Faseru",
                profilePhoto: "url",
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
                firstName: "Ore",
                lastName: "Faseru",
                profilePhoto: "url",
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
                firstName: "Ore",
                lastName: "Faseru",
                profilePhoto: "url",
                source: "google"
            }

            const createdUser = await userService.addGoogleUser(newUser1);

            const fetchedUser = await userService.getUserByEmail(createdUser.email);

            expect(createdUser.email).toEqual(fetchedUser.email);

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


    describe('updateUsernameAndCountry', () => {
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

            const updatedUser = await userService.updateGameRecords(updateData);

            const fetchedUser = await userService.getUserById(createdUser._id);


            expect(fetchedUser.totalScore).toEqual(updateData.score);
            expect(fetchedUser.gamesPlayed).toEqual(1);

        })

    })


})