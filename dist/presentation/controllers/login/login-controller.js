"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable no-multi-spaces */
const http_helpers_1 = require("../../helpers/http/http-helpers");
class LoginController {
    constructor(authentication, validation) {
        this.authentication = authentication;
        this.validation = validation;
    }
    async handle(httpRequest) {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return (0, http_helpers_1.badRequest)(error);
            }
            const { email, password } = httpRequest.body;
            const accessToken = await this.authentication.auth({ email, password });
            if (!accessToken) {
                return (0, http_helpers_1.unauthorized)();
            }
            return (0, http_helpers_1.ok)({ accessToken: accessToken });
        }
        catch (err) {
            return (0, http_helpers_1.serverError)(err);
        }
    }
}
exports.LoginController = LoginController;
