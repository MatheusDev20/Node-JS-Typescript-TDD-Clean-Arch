import { Validation } from '../../protocols/validator'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]
  constructor(validations: Validation[]) {
    this.validations = validations
  }

  // Loop para fazer todas as validações pelo composite
  validate(input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
  }
}
