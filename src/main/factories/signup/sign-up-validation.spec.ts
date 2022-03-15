import { CompareFieldsValidation, EmailValidation, RequiredFieldsValidation, ValidationComposite } from '../../../presentation/helpers/validators/'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation('name'),
      new RequiredFieldsValidation('email'),
      new RequiredFieldsValidation('password'),
      new RequiredFieldsValidation('passwordConfirmation'),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation('email', makeEmailValidator())
    ])
  })
})
