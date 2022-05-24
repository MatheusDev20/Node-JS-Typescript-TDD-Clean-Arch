"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoHelper = void 0;
const mongodb_1 = require("mongodb");
exports.MongoHelper = {
    client: null,
    db: null,
    async connect(uri) {
        this.client = await mongodb_1.MongoClient.connect(uri);
        this.db = this.client.db();
    },
    async closeConnection() {
        await this.client.close();
    },
    getCollection(name) {
        return this.db.collection(name);
    }
};
