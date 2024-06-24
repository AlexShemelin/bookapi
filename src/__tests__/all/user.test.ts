import { IUserDB } from '../../core/dto/user';
import { userUseCases } from '../../core/useCases/user';
import { 
    InMemoryTestDB
} from '../../interface/db_implementations/inMemory';
import { consoleGreen, consoleRed } from '../../utils/colorLogs';
import dotenv from "dotenv";
dotenv.config();

consoleGreen('--------------USERS-----------------');
(async function shouldRegisterNewUserAndLogin() {
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
        const useCases = userUseCases(DB);
        const regResult = await useCases.register({
            email: 'Bob@mail.com',
            username: 'Super_Bob',
            password: '1234'
        });

        if (regResult instanceof Error) {
            consoleRed(`shouldRegisterNewUserAndLogin - failed ${regResult.message}`);
            return;
        }
        
        const result = await useCases.auth({
            password: '1234',
            username: 'Super_Bob'
        });
        
        if (result instanceof Error) {
            consoleRed(`shouldRegisterNewUserAndLogin - failed ${result.message}`);
            return;
        }
        if (typeof result==='string') {
            consoleGreen('shouldRegisterNewUserAndLogin - passed');
        } else {
            consoleRed(`shouldRegisterNewUserAndLogin - failed`);
        }
    } catch(e) {
        console.log(e);
        consoleRed('shouldRegisterNewUserAndLogin - crashed');
    }
})();

(async function shouldRegisterNewUserAndNotLogin() {
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
        const useCases = userUseCases(DB);
        const regResult = await useCases.register({
            email: 'Bob@mail.com',
            username: 'Super_Bob',
            password: '1234'
        });

        if (regResult instanceof Error) {
            consoleRed(`shouldRegisterNewUserAndNotLogin - failed ${regResult.message}`);
            return;
        }
        
        const result = await useCases.auth({
            password: '123456',
            username: 'Super_Bob'
        });
        
        if (result instanceof Error) {
            consoleGreen('shouldRegisterNewUserAndNotLogin - passed');
        } else {
            consoleRed(`shouldRegisterNewUserAndNotLogin - failed`);
        }
    } catch(e) {
        console.log(e);
        consoleRed('shouldRegisterNewUserAndNotLogin - crashed');
    }
})();

(async function shouldRegisterNewUserLoginAndGetUserData() {
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
        const useCases = userUseCases(DB);
        const regResult = await useCases.register({
            email: 'Bob@mail.com',
            username: 'Super_Bob',
            password: '1234'
        });

        if (regResult instanceof Error) {
            consoleRed(`shouldRegisterNewUserLoginAndGetUserData - failed ${regResult.message}`);
            return;
        }
        
        const token = await useCases.auth({
            password: '1234',
            username: 'Super_Bob'
        });

        if (token instanceof Error) {
            consoleRed(`shouldRegisterNewUserLoginAndGetUserData - failed ${token.message}`);
            return;
        }
        const result = await useCases.getUserData(token);
        if (!(result instanceof Error)) {
            consoleGreen('shouldRegisterNewUserLoginAndGetUserData - passed');
        } else {
            consoleRed(`shouldRegisterNewUserLoginAndGetUserData - failed`);
        }
    } catch(e) {
        console.log(e);
        consoleRed('shouldRegisterNewUserLoginAndGetUserData - crashed');
    }
})();

(async function shouldRegisterNewUserAndChangeRole() {
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
        const useCases = userUseCases(DB);
        const regResult = await useCases.register({
            email: 'Bob@mail.com',
            username: 'Super_Bob',
            password: '1234'
        });

        if (regResult instanceof Error) {
            consoleRed(`shouldRegisterNewUserAndChangeRole - failed ${regResult.message}`);
            return;
        }
        
        const result = await useCases.changeRole(2, 3);

        if (result instanceof Error) {
            consoleRed(`shouldRegisterNewUserAndChangeRole - failed ${result.message}`);
            return;
        }

        if (result instanceof Error) {
            consoleRed(`shouldRegisterNewUserAndChangeRole - failed ${result.message}`);
            return;
        }

        const newUser = (await useCases.getAllUsers() as IUserDB[]).find(user => user.username==='Super_Bob');
        
        if (newUser instanceof Error) {
            consoleRed(`shouldRegisterNewUserAndChangeRole - failed ${newUser.message}`);
            return;
        }

        if (newUser?.role===3) {
            consoleGreen('shouldRegisterNewUserAndChangeRole - passed');
        } else {
            consoleRed(`shouldRegisterNewUserAndChangeRole - failed`);
        }
    } catch(e) {
        console.log(e);
        consoleRed('shouldRegisterNewUserAndChangeRole - crashed');
    }
})();

(async function shouldRegisterNewUserAndConfirmMail() {
    try {
        const DB = new InMemoryTestDB({
            books: [],
            users: [{
                email: 'admin@bookapi.com',
                id: 1,
                password: '',
                role: 3,
                token: '',
                username: 'admin',
                confirmed_account: true
            }]
        });
        const useCases = userUseCases(DB);
        const regResult = await useCases.register({
            email: 'Bob@mail.com',
            username: 'Super_Bob',
            password: '1234'
        });

        if (regResult instanceof Error) {
            consoleRed(`shouldRegisterNewUserAndConfirmMail - failed ${regResult.message}`);
            return;
        }
        const result = await useCases.confirmEmail('Super_Bob');
        if (!(result instanceof Error)) {
            consoleGreen('shouldRegisterNewUserAndConfirmMail - passed');
        } else {
            consoleRed(`shouldRegisterNewUserAndConfirmMail - failed ${result.message}`);
        }
    } catch(e) {
        console.log(e);
        consoleRed('shouldRegisterNewUserAndConfirmMail - crashed');
    }
})();
