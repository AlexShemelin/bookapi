"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.createHashFromPassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/*
  const ROLE_USER = 1; // 0001
  const ROLE_ADMIN = 2; // 0010

  logic sum: 0001 (1) | 0010 (2) = 0011 (3)
*/
async function createHashFromPassword(password) {
    try {
        if (!process.env.SALT) {
            return new Error("SALT env is undefined");
        }
        return await bcrypt_1.default.hash(password, process.env.SALT);
    }
    catch (error) {
        return new Error(`createHashFromPassword error - ${error}`);
    }
}
exports.createHashFromPassword = createHashFromPassword;
async function generateToken(password, dbpassword, username, role) {
    if (!process.env.JWT_SECRET) {
        return new Error("JWT_SECRET env is undefined");
    }
    // Compare the provided password with the stored hash
    const match = await bcrypt_1.default.compare(password, dbpassword);
    if (!match) {
        return new Error("Authentication failed: incorrect password");
    }
    // Generate a JWT
    const token = jsonwebtoken_1.default.sign({ username, role }, process.env.JWT_SECRET, {
        expiresIn: "12h",
    });
    return token;
}
exports.generateToken = generateToken;
