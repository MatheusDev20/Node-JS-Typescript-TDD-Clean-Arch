"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountMongoRepository = void 0;
const mongo_helper_1 = require("../helpers/mongo-helper");
const mongodb_1 = require("mongodb");
class AccountMongoRepository {
    async add(accountData) {
        const accountCollection = mongo_helper_1.MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);
        const mongoId = result.insertedId;
        const account = {
            id: mongoId.toString(),
            name: accountData.name,
            email: accountData.email,
            password: accountData.password
        };
        return account;
    }
    async loadByEmail(email) {
        const accountCollection = await mongo_helper_1.MongoHelper.getCollection('accounts');
        const result = await accountCollection.findOne({ email });
        if (result) {
            const account = {
                id: result._id.toString(),
                name: result.name,
                email: result.email,
                password: result.password
            };
            return account;
        }
    }
    async updateAccessToken(id, accessToken) {
        const accountCollection = mongo_helper_1.MongoHelper.getCollection('accounts');
        await accountCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                accessToken: accessToken
            }
        });
    }
}
exports.AccountMongoRepository = AccountMongoRepository;
