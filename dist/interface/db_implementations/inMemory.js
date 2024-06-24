"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryTestDB = void 0;
const database_1 = require("../database");
const auth_1 = require("../../utils/auth");
class InMemoryTestDB extends database_1.DatabaseAbstract {
    constructor(initData) {
        super();
        this.books = initData.books;
        this.users = initData.users;
    }
    async addBook(book) {
        this.books = [
            ...this.books,
            {
                ...book,
                id: this.books.length + 1,
            },
        ];
        return {
            ...book,
            id: this.books.length + 1,
        };
    }
    async deleteBook(id) {
        this.books = this.books.filter((book) => book.id !== id);
    }
    async getBooks() {
        return this.books;
    }
    async updateBook(book, id) {
        const index = this.books.findIndex((dbbook) => dbbook.id === id);
        if (index === -1) {
            return new Error("not found");
        }
        this.books[index] = {
            ...book,
            id,
        };
        return this.books[index];
    }
    async getBookById(id) {
        var _a;
        return ((_a = this.books.find((dbbook) => dbbook.id === id)) !== null && _a !== void 0 ? _a : new Error("book is not found"));
    }
    async getUserById(id) {
        var _a;
        return ((_a = this.users.find((dbuser) => dbuser.id === id)) !== null && _a !== void 0 ? _a : new Error("user is not found"));
    }
    async register(user) {
        if (!process.env.JWT_SECRET) {
            return new Error("JWT token env is undefined");
        }
        const isSameEmailExists = this.users.find((dbuser) => dbuser.email === user.email || dbuser.username === user.username);
        if (isSameEmailExists) {
            return new Error("Your email or username is already exists");
        }
        const hashedPassword = await (0, auth_1.createHashFromPassword)(user.password);
        if (hashedPassword instanceof Error) {
            return new Error(`cannot get hashed password - ${hashedPassword.message}`);
        }
        this.users = [
            ...this.users,
            {
                ...user,
                password: hashedPassword,
                id: this.users.length + 1,
                token: "",
                role: 1,
                confirmed_account: false,
            },
        ];
        return {
            ...user,
            id: this.users.length + 1,
        };
    }
    async getUserData(token) {
        const me = this.users.find((dbuser) => dbuser.token === token);
        if (!me) {
            return new Error("Please login");
        }
        return me;
    }
    async auth(creds) {
        const userIndex = this.users.findIndex((dbuser) => dbuser.username === creds.username);
        if (userIndex === -1) {
            return new Error("Authentication failed: user not found");
        }
        const token = await (0, auth_1.generateToken)(creds.password, this.users[userIndex].password, creds.username, this.users[userIndex].role);
        if (token instanceof Error) {
            return token;
        }
        this.users[userIndex].token = token;
        return token;
    }
    async changeRole(id, role) {
        const userIndex = this.users.findIndex((dbuser) => dbuser.id === id);
        this.users[userIndex].role = role;
        return this.users[userIndex];
    }
    async getAllUsers() {
        return this.users;
    }
    async confirmEmail(username) {
        const useIndex = this.users.findIndex((user) => user.username === username);
        if (useIndex !== -1) {
            this.users[useIndex].confirmed_account = true;
            return "Email confirmed";
        }
        return new Error("Not found, try again");
    }
}
exports.InMemoryTestDB = InMemoryTestDB;
