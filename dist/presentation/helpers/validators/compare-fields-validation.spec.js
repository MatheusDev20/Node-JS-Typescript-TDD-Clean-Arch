"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const compare_fields_validation_1 = require("./compare-fields-validation");
const makeSut = () => {
    return new compare_fields_validation_1.CompareFieldsValidation('field', 'fieldToCompare');
};
describe('Compare Fields Validation', () => {
    test('Should return Invalid Param Error if validation fails', () => {
        const sut = makeSut();
        // Não possui a propriedade field
        const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_diferente_value' });
        expect(error).toEqual(new errors_1.InvalidParamError('fieldToCompare'));
    });
    test('Should not return if validation succeed', () => {
        const sut = makeSut();
        // Não possui a propriedade field
        const error = sut.validate({ field: 'equal_field', fieldToCompare: 'equal_field' });
        expect(error).toBeFalsy();
    });
});
