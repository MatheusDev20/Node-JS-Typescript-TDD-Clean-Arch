"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_validation_1 = require("./email-validation");
const errors_1 = require("../../errors");
const makeEmailValidator = () => {
    class EmailValidatorStub {
        isValid(email) {
            return true;
        }
    }
    return new EmailValidatorStub();
};
const makeSut = () => {
    const emailValidatorStub = makeEmailValidator();
    const sut = new email_validation_1.EmailValidation('email', emailValidatorStub);
    return {
        sut,
        emailValidatorStub
    };
};
describe('SignUpController', () => {
    test('Should return an error if EmailValidator returns false', () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
        const err = sut.validate({ email: 'any_email@mail.com' });
        expect(err).toEqual(new errors_1.InvalidParamError('email'));
    });
    test('Should call EmailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        sut.validate({ email: 'any_email@mail.com' });
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
    });
    test('Should Throw if email validator Throws', () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });
        expect(sut.validate).toThrow();
    });
});
