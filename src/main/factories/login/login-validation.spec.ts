import { EmailValidation, RequiredFieldsValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeLoginValidation } from './login-validation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('Login Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation('name'),
      new RequiredFieldsValidation('email'),
      new EmailValidation('email', makeEmailValidator())
    ])
  })
})
