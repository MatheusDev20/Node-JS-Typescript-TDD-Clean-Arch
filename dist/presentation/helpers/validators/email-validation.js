"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailValidation = void 0;
const errors_1 = require("../../errors");
class EmailValidation {
    constructor(fieldName, emailValidator) {
        this.fieldName = fieldName;
        this.emailValidator = emailValidator;
    }
    validate(input) {
        const isValid = this.emailValidator.isValid(input[this.fieldName]);
        if (!isValid) {
            return new errors_1.InvalidParamError('email');
        }
    }
}
exports.EmailValidation = EmailValidation;
