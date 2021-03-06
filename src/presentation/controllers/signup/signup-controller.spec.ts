import { SignUpController } from './signup-controller'
import { MissingParamError, ServerError } from '../../errors'
import { AccountModel, AddAcount, AddAcountModel, HttpRequest, Validation } from './signup-controller-protocols'
import { serverError, badRequest } from '../../helpers/http/http-helpers'

const makeAddAcount = (): AddAcount => {
  class AddAcountStub implements AddAcount {
    async add(account: AddAcountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAcountStub()
}
const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'valid_password'
})
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutType {
  sut: SignUpController
  addAcountStub: AddAcount
  validationStub: Validation
}

const makeSut = (): SutType => {
  const validationStub = makeValidation()
  const addAcountStub = makeAddAcount()
  const sut = new SignUpController(addAcountStub, validationStub)

  return {
    sut,
    addAcountStub,
    validationStub
  }
}

describe('SignUpController', () => {
  test('Should Call AddAccount with the correct Values', async () => {
    const { sut, addAcountStub } = makeSut()
    const isValidSpy = jest.spyOn(addAcountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if add acount throws an exception', async () => {
    const { sut, addAcountStub } = makeSut()
    jest.spyOn(addAcountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => {
        reject(new Error())
      })
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('Error Trace')))
  })

  test('Should call validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
