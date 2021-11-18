import { AccountModel, AddAcount, AddAcountModel, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAcount {
  private readonly encrypter: Encrypter

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add(account: AddAcountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve({
      id: 'id',
      name: 'acc_name',
      email: 'acc_email',
      password: 'acc_password'
    }))
  }
}
