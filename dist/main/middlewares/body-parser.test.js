"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../config/app"));
describe('Body Parser Middleware', () => {
    test('Should Parser JSON Input on post Requests', async () => {
        app_1.default.post('/test_body_parser', (req, res) => {
            res.send(req.body);
        });
        await (0, supertest_1.default)(app_1.default)
            .post('/test_body_parser')
            .send({ name: 'Matheus' })
            .expect({ name: 'Matheus' });
    });
});
