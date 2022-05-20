
import { AuthenticationModel, Authentication } from '../../../domain/usecases/authentication'
import { Encrypter, HashComparer } from '../../protocols/cryptograph'
import { LoadAccountByEmailRepository } from '../../protocols/account/load-account-repository'
import { UpdateAccessTokenRepository } from '../../protocols/account/update-account-token-repository'
export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly encrypt: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypt: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypt = encrypt
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypt.encrypt(account.id)

        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
