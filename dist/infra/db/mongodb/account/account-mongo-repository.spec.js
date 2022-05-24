"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_helper_1 = require("../helpers/mongo-helper");
const account_mongo_repository_1 = require("./account-mongo-repository");
let accountCollection;
describe('Mongodb Account Repository', () => {
    beforeAll(async () => {
        await mongo_helper_1.MongoHelper.connect(global.__MONGO_URI__);
    });
    afterAll(async () => {
        await mongo_helper_1.MongoHelper.closeConnection();
    });
    beforeEach(async () => {
        accountCollection = mongo_helper_1.MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });
    const makeSut = () => {
        return new account_mongo_repository_1.AccountMongoRepository();
    };
    test('Should return an account on insert success', async () => {
        const sut = makeSut();
        const account = await sut.add({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        });
        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe('any_name');
        expect(account.email).toBe('any_email@mail.com');
        expect(account.password).toBe('any_password');
    });
    test('Should return an account on loadByEmailSuccess', async () => {
        const sut = makeSut();
        await accountCollection.insertOne({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        });
        const account = await sut.loadByEmail('any_email@mail.com');
        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe('any_name');
        expect(account.email).toBe('any_email@mail.com');
        expect(account.password).toBe('any_password');
    });
    test('Should return null if LoadByEmailFails', async () => {
        const sut = makeSut();
        const account = await sut.loadByEmail('any_email2@mail.com');
        expect(account).toBeFalsy();
    });
    test('Should update the accountAccessToken on updateAccessToken success', async () => {
        const sut = makeSut();
        const result = await accountCollection.insertOne({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        });
        const mongoId = result.insertedId;
        await sut.updateAccessToken(String(result.insertedId), 'any_token');
        const account = await accountCollection.findOne({ _id: result.insertedId });
        expect(account).toBeTruthy();
        expect(account);
    });
});
