import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validator'

export class CompareFieldsValidation implements Validation {
  private readonly fieldname: string
  private readonly fieldToCompareName: string

  constructor(fieldName: string, fieldToCompareName: string) {
    this.fieldname = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  validate(input: any): Error {
    if (input[this.fieldname] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}
