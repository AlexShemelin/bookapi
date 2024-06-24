import { IUserDTO } from "../dto/user";
import { BookDTO, IBookDTO } from "../dto/book";
import type { DatabaseAbstract } from "../../interface/database";

export function bookUseCases(database: DatabaseAbstract<IBookDTO, IUserDTO>) {
  /*
   * Protected routes
   */
  async function addBook(book: IBookDTO) {
    const bookDTO = BookDTO(book);
    return await database.addBook(bookDTO);
  }

  async function updateBook(book: IBookDTO, id: number) {
    const bookDTO = BookDTO(book);
    return await database.updateBook(bookDTO, id);
  }

  async function deleteBook(id: number) {
    return await database.deleteBook(id);
  }

  /*
   * Public routes
   */

  async function getBooks() {
    return await database.getBooks();
  }

  async function getBookById(id: number) {
    return await database.getBookById(id);
  }

  return {
    addBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
  };
}
