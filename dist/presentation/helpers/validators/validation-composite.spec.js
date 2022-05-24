"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const validation_composite_1 = require("./validation-composite");
const makeValidation = () => {
    class ValidationStub {
        validate(input) {
            return null;
        }
    }
    return new ValidationStub();
};
const makeSut = () => {
    const validationStubs = [makeValidation(), makeValidation()];
    const sut = new validation_composite_1.ValidationComposite(validationStubs);
    return {
        sut,
        validationStubs
    };
};
describe('ValidationComposite', () => {
    test('Should return an error if any validation fails', () => {
        const { sut, validationStubs } = makeSut();
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new errors_1.MissingParamError('field'));
        const error = sut.validate({ field: 'any_value' });
        expect(error).toEqual(new errors_1.MissingParamError('field'));
    });
    test('Should return the first error if more than one validation fails', () => {
        const { sut, validationStubs } = makeSut();
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
        jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new errors_1.MissingParamError('field'));
        const error = sut.validate({ field: 'any_value' });
        expect(error).toEqual(new Error());
    });
    test('Should not return error if all validations succeed', () => {
        const { sut } = makeSut();
        const error = sut.validate({ field: 'any_value' });
        expect(error).toBeFalsy();
    });
});
