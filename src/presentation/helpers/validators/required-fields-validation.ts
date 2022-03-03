import { MissingParamError } from '../../errors'
import { Validation } from './validator'

export class RequiredFieldsValidation implements Validation {
  private readonly filedname: string
  constructor(fieldName: string) {
    this.filedname = fieldName
  }

  validate(input: any): Error {
    if (!input[this.filedname]) {
      return new MissingParamError(this.filedname)
    }
  }
}
