"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../config/app"));
const mongo_helper_1 = require("../../infra/db/mongodb/helpers/mongo-helper");
const bcrypt_1 = require("bcrypt");
let accountCollection;
describe('Login Routes', () => {
    beforeAll(async () => {
        await mongo_helper_1.MongoHelper.connect(global.__MONGO_URI__);
    });
    afterAll(async () => {
        await mongo_helper_1.MongoHelper.closeConnection();
    });
    beforeEach(async () => {
        accountCollection = await mongo_helper_1.MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });
    describe('POST /signup', () => {
        test('Should Return 200 on SignUp', async () => {
            await (0, supertest_1.default)(app_1.default)
                .post('/api/signup')
                .send({
                name: 'Matheus',
                email: 'matheusdev20@gmail.com',
                password: '123',
                passwordConfirmation: '123'
            })
                .expect(200);
        });
    });
    describe('POST /login', () => {
        test('Should Return 200 on Login', async () => {
            const password = await (0, bcrypt_1.hash)('123', 12);
            await accountCollection.insertOne({
                name: 'Matheus',
                email: 'matheusdev20@gmail.com',
                password,
                passwordConfirmation: '123'
            });
            await (0, supertest_1.default)(app_1.default)
                .post('/api/login')
                .send({
                email: 'matheusdev20@gmail.com',
                password: '123'
            })
                .expect(200);
        });
        test('Should Return 401 on login with unauthorized credencials', async () => {
            await (0, supertest_1.default)(app_1.default)
                .post('/api/login')
                .send({
                email: 'matheusdev20@gmail.com',
                password: '123'
            })
                .expect(401);
        });
    });
});
