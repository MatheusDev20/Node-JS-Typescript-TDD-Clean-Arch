import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AddAcountModel } from '../../../../domain/usecases/add-acount'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAcountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const mongoId = result.insertedId

    const account = {
      id: String(mongoId),
      name: accountData.name,
      email: accountData.email,
      password: accountData.password
    }

    return account
  }
}
