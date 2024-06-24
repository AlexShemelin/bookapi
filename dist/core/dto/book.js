"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookDTO = void 0;
function BookDTO(book) {
    return Object.freeze({
        title: book.title,
        author: book.author,
        publicationDate: book.publicationDate,
        genres: book.genres,
    });
}
exports.BookDTO = BookDTO;
