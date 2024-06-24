import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { DatabaseAbstract } from "../database";
import { IBookDTO, IBookDB } from "../../core/dto/book";
import { IUserDTO, IUserDB } from "../../core/dto/user";
import { sendEmail } from "../../utils/email";
import { createHashFromPassword, generateToken } from "../../utils/auth";

export class SQLiteDB extends DatabaseAbstract<IBookDTO, IUserDTO> {
  private db: Database;

  constructor() {
    super();
    this.initialize();
  }

  private async initialize() {
    this.db = await open({
      filename: "./database.sqlite",
      driver: sqlite3.Database,
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
  public async addBook(book: IBookDTO): Promise<Error | IBookDB> {
    const { title, author, publicationDate, genres } = book;
    const result = await this.db.run(
      `INSERT INTO books (title, author, publicationDate, genres) VALUES (?, ?, ?, ?)`,
      [title, author, publicationDate, JSON.stringify(genres)]
    );
    if (!result.lastID) {
      return new Error("cannot insert a row");
    }
    return { ...book, id: result.lastID };
  }

  public async getBooks(): Promise<Error | IBookDTO[]> {
    const books = await this.db.all<IBookDB[]>(`SELECT * FROM books`);
    return books.map((book) => ({
      ...book,
      genres: JSON.parse(book.genres as unknown as string),
      publicationDate: new Date(book.publicationDate),
    }));
  }

  public async getBookById(id: number): Promise<Error | IBookDB> {
    const book = await this.db.get<IBookDB>(
      `SELECT * FROM books WHERE id = ?`,
      [id]
    );
    if (book) {
      return {
        ...book,
        genres: JSON.parse(book.genres as unknown as string),
        publicationDate: new Date(book.publicationDate),
      };
    }
    return new Error("Book not found");
  }

  public async updateBook(
    book: IBookDTO,
    id: number
  ): Promise<Error | IBookDB> {
    const { title, author, publicationDate, genres } = book;
    const result = await this.db.run(
      `UPDATE books SET title = ?, author = ?, publicationDate = ?, genres = ? WHERE id = ?`,
      [title, author, publicationDate, JSON.stringify(genres), id]
    );
    if (!result.changes) {
      return new Error("not found");
    }
    return { ...book, id };
  }

  public async deleteBook(id: number): Promise<Error | void> {
    await this.db.run(`DELETE FROM books WHERE id = ?`, [id]);
  }

  // User methods
  public async register(user: IUserDTO): Promise<Error | IUserDB> {
    if (!process.env.JWT_SECRET) {
      return new Error("JWT token env is undefined");
    }

    const isSameEmailExists = await this.db.get<IUserDB>(
      `SELECT * FROM users WHERE email = ? OR username = ?`,
      [user.email, user.username]
    );

    if (isSameEmailExists) {
      return new Error("Your email or username already exists");
    }

    const hashedPassword = await createHashFromPassword(user.password);
    if (typeof hashedPassword !== "string") {
      return new Error("Cannot get hashed password");
    }

    const result = await this.db.run(
      `INSERT INTO users (username, email, password, role, token, confirmed_account) VALUES (?, ?, ?, ?, ?, ?)`,
      [user.username, user.email, hashedPassword, 1, "", false]
    );

    if (!result.lastID) {
      return new Error("cannot register a new user");
    }

    sendEmail(
      "bookShop",
      `Hello! Please open that link and confirm your email: <a href="http://localhost/mailconfirm/${process.env.SECRET_EMAIL_PHRASE}_${user.username}"></a>`,
      "Confirm the email"
    );
    return {
      ...user,
      id: result.lastID,
      role: 1,
      token: "",
      confirmed_account: false,
    };
  }

  public async getUserData(token: string): Promise<Error | IUserDB> {
    const me = await this.db.get<IUserDB>(
      `SELECT * FROM users WHERE token = ?`,
      [token]
    );
    return me || new Error("User doesn't exist");
  }

  public async getUserById(id: number) {
    const me = await this.db.get<IUserDB>(`SELECT * FROM users WHERE id = ?`, [
      id,
    ]);
    return me || new Error("User doesn't exist");
  }

  public async auth(creds: Omit<IUserDTO, "email">): Promise<Error | string> {
    const user = await this.db.get<IUserDB>(
      `SELECT * FROM users WHERE username = ?`,
      [creds.username]
    );

    if (!user) {
      return new Error("Authentication failed: user not found");
    }

    const token = await generateToken(
      creds.password,
      user.password,
      user.username,
      user.role
    );

    if (token instanceof Error) {
      return token;
    }

    await this.db.run(`UPDATE users SET token = ? WHERE id = ?`, [
      token,
      user.id,
    ]);

    return token;
  }

  public async changeRole(id: number, role: number): Promise<Error | IUserDB> {
    await this.db.run(`UPDATE users SET role = ? WHERE id = ?`, [role, id]);
    const user = await this.db.get<IUserDB>(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
    return user || new Error("User not found");
  }

  public async getAllUsers() {
    const users = await this.db.get<IUserDB[]>(`SELECT * FROM users`, []);
    return users ?? [];
  }

  public async confirmEmail(username: string) {
    const user = await this.db.get<IUserDB>(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    if (user) {
      await this.db.run(
        `UPDATE users SET confirmed_account= ? WHERE username= ?`,
        [true, username]
      );
      return "Email confirmed";
    }
    return new Error("Not found, try again");
  }
}
