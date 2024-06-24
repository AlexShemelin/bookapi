"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookUseCases = void 0;
const book_1 = require("../dto/book");
function bookUseCases(database) {
    /*
     * Protected routes
     */
    async function addBook(book) {
        const bookDTO = (0, book_1.BookDTO)(book);
        return await database.addBook(bookDTO);
    }
    async function updateBook(book, id) {
        const bookDTO = (0, book_1.BookDTO)(book);
        return await database.updateBook(bookDTO, id);
    }
    async function deleteBook(id) {
        return await database.deleteBook(id);
    }
    /*
     * Public routes
     */
    async function getBooks() {
        return await database.getBooks();
    }
    async function getBookById(id) {
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
exports.bookUseCases = bookUseCases;
