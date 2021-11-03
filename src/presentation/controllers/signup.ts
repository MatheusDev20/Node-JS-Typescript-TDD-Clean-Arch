import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/MissingParamError'
import { badRequest } from '../helpers/http-helpers'
export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    return {
      statusCode: 200,
      body: 'Success'
    }
  }
}
