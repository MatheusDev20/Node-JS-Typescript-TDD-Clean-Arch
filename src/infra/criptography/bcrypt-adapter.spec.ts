import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/encrypter'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise(resolve => resolve('test_hash'))
  }
}))
// Mock do metodo hash da lib bcrypt para testar com o hash fixo
const salt = 12
const makeSut = (): Encrypter => {
  return new BcryptAdapter(salt)
}
describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('Should return a hash on a success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('test_hash')
  })
})
