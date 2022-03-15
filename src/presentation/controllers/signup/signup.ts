
import { badRequest, serverError, ok } from '../../helpers/http/http-helpers'
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAcount, Validation } from './signup-protocols'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAcountUseCase: AddAcount
  private readonly validation: Validation

  constructor(addAcount: AddAcount, validation: Validation) {
    this.addAcountUseCase = addAcount
    this.validation = validation
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      // Composite com todas as validações necessárias
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAcountUseCase.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
