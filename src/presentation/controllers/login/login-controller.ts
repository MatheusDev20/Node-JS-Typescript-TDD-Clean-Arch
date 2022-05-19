/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable no-multi-spaces */
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helpers'
import { Validation, HttpRequest, HttpResponse, Controller, Authentication } from './login-controller-protocols'

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor(authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken: 'any_token' })
    } catch (err) {
      return serverError(err)
    }
  }
}
