"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_controller_decorator_1 = require("./log-controller-decorator");
const http_helpers_1 = require("../../presentation/helpers/http/http-helpers");
const makeLogErrorRepository = () => {
    class LogErrorRepositoryStub {
        async logError(stack) {
            return await new Promise(resolve => resolve());
        }
    }
    return new LogErrorRepositoryStub();
};
const makeController = () => {
    class ControllerStub {
        async handle(httpRequest) {
            const httpResponse = {
                statusCode: 200,
                body: {
                    name: 'Matheus'
                }
            };
            return await new Promise(resolve => resolve(httpResponse));
        }
    }
    const controllerStub = new ControllerStub();
    return controllerStub;
};
const makeFakeRequest = () => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
});
const makeSut = () => {
    const controllerStub = makeController();
    const logErrorStub = makeLogErrorRepository();
    const sut = new log_controller_decorator_1.LogControllerDecorator(controllerStub, logErrorStub);
    return {
        sut,
        controllerStub,
        logErrorStub
    };
};
describe('LogController Decorator', () => {
    test('Should call handle method from implemented controller', async () => {
        const { sut, controllerStub } = makeSut();
        const handleSpy = jest.spyOn(controllerStub, 'handle');
        await sut.handle(makeFakeRequest());
        expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
    });
    test('Should call handle method from implemented controller', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: 'Matheus'
            }
        });
    });
    test('Should call LogErrorRepository when controller throw an error', async () => {
        const { sut, controllerStub, logErrorStub } = makeSut();
        const fakeError = new Error();
        fakeError.stack = 'any_stack';
        const error = (0, http_helpers_1.serverError)(fakeError);
        const logSpy = jest.spyOn(logErrorStub, 'logError');
        // Simulando um erro no controller
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)));
        await sut.handle(makeFakeRequest());
        expect(logSpy).toHaveBeenCalledWith('any_stack');
    });
});
