"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUseCases = void 0;
const user_1 = require("../dto/user");
function userUseCases(database) {
    async function register(user) {
        const userDTO = (0, user_1.UserDTO)(user);
        return await database.register(userDTO);
    }
    async function auth(credentials) {
        return await database.auth(credentials);
    }
    async function getUserData(token) {
        const me = await database.getUserData(token);
        if (me instanceof Error) {
            return me;
        }
        const sanitizedUserData = {
            username: me.username,
            email: me.email,
            id: me.id,
            role: me.role === 3 ? "admin" : "user",
            confirmed_account: me.confirmed_account,
        };
        return sanitizedUserData;
    }
    async function changeRole(id, role) {
        const newUserData = await database.changeRole(id, role);
        if (newUserData instanceof Error) {
            return newUserData;
        }
        return {
            username: newUserData.username,
            email: newUserData.email,
            role: role === 1 ? "user" : "admin",
        };
    }
    async function getAllUsers() {
        return await database.getAllUsers();
    }
    async function confirmEmail(username) {
        return await database.confirmEmail(username);
    }
    async function isAdmin(token) {
        const userCredentails = await database.getUserData(token);
        if (userCredentails instanceof Error) {
            return false;
        }
        const hasAdminRights = userCredentails.role === 3;
        return hasAdminRights;
    }
    return {
        register,
        auth,
        getUserData,
        changeRole,
        getAllUsers,
        confirmEmail,
        isAdmin,
    };
}
exports.userUseCases = userUseCases;
