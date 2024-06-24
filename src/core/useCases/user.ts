import { UserDTO, IUserDTO } from "../dto/user";
import { IBookDTO } from "../dto/book";
import type { DatabaseAbstract } from "../../interface/database";

export function userUseCases(database: DatabaseAbstract<IBookDTO, IUserDTO>) {
  async function register(user: IUserDTO) {
    const userDTO = UserDTO(user);
    return await database.register(userDTO);
  }

  async function auth(credentials: Omit<IUserDTO, "email">) {
    return await database.auth(credentials);
  }

  async function getUserData(token: string) {
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

  async function changeRole(id: number, role: number) {
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

  async function confirmEmail(username: string) {
    return await database.confirmEmail(username);
  }

  async function isAdmin(token: string) {
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
