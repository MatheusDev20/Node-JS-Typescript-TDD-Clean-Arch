"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
class ServerError extends Error {
    constructor(stack) {
        super('An Error ocurred');
        this.name = 'Server Error';
        this.stack = stack;
    }
}
exports.ServerError = ServerError;
