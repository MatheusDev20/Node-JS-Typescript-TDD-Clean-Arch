import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validator'

export class CompareFieldsValidation implements Validation {
  private readonly filedname: string
  private readonly fieldToCompareName: string

  constructor(fieldName: string, fieldToCompareName: string) {
    this.filedname = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  validate(input: any): Error {
    if (input[this.filedname] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.filedname)
    }
  }
}
