import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation('name'),
      new RequiredFieldsValidation('email'),
      new RequiredFieldsValidation('password'),
      new RequiredFieldsValidation('passwordConfirmation'),
      new CompareFieldsValidation('password', 'passwordConfirmation')
    ])
  })
})
