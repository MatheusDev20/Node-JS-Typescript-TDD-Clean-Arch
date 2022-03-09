import { MissingParamError } from '../../errors'
import { RequiredFieldsValidation } from './required-fields-validation'

const makeSut = (): RequiredFieldsValidation => {
  return new RequiredFieldsValidation('field')
}
describe('RequiredFields Validation', () => {
  test('Should return MissingParamError if validation fails', () => {
    const sut = makeSut()
    // Não possui a propriedade field
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeed', () => {
    const sut = makeSut()
    // Não possui a propriedade field
    const error = sut.validate({ name: 'any_name', field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
