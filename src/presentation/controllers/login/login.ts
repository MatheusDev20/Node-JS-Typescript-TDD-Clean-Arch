/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable no-multi-spaces */
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helpers'
import { HttpRequest, HttpResponse } from '../../protocols'
import { Controller } from '../../protocols/controller'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError(field))))
      }
    }
    const { email } = httpRequest.body
    if (!this.emailValidator.isValid(email)) {
      return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
