import { EmailValidatorAdapter } from './email-validator'
describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@nail.com')
    expect(isValid).toBe(false)
  })
})
