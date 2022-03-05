import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AccountModel, AddAcount, AddAcountModel, HttpRequest, Validation } from './signup-protocols'
import { serverError, badRequest } from '../../helpers/http-helpers'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

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
  emailValidatorStub: EmailValidator
  addAcountStub: AddAcount
  validationStub: Validation
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const validationStub = makeValidation()
  const addAcountStub = makeAddAcount()
  const sut = new SignUpController(emailValidatorStub, addAcountStub, validationStub)

  return {
    sut,
    emailValidatorStub,
    addAcountStub,
    validationStub
  }
}

describe('SignUpController', () => {
  //   test('Should Return 400 if no name is provided', async () => {
  //     const { sut } = makeSut()
  //     const httpRequest = {
  //       body: {
  //         email: 'any_email@mail.com',
  //         password: 'any_password',
  //         passwordConfirmation: 'any_password'
  //       }
  //     }
  //     const httpResponse = await sut.handle(httpRequest)
  //     expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  //   })

  //   test('Should Return 400 if no email is provided', async () => {
  //     const { sut } = makeSut()
  //     const httpRequest = {
  //       body: {
  //         name: 'any_name',
  //         password: 'any_password',
  //         passwordConfirmation: 'any_password'
  //       }
  //     }
  //     const httpResponse = await sut.handle(httpRequest)
  //     expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  //   })

  //   test('Should Return 400 if no password is provided', async () => {
  //     const { sut } = makeSut()
  //     const httpRequest = {
  //       body: {
  //         name: 'any_name',
  //         email: 'any_email@mail.com',
  //         passwordConfirmation: 'any_password'
  //       }
  //     }
  //     const httpResponse = await sut.handle(httpRequest)
  //     expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  //   })
  //   test('Should Return 400 if no password confirmation is provided', async () => {
  //     const { sut } = makeSut()
  //     const httpRequest = {
  //       body: {
  //         name: 'any_name',
  //         email: 'any_email@mail.com',
  //         password: 'any_password'
  //       }
  //     }
  //     const httpResponse = await sut.handle(httpRequest)
  //     expect(httpResponse.statusCode).toBe(400)
  //     expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  //   })
  // })
  test('Should Return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should Return 500 if an exception happen in EmailValidator', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('Error Trace')))
  })

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
