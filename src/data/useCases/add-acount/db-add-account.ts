import { AccountModel, AddAccountRepository, AddAcount, AddAcountModel, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAcount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor(encrypter: Encrypter, addAcountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAcountRepository
  }

  async add(accountData: AddAcountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    console.log(Object.assign({}, accountData, { password: hashedPassword }))
    return await new Promise(resolve => resolve({
      id: 'id',
      name: 'acc_name',
      email: 'acc_email',
      password: 'acc_password'
    }))
  }
}
