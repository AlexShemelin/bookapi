import { DatabaseAbstract } from "../database";
import { IBookDTO, IBookDB } from "../../core/dto/book";
import { IUserDTO, IUserDB } from "../../core/dto/user";
import { createHashFromPassword, generateToken } from "../../utils/auth";

export class InMemoryTestDB extends DatabaseAbstract<IBookDTO, IUserDTO> {
  protected books: IBookDB[];
  protected users: IUserDB[];

  constructor(initData: { books: IBookDB[]; users: IUserDB[] }) {
    super();
    this.books = initData.books;
    this.users = initData.users;
  }

  public async addBook(book: IBookDTO) {
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

  public async deleteBook(id: number) {
    this.books = this.books.filter((book) => book.id !== id);
  }

  public async getBooks() {
    return this.books;
  }

  public async updateBook(book: IBookDTO, id: number) {
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

  public async getBookById(id: number) {
    return (
      this.books.find((dbbook) => dbbook.id === id) ??
      new Error("book is not found")
    );
  }

  public async getUserById(id: number) {
    return (
      this.users.find((dbuser) => dbuser.id === id) ??
      new Error("user is not found")
    );
  }

  public async register(user: IUserDTO) {
    if (!process.env.JWT_SECRET) {
      return new Error("JWT token env is undefined");
    }

    const isSameEmailExists = this.users.find(
      (dbuser) =>
        dbuser.email === user.email || dbuser.username === user.username
    );
    if (isSameEmailExists) {
      return new Error("Your email or username is already exists");
    }

    const hashedPassword = await createHashFromPassword(user.password);
    if (hashedPassword instanceof Error) {
      return new Error(
        `cannot get hashed password - ${hashedPassword.message}`
      );
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

  public async getUserData(token: string) {
    const me = this.users.find((dbuser) => dbuser.token === token);
    if (!me) {
      return new Error("Please login");
    }
    return me;
  }

  public async auth(creds: Omit<IUserDTO, "email">) {
    const userIndex = this.users.findIndex(
      (dbuser) => dbuser.username === creds.username
    );
    if (userIndex === -1) {
      return new Error("Authentication failed: user not found");
    }
    const token = await generateToken(
      creds.password,
      this.users[userIndex].password,
      creds.username,
      this.users[userIndex].role
    );
    if (token instanceof Error) {
      return token;
    }
    this.users[userIndex].token = token;
    return token;
  }

  public async changeRole(id: number, role: number) {
    const userIndex = this.users.findIndex((dbuser) => dbuser.id === id);
    this.users[userIndex].role = role;
    return this.users[userIndex];
  }

  public async getAllUsers() {
    return this.users;
  }

  public async confirmEmail(username: string) {
    const useIndex = this.users.findIndex((user) => user.username === username);
    if (useIndex !== -1) {
      this.users[useIndex].confirmed_account = true;
      return "Email confirmed";
    }
    return new Error("Not found, try again");
  }
}
