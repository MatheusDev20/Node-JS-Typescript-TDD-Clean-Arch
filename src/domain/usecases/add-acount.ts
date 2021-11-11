import { AccountModel } from '../models/account'

export interface AddAcountModel {
  name: string
  email: string
  password: string
} // Isso é equivalente a um DTO pra criação da conta.

export interface AddAcount {
  add: (account: AddAcountModel) => AccountModel
}
