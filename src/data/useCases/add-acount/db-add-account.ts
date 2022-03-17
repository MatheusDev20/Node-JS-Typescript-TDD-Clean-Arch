
import { AccountModel, AddAccountRepository, AddAcount, AddAcountModel, Hasher } from './db-add-account-protocols'

export class DbAddAccount implements AddAcount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository

  constructor(hasher: Hasher, addAcountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAcountRepository
  }

  async add(accountData: AddAcountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return await new Promise(resolve => resolve(account))
  }
}
