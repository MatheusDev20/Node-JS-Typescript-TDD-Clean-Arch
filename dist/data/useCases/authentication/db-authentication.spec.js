"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_authentication_1 = require("./db-authentication");
const makeFakeAccount = () => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
});
const makeFakeAuthentication = () => ({
    email: 'any_email@mail.com',
    password: 'any_password'
});
const makeSut = () => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
    const hashCompareStub = makeHashComparer();
    const tokenGeneratorStub = makeEncrypt();
    const updateAccessTokenRepositoryStub = makeUpdateToken();
    const sut = new db_authentication_1.DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, tokenGeneratorStub, updateAccessTokenRepositoryStub);
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashCompareStub,
        tokenGeneratorStub,
        updateAccessTokenRepositoryStub
    };
};
const makeLoadAccountByEmailRepository = () => {
    class LoadAccountByEmailRepositoryStub {
        async loadByEmail(email) {
            return await new Promise(resolve => resolve(makeFakeAccount()));
        }
    }
    return new LoadAccountByEmailRepositoryStub();
};
const makeHashComparer = () => {
    class HashComparerStub {
        async compare(value, hash) {
            return await new Promise(resolve => resolve(true));
        }
    }
    return new HashComparerStub();
};
const makeEncrypt = () => {
    class EncrypterStub {
        async encrypt(value) {
            return await new Promise(resolve => resolve('any_token'));
        }
    }
    return new EncrypterStub();
};
const makeUpdateToken = () => {
    class UpdateAccessTokenRepositoryStub {
        async updateAccessToken(id) {
            return await new Promise(resolve => resolve());
        }
    }
    return new UpdateAccessTokenRepositoryStub();
};
describe('DbAuthentication UseCase', () => {
    test('Should Call LoadAccountByEmailRepository with the correct Email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
        await sut.auth(makeFakeAuthentication());
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
    });
    test('Should Throw if LoadAccountByEmailRepository Throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
        const promise = sut.auth(makeFakeAuthentication());
        await expect(promise).rejects.toThrow();
    });
    test('Should return Null if LoadAccountEmailByRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null);
        const accessToken = await sut.auth(makeFakeAuthentication());
        expect(accessToken).toBe(null);
    });
    test('Should call HashComparer with correct value', async () => {
        const { sut, hashCompareStub } = makeSut();
        const compareSpy = jest.spyOn(hashCompareStub, 'compare');
        await sut.auth(makeFakeAuthentication());
        expect(compareSpy).toBeCalledWith('any_password', 'hashed_password');
    });
    test('Should Throw if HashComparer Throws', async () => {
        const { sut, hashCompareStub } = makeSut();
        jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
        const promise = sut.auth(makeFakeAuthentication());
        await expect(promise).rejects.toThrow();
    });
    test('Should return null if HashComparer returns false', async () => {
        const { sut, hashCompareStub } = makeSut();
        jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));
        const accessToken = await sut.auth(makeFakeAuthentication());
        expect(accessToken).toBeNull();
    });
    test('Should call TokenGenerator with correct id', async () => {
        const { sut, tokenGeneratorStub } = makeSut();
        const generateSpy = jest.spyOn(tokenGeneratorStub, 'encrypt');
        await sut.auth(makeFakeAuthentication());
        expect(generateSpy).toHaveBeenCalledWith('any_id');
    });
    test('Should Throw if TokenGenerator Throws', async () => {
        const { sut, tokenGeneratorStub } = makeSut();
        jest.spyOn(tokenGeneratorStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
        const promise = sut.auth(makeFakeAuthentication());
        await expect(promise).rejects.toThrow();
    });
    test('Should return AccessToken if token generator succeed', async () => {
        const { sut } = makeSut();
        const accessToken = await sut.auth(makeFakeAuthentication());
        expect(accessToken).toBe('any_token');
    });
    test('Should call UpdateAccessTokenRepository with correct values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        const updaateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');
        await sut.auth(makeFakeAuthentication());
        expect(updaateSpy).toHaveBeenCalledWith('any_id', 'any_token');
    });
    test('Should Throw if UpdateTokenRepository throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
        const promise = sut.auth(makeFakeAuthentication());
        await expect(promise).rejects.toThrow();
    });
});
