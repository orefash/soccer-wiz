const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = MongoMemoryServer.create();

const connect = async () => {
    const uri = await (await mongod).getUri();
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10
    };
    await mongoose.connect(uri, mongooseOpts);
}
const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    // await mongod.stop();
}
const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

const getConnection = async () => {
    return mongoose.connection
}

module.exports = {
    clearDatabase: clearDatabase,
    closeDatabase: closeDatabase,
    connect: connect,
    getConnection: getConnection
}