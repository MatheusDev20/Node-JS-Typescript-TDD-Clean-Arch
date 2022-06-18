"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const bcrypt_adapter_1 = require("./bcrypt-adapter");
jest.mock('bcrypt', () => ({
    async hash() {
        return await new Promise(resolve => resolve('test_hash'));
    },
    async compare() {
        return await new Promise(resolve => resolve(true));
    }
}));
// Mock do metodo hash da lib bcrypt para testar com o hash fixo
const salt = 12;
const makeSut = () => {
    return new bcrypt_adapter_1.BcryptAdapter(salt);
};
describe('Bcrypt Adapter', () => {
    test('Should call hash method with correct value', async () => {
        const sut = makeSut();
        const hashSpy = jest.spyOn(bcrypt_1.default, 'hash');
        await sut.hash('any_value');
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });
    test('Should return a valid hash on hash method  success', async () => {
        const sut = makeSut();
        const hash = await sut.hash('any_value');
        expect(hash).toBe('test_hash');
    });
    // test('Should call comparer method with correct value', async () => {
    //   const sut = makeSut()
    //   const compareHashSpy = jest.spyOn(bcrypt, 'compare')
    //   await sut.compare('any_value', 'any_hash')
    //   expect(compareHashSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    // })
    test('Should return true boolean when hash comparation succeed', async () => {
        const sut = makeSut();
        const isValidHash = await sut.compare('any_value', 'any_hash');
        expect(isValidHash).toBe(true);
    });
    // test('Should return false when hash comparation failed', async () => {
    //   const sut = makeSut()
    //   jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    //   const isValidHash = await sut.compare('any_value', 'any_hash')
    //   expect(isValidHash).toBe(false)
    // })
});
