import type { IUserDB } from "../core/dto/user";

// interface
export abstract class DatabaseAbstract<IBook, IUser> {
  // book part
  public abstract addBook(book: IBook): Promise<Error | IBook>;
  public abstract getBooks(): Promise<Error | IBook[]>;
  public abstract getBookById(id: number): Promise<Error | IBook>;
  public abstract updateBook(book: IBook, id: number): Promise<Error | IBook>;
  public abstract deleteBook(id: number): Promise<Error | void>;

  // user part
  public abstract register(user: IUser): Promise<Error | IUser>;
  public abstract auth(creds: Omit<IUser, "email">): Promise<Error | string>;
  public abstract getUserData(token: string): Promise<Error | IUserDB>;
  public abstract changeRole(id: number, role: number): Promise<Error | IUser>;
  public abstract getAllUsers(): Promise<IUser[]>;
  public abstract confirmEmail(username: string): Promise<Error | string>;
}
