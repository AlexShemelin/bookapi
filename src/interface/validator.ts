import Joi from "joi";
import type { IBookDTO } from "../core/dto/book";
import type { IUserDTO } from "../core/dto/user";

// interface
export abstract class Validator<T, E, Q, R> {
  public abstract validateBook(object: T): boolean | string;
  public abstract validateUser(object: E): boolean | string;
  public abstract validateLogin(object: Q): boolean | string;
  public abstract validateEditRole(object: R): boolean | string;
}

// implementation
const bookShema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  publicationDate: Joi.date().required(),
  genres: Joi.array().required(),
});

const userShema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const loginShema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const roleShema = Joi.object({
  role: Joi.number().required(),
});

export class JoiValidator extends Validator<
  IBookDTO,
  IUserDTO,
  Omit<IUserDTO, "email">,
  { role: number }
> {
  public validateBook(object: IBookDTO) {
    const { error } = bookShema.validate(object);
    if (error) {
      return String(error);
    }
    return true;
  }

  public validateUser(object: IUserDTO) {
    const { error } = userShema.validate(object);
    if (error) {
      return String(error);
    }
    return true;
  }

  public validateLogin(object: IUserDTO) {
    const { error } = loginShema.validate(object);
    if (error) {
      return String(error);
    }
    return true;
  }

  public validateEditRole(object: { role: number }) {
    const { error } = roleShema.validate(object);
    if (error) {
      return String(error);
    }
    return true;
  }
}
