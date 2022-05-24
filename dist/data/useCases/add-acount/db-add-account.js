"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbAddAccount = void 0;
class DbAddAccount {
    constructor(hasher, addAcountRepository) {
        this.hasher = hasher;
        this.addAccountRepository = addAcountRepository;
    }
    async add(accountData) {
        const hashedPassword = await this.hasher.hash(accountData.password);
        const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
        return await new Promise(resolve => resolve(account));
    }
}
exports.DbAddAccount = DbAddAccount;
