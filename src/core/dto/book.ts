export type IBookDTO = {
  title: string;
  author: string;
  publicationDate: Date;
  genres: string[];
};

export type IBookDB = IBookDTO & {
  id: number;
};

export function BookDTO(book: IBookDTO) {
  return Object.freeze({
    title: book.title,
    author: book.author,
    publicationDate: book.publicationDate,
    genres: book.genres,
  });
}
