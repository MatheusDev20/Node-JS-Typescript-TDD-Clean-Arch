"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    mongoUrl: (_a = process.env.MONGO_URL) !== null && _a !== void 0 ? _a : 'mongodb://localhost:27017/clean-node-api',
    port: (_b = process.env.PORT) !== null && _b !== void 0 ? _b : 5050,
    jwtSecret: process.env.JWT_SECRET || 'wqE61#12C'
};
