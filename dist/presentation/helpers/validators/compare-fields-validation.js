"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareFieldsValidation = void 0;
const errors_1 = require("../../errors");
class CompareFieldsValidation {
    constructor(fieldName, fieldToCompareName) {
        this.fieldname = fieldName;
        this.fieldToCompareName = fieldToCompareName;
    }
    validate(input) {
        if (input[this.fieldname] !== input[this.fieldToCompareName]) {
            return new errors_1.InvalidParamError(this.fieldToCompareName);
        }
    }
}
exports.CompareFieldsValidation = CompareFieldsValidation;
