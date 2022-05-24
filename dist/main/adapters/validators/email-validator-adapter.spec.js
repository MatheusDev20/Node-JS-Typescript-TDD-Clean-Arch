"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_validator_adapter_1 = require("./email-validator-adapter");
const validator_1 = __importDefault(require("validator"));
jest.mock('validator', () => ({
    isEmail() {
        return true;
    }
}));
const makeSut = () => {
    return new email_validator_adapter_1.EmailValidatorAdapter();
};
describe('EmailValidator Adapter', () => {
    test('Should return false if validator returns false', () => {
        const sut = makeSut();
        jest.spyOn(validator_1.default, 'isEmail').mockReturnValueOnce(false);
        const isValid = sut.isValid('invalid_email@nail.com');
        expect(isValid).toBe(false);
    });
    test('Should return true if validator returns true', () => {
        const sut = makeSut();
        const isValid = sut.isValid('valid_email@mail.com');
        expect(isValid).toBe(true);
    });
    test('Should called Email validator with correct email', () => {
        const sut = makeSut();
        const isEmailSpy = jest.spyOn(validator_1.default, 'isEmail');
        sut.isValid('any_email@mail.com');
        expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
    });
});
