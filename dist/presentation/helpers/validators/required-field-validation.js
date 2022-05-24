"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const required_fields_validation_1 = require("./required-fields-validation");
const makeSut = () => {
    return new required_fields_validation_1.RequiredFieldsValidation('field');
};
describe('RequiredFields Validation', () => {
    test('Should return MissingParamError if validation fails', () => {
        const sut = makeSut();
        // Não possui a propriedade field
        const error = sut.validate({ name: 'any_name' });
        expect(error).toEqual(new errors_1.MissingParamError('field'));
    });
    test('Should not return if validation succeed', () => {
        const sut = makeSut();
        // Não possui a propriedade field
        const error = sut.validate({ name: 'any_name', field: 'any_field' });
        expect(error).toBeFalsy();
    });
});
