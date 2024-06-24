"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiValidator = exports.Validator = void 0;
const joi_1 = __importDefault(require("joi"));
// interface
class Validator {
}
exports.Validator = Validator;
// implementation
const bookShema = joi_1.default.object({
    title: joi_1.default.string().required(),
    author: joi_1.default.string().required(),
    publicationDate: joi_1.default.date().required(),
    genres: joi_1.default.array().required(),
});
const userShema = joi_1.default.object({
    username: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
const loginShema = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
const roleShema = joi_1.default.object({
    role: joi_1.default.number().required(),
});
class JoiValidator extends Validator {
    validateBook(object) {
        const { error } = bookShema.validate(object);
        if (error) {
            return String(error);
        }
        return true;
    }
    validateUser(object) {
        const { error } = userShema.validate(object);
        if (error) {
            return String(error);
        }
        return true;
    }
    validateLogin(object) {
        const { error } = loginShema.validate(object);
        if (error) {
            return String(error);
        }
        return true;
    }
    validateEditRole(object) {
        const { error } = roleShema.validate(object);
        if (error) {
            return String(error);
        }
        return true;
    }
}
exports.JoiValidator = JoiValidator;
