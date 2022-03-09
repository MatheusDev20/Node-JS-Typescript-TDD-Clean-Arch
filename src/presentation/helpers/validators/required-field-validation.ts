import { MissingParamError } from '../../errors'
import { RequiredFieldsValidation } from './required-fields-validation'

describe('RequiredFields Validation', () => {
  test('Should return MissingParamError if validation fails', () => {
    const sut = new RequiredFieldsValidation('field')
    // Não possui a propriedade field
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
