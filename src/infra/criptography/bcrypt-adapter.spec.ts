import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise(resolve => resolve('test_hash'))
  },
  async compare(): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))
// Mock do metodo hash da lib bcrypt para testar com o hash fixo
const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}
describe('Bcrypt Adapter', () => {
  test('Should call hash method with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('Should return a valid hash on hash method  success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('test_hash')
  })

  test('Should call comparer method with correct value', async () => {
    const sut = makeSut()
    const compareHashSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareHashSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('Should return a valid hash on compare method  success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('test_hash')
  })
})
