export type IUserDTO = {
  username: string;
  email: string;
  password: string;
};

export type IUserDB = IUserDTO & {
  id: number;
  role: number;
  token: string;
  confirmed_account: boolean;
};

export function UserDTO(user: IUserDTO) {
  return Object.freeze(user);
}
