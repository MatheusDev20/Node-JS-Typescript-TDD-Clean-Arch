"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredFieldsValidation = void 0;
const errors_1 = require("../../errors");
class RequiredFieldsValidation {
    constructor(fieldName) {
        this.filedname = fieldName;
    }
    validate(input) {
        if (!input[this.filedname]) {
            return new errors_1.MissingParamError(this.filedname);
        }
    }
}
exports.RequiredFieldsValidation = RequiredFieldsValidation;
