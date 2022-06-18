"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSignUpController = void 0;
const signup_controller_1 = require("../../../presentation/controllers/signup/signup-controller");
const db_add_account_1 = require("../../../data/useCases/add-acount/db-add-account");
const bcrypt_adapter_1 = require("../../../infra/criptography/bcrypt-adapter/bcrypt-adapter");
const account_mongo_repository_1 = require("../../../infra/db/mongodb/account/account-mongo-repository");
const log_mongo_repository_1 = require("../../../infra/db/mongodb/log/log-mongo-repository");
const log_controller_decorator_1 = require("../../decorators/log-controller-decorator");
const signup_validation_factory_1 = require("./signup-validation-factory");
const makeSignUpController = () => {
    const salt = 12;
    const bcryptAdapter = new bcrypt_adapter_1.BcryptAdapter(salt);
    const accountMongoRepository = new account_mongo_repository_1.AccountMongoRepository();
    const dbAddAcount = new db_add_account_1.DbAddAccount(bcryptAdapter, accountMongoRepository);
    const logMongoRepository = new log_mongo_repository_1.LogMongoRepository();
    const signUpController = new signup_controller_1.SignUpController(dbAddAcount, (0, signup_validation_factory_1.makeSignUpValidation)());
    return new log_controller_decorator_1.LogControllerDecorator(signUpController, logMongoRepository);
};
exports.makeSignUpController = makeSignUpController;