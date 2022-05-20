import { AddAccountRepository } from '../../../../data/protocols/account/add-account-repository'
import { AddAcountModel } from '../../../../domain/usecases/add-acount'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/account/load-account-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/account/update-account-token-repository'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add(accountData: AddAcountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const mongoId = result.insertedId

    const account = {
      id: mongoId.toString(),
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
      const account = {
        id: result._id.toString(),
        name: result.name,
        email: result.email,
        password: result.password
      }
      return account
    }
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, {
      $set: {
        accessToken: accessToken
      }
    })
  }
}
