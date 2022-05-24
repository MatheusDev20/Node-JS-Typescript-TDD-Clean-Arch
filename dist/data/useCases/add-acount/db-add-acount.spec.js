"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_add_account_1 = require("./db-add-account");
const makeFakeAccountData = () => ({
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
});
const makeHasher = () => {
    class HasherStub {
        async hash(value) {
            return await new Promise(resolve => resolve('hashed_password'));
        }
    }
    return new HasherStub();
};
const makeAddAcountRepository = () => {
    class AddAccountRepositoryStub {
        async add(accountData) {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email',
                password: 'hashed_password'
            };
            return await new Promise(resolve => resolve(fakeAccount));
        }
    }
    return new AddAccountRepositoryStub();
};
const makeSut = () => {
    const encrypterStub = makeHasher();
    const addAccountRepositoryStub = makeAddAcountRepository();
    const sut = new db_add_account_1.DbAddAccount(encrypterStub, addAccountRepositoryStub);
    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    };
};
describe('DbAddAccount UseCase', () => {
    test('Should Call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut();
        const encryptSpy = jest.spyOn(encrypterStub, 'hash');
        await sut.add(makeFakeAccountData());
        expect(encryptSpy).toHaveBeenCalledWith('valid_password');
    });
    test('Should throw if Encrypter raise a exception', async () => {
        const { sut, encrypterStub } = makeSut();
        jest.spyOn(encrypterStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
        const promise = sut.add(makeFakeAccountData());
        await expect(promise).rejects.toThrow();
    });
    test('Should call AddAccount Repository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
        await sut.add(makeFakeAccountData());
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password' // Para inserir no DB eu quero o password hasheado ( retorno do encrypt)
        });
    });
    test('Should throw if AddAcountRepository raise a exception', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        };
        const promise = sut.add(accountData);
        await expect(promise).rejects.toThrow();
    });
    test('Should return the recent account created from on success', async () => {
        const { sut } = makeSut();
        const account = await sut.add(makeFakeAccountData());
        await expect(account).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password'
        });
    });
});
