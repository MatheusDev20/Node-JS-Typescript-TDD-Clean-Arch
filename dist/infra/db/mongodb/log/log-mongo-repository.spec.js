"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_helper_1 = require("../helpers/mongo-helper");
const log_mongo_repository_1 = require("./log-mongo-repository");
const makeSut = () => {
    return new log_mongo_repository_1.LogMongoRepository();
};
describe('Log Mongo Repository', () => {
    let errorCollection;
    beforeAll(async () => {
        await mongo_helper_1.MongoHelper.connect(global.__MONGO_URI__);
    });
    afterAll(async () => {
        await mongo_helper_1.MongoHelper.closeConnection();
    });
    beforeEach(async () => {
        errorCollection = await mongo_helper_1.MongoHelper.getCollection('error');
        await errorCollection.deleteMany({});
    });
    test('Should create an error log on success', async () => {
        const sut = makeSut();
        await sut.logError('any_error');
        const count = await errorCollection.countDocuments();
        expect(count).toBe(1);
    });
});
