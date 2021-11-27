/* eslint-disable @typescript-eslint/no-unused-vars */
import { Db, MongoClient } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
describe('Mongodb Account Repository', () => {
  let connection: MongoClient
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.closeConnection()
  })

  test('Should return an account on insert success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})
