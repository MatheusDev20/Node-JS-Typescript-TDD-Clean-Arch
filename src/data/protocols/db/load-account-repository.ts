import { AccountModel } from '../../useCases/add-acount/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<AccountModel>
}
