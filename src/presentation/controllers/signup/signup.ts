
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAcount } from './signup-protocols'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAcountUseCase: AddAcount

  constructor(emailValidator: EmailValidator, addAcount: AddAcount) {
    this.emailValidator = emailValidator
    this.addAcountUseCase = addAcount
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAcountUseCase.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }
}
