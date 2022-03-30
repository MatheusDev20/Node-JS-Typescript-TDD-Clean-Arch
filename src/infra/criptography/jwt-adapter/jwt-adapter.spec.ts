
import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

// sign would be the jwt lib method to generate a new JWT
const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}
jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return await new Promise(resolve => resolve('any_token'))
  }
}))

describe('JWT Adapter', () => {
  test('Should Call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_user_id')

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_user_id' }, 'secret')
  })

  test('Should return a Token on sign success', async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt('any_user_id')

    expect(accessToken).toBe('any_token')
  })

  test('Should Throw an error if sign method thrown an error', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_user_id')

    await expect(promise).rejects.toThrow()
  })
})
