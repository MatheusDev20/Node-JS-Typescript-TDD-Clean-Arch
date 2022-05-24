"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../config/app"));
describe('Content Type Middleware', () => {
    test('Should Return default Content Type as JSON', async () => {
        app_1.default.get('/test_content', (req, res) => {
            res.send();
        });
        await (0, supertest_1.default)(app_1.default)
            .get('/test_content')
            .expect('content-type', /json/);
    });
});
