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
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return await new Promise(resolve => resolve(account))
  }
}
