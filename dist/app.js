"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const validator_1 = require("./interface/validator");
const index_1 = require("./controller/index");
const sqlite_1 = require("./interface/db_implementations/sqlite");
const inMemory_1 = require("./interface/db_implementations/inMemory");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function main() {
    const router = (0, express_1.default)();
    router.use((0, cors_1.default)());
    router.use(express_1.default.json());
    const SQLite = new sqlite_1.SQLiteDB();
    const InMemoryDB = new inMemory_1.InMemoryTestDB({
        books: [],
        // pre-defined admin
        users: [
            {
                email: "admin@bookapi.com",
                id: 1,
                password: "$2b$05$GPIu/cuBJJ5FAOUvTXzK0u1n6kGavZ.k8Akr/Zubf9uPkWaDD2aIi", // admin
                role: (Number(process.env.ROLE_ADMIN) | Number(process.env.ROLE_USER)) || 1,
                token: "",
                username: "admin",
                confirmed_account: true,
            },
        ],
    });
    const DB = process.env.MODE === "TEST" ? InMemoryDB : SQLite;
    const controller = (0, index_1.appController)(router, DB, new validator_1.JoiValidator());
    controller().run(Number(process.env.ROUTER_PORT));
}
main();
