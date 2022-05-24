"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_adapter_1 = require("./jwt-adapter");
// sign would be the jwt lib method to generate a new JWT
const makeSut = () => {
    return new jwt_adapter_1.JwtAdapter('secret');
};
jest.mock('jsonwebtoken', () => ({
    async sign() {
        return await new Promise(resolve => resolve('any_token'));
    }
}));
describe('JWT Adapter', () => {
    test('Should Call sign with correct values', async () => {
        const sut = makeSut();
        const signSpy = jest.spyOn(jsonwebtoken_1.default, 'sign');
        await sut.encrypt('any_user_id');
        expect(signSpy).toHaveBeenCalledWith({ id: 'any_user_id' }, 'secret');
    });
    test('Should return a Token on sign success', async () => {
        const sut = makeSut();
        const accessToken = await sut.encrypt('any_user_id');
        expect(accessToken).toBe('any_token');
    });
    test('Should Throw an error if sign method thrown an error', async () => {
        const sut = makeSut();
        jest.spyOn(jsonwebtoken_1.default, 'sign').mockImplementationOnce(() => {
            throw new Error();
        });
        const promise = sut.encrypt('any_user_id');
        await expect(promise).rejects.toThrow();
    });
});
