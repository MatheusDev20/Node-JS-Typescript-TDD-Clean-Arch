"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../../../presentation/helpers/validators");
const signup_validation_factory_1 = require("./signup-validation-factory");
const makeEmailValidator = () => {
    class EmailValidatorStub {
        isValid(email) {
            return true;
        }
    }
    return new EmailValidatorStub();
};
jest.mock('../../../presentation/helpers/validators/validation-composite');
describe('SignUpValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        (0, signup_validation_factory_1.makeSignUpValidation)();
        expect(validators_1.ValidationComposite).toHaveBeenCalledWith([
            new validators_1.RequiredFieldsValidation('name'),
            new validators_1.RequiredFieldsValidation('email'),
            new validators_1.RequiredFieldsValidation('password'),
            new validators_1.RequiredFieldsValidation('passwordConfirmation'),
            new validators_1.CompareFieldsValidation('password', 'passwordConfirmation'),
            new validators_1.EmailValidation('email', makeEmailValidator())
        ]);
    });
});
