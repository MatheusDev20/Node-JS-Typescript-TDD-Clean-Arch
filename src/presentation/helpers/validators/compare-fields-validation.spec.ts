import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}
describe('Compare Fields Validation', () => {
  test('Should return Invalid Param Error if validation fails', () => {
    const sut = makeSut()
    // Não possui a propriedade field
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_diferente_value' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeed', () => {
    const sut = makeSut()
    // Não possui a propriedade field
    const error = sut.validate({ field: 'equal_field', fieldToCompare: 'equal_field' })
    expect(error).toBeFalsy()
  })
})
