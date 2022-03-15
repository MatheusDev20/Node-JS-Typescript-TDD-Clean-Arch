import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { serverError } from '../../presentation/helpers/http/http-helpers'
import { LogErrorRepository } from '../../data/protocols/db/log-error-repository'

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Matheus'
        }
      }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  const controllerStub = new ControllerStub()

  return controllerStub
}
const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})
interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorStub)
  return {
    sut,
    controllerStub,
    logErrorStub
  }
}
describe('LogController Decorator', () => {
  test('Should call handle method from implemented controller', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })
  test('Should call handle method from implemented controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Matheus'
      }
    })
  })
  test('Should call LogErrorRepository when controller throw an error', async () => {
    const { sut, controllerStub, logErrorStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)

    const logSpy = jest.spyOn(logErrorStub, 'logError')
    // Simulando um erro no controller
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))

    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
