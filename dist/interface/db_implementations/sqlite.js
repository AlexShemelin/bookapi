"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteDB = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const database_1 = require("../database");
const email_1 = require("../../utils/email");
const auth_1 = require("../../utils/auth");
class SQLiteDB extends database_1.DatabaseAbstract {
    constructor() {
        super();
        this.initialize();
    }
    async initialize() {
        this.db = await (0, sqlite_1.open)({
            filename: "./database.sqlite",
            driver: sqlite3_1.default.Database,
        });
        await this.db.exec(`
        CREATE TABLE IF NOT EXISTS books (
          id INTEGER PRIMARY KEY,
          title TEXT,
          author TEXT,
          publicationDate TEXT,
          genres TEXT
        )
      `);
        await this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          username TEXT,
          email TEXT,
          password TEXT,
          role INTEGER,
          token TEXT,
          confirmed_account BOOL
        )
      `);
    }
    // Book methods
    async addBook(book) {
        const { title, author, publicationDate, genres } = book;
        const result = await this.db.run(`INSERT INTO books (title, author, publicationDate, genres) VALUES (?, ?, ?, ?)`, [title, author, publicationDate, JSON.stringify(genres)]);
        if (!result.lastID) {
            return new Error("cannot insert a row");
        }
        return { ...book, id: result.lastID };
    }
    async getBooks() {
        const books = await this.db.all(`SELECT * FROM books`);
        return books.map((book) => ({
            ...book,
            genres: JSON.parse(book.genres),
            publicationDate: new Date(book.publicationDate),
        }));
    }
    async getBookById(id) {
        const book = await this.db.get(`SELECT * FROM books WHERE id = ?`, [id]);
        if (book) {
            return {
                ...book,
                genres: JSON.parse(book.genres),
                publicationDate: new Date(book.publicationDate),
            };
        }
        return new Error("Book not found");
    }
    async updateBook(book, id) {
        const { title, author, publicationDate, genres } = book;
        const result = await this.db.run(`UPDATE books SET title = ?, author = ?, publicationDate = ?, genres = ? WHERE id = ?`, [title, author, publicationDate, JSON.stringify(genres), id]);
        if (!result.changes) {
            return new Error("not found");
        }
        return { ...book, id };
    }
    async deleteBook(id) {
        await this.db.run(`DELETE FROM books WHERE id = ?`, [id]);
    }
    // User methods
    async register(user) {
        if (!process.env.JWT_SECRET) {
            return new Error("JWT token env is undefined");
        }
        const isSameEmailExists = await this.db.get(`SELECT * FROM users WHERE email = ? OR username = ?`, [user.email, user.username]);
        if (isSameEmailExists) {
            return new Error("Your email or username already exists");
        }
        const hashedPassword = await (0, auth_1.createHashFromPassword)(user.password);
        if (typeof hashedPassword !== "string") {
            return new Error("Cannot get hashed password");
        }
        const result = await this.db.run(`INSERT INTO users (username, email, password, role, token, confirmed_account) VALUES (?, ?, ?, ?, ?, ?)`, [user.username, user.email, hashedPassword, 1, "", false]);
        if (!result.lastID) {
            return new Error("cannot register a new user");
        }
        (0, email_1.sendEmail)("bookShop", `Hello! Please open that link and confirm your email: <a href="http://localhost/mailconfirm/${process.env.SECRET_EMAIL_PHRASE}_${user.username}"></a>`, "Confirm the email");
        return {
            ...user,
            id: result.lastID,
            role: 1,
            token: "",
            confirmed_account: false,
        };
    }
    async getUserData(token) {
        const me = await this.db.get(`SELECT * FROM users WHERE token = ?`, [token]);
        return me || new Error("User doesn't exist");
    }
    async getUserById(id) {
        const me = await this.db.get(`SELECT * FROM users WHERE id = ?`, [
            id,
        ]);
        return me || new Error("User doesn't exist");
    }
    async auth(creds) {
        const user = await this.db.get(`SELECT * FROM users WHERE username = ?`, [creds.username]);
        if (!user) {
            return new Error("Authentication failed: user not found");
        }
        const token = await (0, auth_1.generateToken)(creds.password, user.password, user.username, user.role);
        if (token instanceof Error) {
            return token;
        }
        await this.db.run(`UPDATE users SET token = ? WHERE id = ?`, [
            token,
            user.id,
        ]);
        return token;
    }
    async changeRole(id, role) {
        await this.db.run(`UPDATE users SET role = ? WHERE id = ?`, [role, id]);
        const user = await this.db.get(`SELECT * FROM users WHERE id = ?`, [id]);
        return user || new Error("User not found");
    }
    async getAllUsers() {
        const users = await this.db.get(`SELECT * FROM users`, []);
        return users !== null && users !== void 0 ? users : [];
    }
    async confirmEmail(username) {
        const user = await this.db.get(`SELECT * FROM users WHERE username = ?`, [username]);
        if (user) {
            await this.db.run(`UPDATE users SET confirmed_account= ? WHERE username= ?`, [true, username]);
            return "Email confirmed";
        }
        return new Error("Not found, try again");
    }
}
exports.SQLiteDB = SQLiteDB;
