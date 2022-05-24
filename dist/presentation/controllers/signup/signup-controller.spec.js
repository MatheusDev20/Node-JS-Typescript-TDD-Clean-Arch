"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signup_controller_1 = require("./signup-controller");
const errors_1 = require("../../errors");
const http_helpers_1 = require("../../helpers/http/http-helpers");
const makeAddAcount = () => {
    class AddAcountStub {
        async add(account) {
            return await new Promise(resolve => resolve(makeFakeAccount()));
        }
    }
    return new AddAcountStub();
};
const makeFakeRequest = () => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
});
const makeFakeAccount = () => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@gmail.com',
    password: 'valid_password'
});
const makeValidation = () => {
    class ValidationStub {
        validate(input) {
            return null;
        }
    }
    return new ValidationStub();
};
const makeSut = () => {
    const validationStub = makeValidation();
    const addAcountStub = makeAddAcount();
    const sut = new signup_controller_1.SignUpController(addAcountStub, validationStub);
    return {
        sut,
        addAcountStub,
        validationStub
    };
};
describe('SignUpController', () => {
    test('Should Call AddAccount with the correct Values', async () => {
        const { sut, addAcountStub } = makeSut();
        const isValidSpy = jest.spyOn(addAcountStub, 'add');
        await sut.handle(makeFakeRequest());
        expect(isValidSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        });
    });
    test('Should return 500 if add acount throws an exception', async () => {
        const { sut, addAcountStub } = makeSut();
        jest.spyOn(addAcountStub, 'add').mockImplementationOnce(async () => {
            return await new Promise((resolve, reject) => {
                reject(new Error());
            });
        });
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual((0, http_helpers_1.serverError)(new errors_1.ServerError('Error Trace')));
    });
    test('Should call validation with correct value', async () => {
        const { sut, validationStub } = makeSut();
        const validateSpy = jest.spyOn(validationStub, 'validate');
        const httpRequest = makeFakeRequest();
        await sut.handle(httpRequest);
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
    });
    test('Should return 400 if Validation return an error', async () => {
        const { sut, validationStub } = makeSut();
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new errors_1.MissingParamError('any_field'));
        const httpRequest = makeFakeRequest();
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual((0, http_helpers_1.badRequest)(new errors_1.MissingParamError('any_field')));
    });
});
