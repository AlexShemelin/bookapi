import { bookUseCases } from '../../core/useCases/book';
import { 
     InMemoryTestDB
} from '../../interface/db_implementations/inMemory';
import { consoleGreen, consoleRed } from '../../utils/colorLogs';
import dotenv from "dotenv";
dotenv.config();

consoleGreen('--------------BOOKS-----------------');
(async function shouldAddNewBook() {
    try {
        const DB = new InMemoryTestDB({
            books: [],
            users: [{
                email: 'admin@bookapi.com',
                id: 1,
                password: '',
                role: 1 | 2,
                token: '',
                username: 'admin',
                confirmed_account: true
            }]
        });
        const useCases = bookUseCases(DB);
        await useCases.addBook({
            author: 'Bob',
            genres: ['fantasy', 'epic'],
            publicationDate: new Date(),
            title: 'Lord of the bottles'
        });
        const result = await useCases.getBookById(1);
        if (result instanceof Error) {
            consoleRed(`shouldAddNewBook - failed ${result.message}`);
            return;
        }
        if (result?.title==='Lord of the bottles') {
            consoleGreen('shouldAddNewBook - passed');
        } else {
            consoleRed(`shouldAddNewBook - failed`);
        }
    } catch(e) {
        console.log(e);
        consoleRed('shouldAddNewBook - crashed');
    }
})();

(async function shouldDeleteBook() {
    try {
        const DB = new InMemoryTestDB({
            books: [],
            users: [{
                email: 'admin@bookapi.com',
                id: 1,
                password: '',
                role: 1 | 2,
                token: '',
                username: 'admin',
                confirmed_account: true
            }]
        });
        const useCases = bookUseCases(DB);
        await useCases.addBook({
            author: 'Bob',
            genres: ['fantasy', 'epic'],
            publicationDate: new Date(),
            title: 'Lord of the bottles'
        });
        await useCases.deleteBook(1);
        const result = await useCases.getBooks();
        if (result instanceof Error) {
            consoleRed(`shouldDeleteBook - failed ${result.message}`);
            return;
        }
        if (result?.length===0) {
            consoleGreen('shouldDeleteBook - passed');
        } else {
            consoleRed(`shouldDeleteBook - failed`);
        }
    } catch(e) {
        console.log(e);
        consoleRed('shouldDeleteBook - crashed');
    }
})();

(async function shouldNotDeleteBook() {
    try {
        const DB = new InMemoryTestDB({
            books: [],
            users: [{
                email: 'admin@bookapi.com',
                id: 1,
                password: '',
                role: 1 | 2,
                token: '',
                username: 'admin',
                confirmed_account: true
            }]
        });
        const useCases = bookUseCases(DB);
        await useCases.addBook({
            author: 'Bob',
            genres: ['fantasy', 'epic'],
            publicationDate: new Date(),
            title: 'Lord of the bottles'
        });
        await useCases.deleteBook(1234);
        const result = await useCases.getBooks();
        if (result instanceof Error) {
            consoleRed(`shouldNotDeleteBook - failed ${result.message}`);
            return;
        }
        if (result?.length===1) {
            consoleGreen('shouldNotDeleteBook - passed');
        } else {
            consoleRed(`shouldNotDeleteBook - failed`);
        }
    } catch(e) {
        console.log(e);
        consoleRed('shouldNotDeleteBook - crashed');
    }
})();

(async function shouldEditBook() {
    try {
        const DB = new InMemoryTestDB({
            books: [],
            users: [{
                email: 'admin@bookapi.com',
                id: 1,
                password: '',
                role: 1 | 2,
                token: '',
                username: 'admin',
                confirmed_account: true
            }]
        });
        const useCases = bookUseCases(DB);
        await useCases.addBook({
            author: 'Bob',
            genres: ['fantasy', 'epic'],
            publicationDate: new Date(),
            title: 'Lord of the bottles'
        });
        await useCases.updateBook({
            author: 'Eddy',
            genres: ['fantasy', 'epic'],
            publicationDate: new Date(),
            title: 'Lord of the bottles'
        },
        1
        );
        const result = await useCases.getBooks();
        if (result instanceof Error) {
            consoleRed(`shouldEditBook - failed ${result.message}`);
            return;
        }
        if (result?.[0].author==='Eddy') {
            consoleGreen('shouldEditBook - passed');
        } else {
            consoleRed(`shouldEditBook - failed`);
        }
    } catch(e) {
        console.log(e);
        consoleRed('shouldEditBook - crashed');
    }
})();

(async function shouldNotEditBook() {
    try {
        const DB = new InMemoryTestDB({
            books: [],
            users: [{
                email: 'admin@bookapi.com',
                id: 1,
                password: '',
                role: 1 | 2,
                token: '',
                username: 'admin',
                confirmed_account: true
            }]
        });
        const useCases = bookUseCases(DB);
        await useCases.addBook({
            author: 'Bob',
            genres: ['fantasy', 'epic'],
            publicationDate: new Date(),
            title: 'Lord of the bottles'
        });
        await useCases.updateBook({
            author: 'Eddy',
            genres: ['fantasy', 'epic'],
            publicationDate: new Date(),
            title: 'Lord of the bottles'
        },
        1234
        );
        const result = await useCases.getBooks();
        if (result instanceof Error) {
            consoleRed(`shouldNotEditBook - failed ${result.message}`);
            return;
        }
        if (result?.[0].author==='Bob') {
            consoleGreen('shouldNotEditBook - passed');
        } else {
            consoleRed(`shouldNotEditBook - failed`);
        }
    } catch(e) {
        console.log(e);
        consoleRed('shouldNotEditBook - crashed');
    }
})();


