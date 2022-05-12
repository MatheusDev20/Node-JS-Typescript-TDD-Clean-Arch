import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AddAcountModel } from '../../../../domain/usecases/add-acount'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
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

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })

    if (result) {
      const accountId = String(result._id)

      const account = {
        id: accountId,
        name: result.name,
        email: result.email,
        password: result.password
      }
      return account
    }
  }
}
