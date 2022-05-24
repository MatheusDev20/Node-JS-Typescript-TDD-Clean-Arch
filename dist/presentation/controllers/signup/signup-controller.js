"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpController = void 0;
const http_helpers_1 = require("../../helpers/http/http-helpers");
class SignUpController {
    constructor(addAcount, validation) {
        this.addAcountUseCase = addAcount;
        this.validation = validation;
    }
    async handle(httpRequest) {
        try {
            // Composite com todas as validações necessárias
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return (0, http_helpers_1.badRequest)(error);
            }
            const { name, email, password } = httpRequest.body;
            const account = await this.addAcountUseCase.add({
                name,
                email,
                password
            });
            return (0, http_helpers_1.ok)(account);
        }
        catch (error) {
            return (0, http_helpers_1.serverError)(error);
        }
    }
}
exports.SignUpController = SignUpController;
