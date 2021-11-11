import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AccountModel, AddAcount, AddAcountModel } from './signup-protocols'

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
    add(account: AddAcountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }

      return fakeAccount
    }
  }

  return new AddAcountStub()
}

interface SutType {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAcountStub: AddAcount
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const addAcountStub = makeAddAcount()
  const sut = new SignUpController(emailValidatorStub, addAcountStub)

  return {
    sut,
    emailValidatorStub,
    addAcountStub
  }
}

describe('SignUpController', () => {
  test('Should Return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should Return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should Return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should Return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
})
test('Should Return 400 if an invalid email is provided', () => {
  const { sut, emailValidatorStub } = makeSut()
  jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'invalid_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidParamError('email'))
})
test('Should call EmailValidator with correct email', () => {
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
  sut.handle(httpRequest)
  expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
})
test('Should Return 500 if an exception happen in EmailValidator', () => {
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
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new ServerError())
})

test('Should Return 400 if password confirmation failed', () => {
  const { sut } = makeSut()
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'invalid_password'
    }
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
})

test('Should Call AddAccount with the correct Values', () => {
  const { sut, addAcountStub } = makeSut()
  const isValidSpy = jest.spyOn(addAcountStub, 'add')
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
  sut.handle(httpRequest)
  expect(isValidSpy).toHaveBeenCalledWith({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
})
