"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_controller_1 = require("./login-controller");
const errors_1 = require("../../errors");
const http_helpers_1 = require("../../helpers/http/http-helpers");
const makeValidation = () => {
    class ValidationStub {
        validate(input) {
            return null;
        }
    }
    return new ValidationStub();
};
const makeAuthentication = () => {
    class AuthenticationStub {
        async auth(authentication) {
            return await new Promise(resolve => resolve('any_token'));
        }
    }
    return new AuthenticationStub();
};
const makeFakeRequest = () => {
    return {
        body: {
            email: 'any_email@mail.com',
            password: 'any_password'
        }
    };
};
const makeSut = () => {
    const authenticationStub = makeAuthentication();
    const validationStub = makeValidation();
    const sut = new login_controller_1.LoginController(authenticationStub, validationStub);
    return {
        sut,
        authenticationStub,
        validationStub
    };
};
describe('Login Controller', () => {
    test('Should call authentication service with the corrects email and password', async () => {
        const { sut, authenticationStub } = makeSut();
        const authSpy = jest.spyOn(authenticationStub, 'auth');
        await sut.handle(makeFakeRequest());
        expect(authSpy).toHaveBeenCalledWith({
            email: 'any_email@mail.com',
            password: 'any_password'
        });
    });
    test('Should return 401 if invalid user were passed', async () => {
        const { sut, authenticationStub } = makeSut();
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)));
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual((0, http_helpers_1.unauthorized)());
    });
    test('Should return 500 if Authentication Throws', async () => {
        const { sut, authenticationStub } = makeSut();
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
            throw new Error();
        });
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual((0, http_helpers_1.serverError)(new Error()));
    });
    test('Should return 200 if valid credencias were provided', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual((0, http_helpers_1.ok)({
            accessToken: 'any_token'
        }));
    });
    // Novos testes
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
