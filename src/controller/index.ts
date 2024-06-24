import type { IRouter } from "../interface/router";
import type { IBookDTO } from "../core/dto/book";
import type { IUserDTO } from "../core/dto/user";
import type { DatabaseAbstract } from "../interface/database";
import type { Validator } from "../interface/validator";
import { bookUseCases } from "../core/useCases/book";
import { userUseCases } from "../core/useCases/user";

export function appController<
  T extends IRouter,
  R extends DatabaseAbstract<IBookDTO, IUserDTO>,
  E extends Validator<
    IBookDTO,
    IUserDTO,
    Omit<IUserDTO, "email">,
    { role: number }
  >,
>(router: T, database: R, validator: E) {
  const { addBook, deleteBook, getBookById, getBooks, updateBook } =
    bookUseCases(database);

  const { auth, changeRole, getUserData, register, confirmEmail, isAdmin } =
    userUseCases(database);

  return function () {
    return {
      run: (port: number) => {
        /* * *
         * Protected routes
         * * */
        router.post("/books", async function (req, res) {
          try {
            const token = req.headers.authorization;
            if (!token) {
              res.status(403).send("Auth token is empty");
              return;
            }
            const isAdminResult = await isAdmin(token);
            if (!isAdminResult) {
              res.status(500).send("Restricted ");
              return;
            }
            const validatorResult = validator.validateBook(req.body);
            if (typeof validatorResult === "string") {
              res
                .status(500)
                .send(`Schema is not correct - ${validatorResult}`);
              return;
            }
            const book = await addBook(req.body);
            if (book instanceof Error) {
              res.status(500).send(book.message);
              return;
            }
            res.status(200).contentType("application/json").send(book);
          } catch (e) {
            res.status(500).send(`Error occured - ${e}`);
          }
        });

        router.put("/books/:id", async function (req, res) {
          try {
            const token = req.headers.authorization;
            if (!token) {
              res.status(403).send("Auth token is empty");
              return;
            }
            const isAdminResult = await isAdmin(token);
            if (!isAdminResult) {
              res.status(500).send("Restricted ");
              return;
            }
            const validatorResult = validator.validateBook(req.body);
            if (typeof validatorResult === "string") {
              res
                .status(500)
                .send(`Schema is not correct - ${validatorResult}`);
              return;
            }
            const result = await updateBook(req.body, Number(req.params.id));
            res.status(200).contentType("application/json").send(result);
          } catch (e) {
            res.status(500).send(`Error occured - ${e}`);
          }
        });

        router.delete("/books/:id", async function (req, res) {
          try {
            const token = req.headers.authorization;
            if (!token) {
              res.status(403).send("Auth token is empty");
              return;
            }
            const isAdminResult = await isAdmin(token);
            if (!isAdminResult) {
              res.status(500).send("Restricted ");
              return;
            }
            const result = await deleteBook(Number(req.params.id));
            res.status(200).contentType("application/json").send(result);
          } catch (e) {
            res.status(500).send(`Error occured - ${e}`);
          }
        });

        router.get("/users/me", async function (req, res) {
          try {
            const token = req.headers.authorization;
            if (!token) {
              res.status(403).send("Auth token is empty");
              return;
            }
            const result = await getUserData(token);
            if (result instanceof Error) {
              res.status(500).send(result.message);
              return;
            }
            res.status(200).contentType("application/json").send(result);
          } catch (e) {
            res.status(500).send(`Error occured - ${e}`);
          }
        });

        router.put("/users/:id/role", async function (req, res) {
          try {
            const token = req.headers.authorization;
            if (!token) {
              res.status(403).send("Auth token is empty");
              return;
            }

            const isAdminResult = await isAdmin(token);
            if (!isAdminResult) {
              res.status(500).send("Restricted ");
              return;
            }

            const validatorResult = validator.validateEditRole(req.body);
            if (typeof validatorResult === "string") {
              res
                .status(500)
                .send(`Schema is not correct - ${validatorResult}`);
              return;
            }

            const result = await changeRole(
              Number(req.params.id),
              Number(req.body.role)
            );

            if (result instanceof Error) {
              res.status(500).send(result.message);
              return;
            }
            res.status(200).contentType("application/json").send(result);
          } catch (e) {
            res.status(500).send(`Error occured - ${e}`);
          }
        });

        /* * *
         * Public routes
         * * */
        router.get("/books", async function (_, res) {
          try {
            const result = await getBooks();
            res.status(200).contentType("application/json").send(result);
          } catch (e) {
            res.status(500).send(`Error occured - ${e}`);
          }
        });

        router.get("/books/:id", async function (req, res) {
          try {
            const result = await getBookById(Number(req.params.id));
            res.status(200).contentType("application/json").send(result);
          } catch (e) {
            res.status(500).send(`Error occured - ${e}`);
          }
        });

        router.post("/users/register", async function (req, res) {
          try {
            if (!validator.validateUser(req.body)) {
              res.status(500).send("Schema is not correct");
              return;
            }
            const result = await register(req.body);
            if (result instanceof Error) {
              res.status(500).send(result.message);
              return;
            }
            res.status(200).contentType("application/json").send(result);
          } catch (e) {
            res.status(500).send(`Error occured - ${e}`);
          }
        });

        router.post("/users/login", async function (req, res) {
          try {
            if (!validator.validateLogin(req.body)) {
              res.status(500).send("Schema is not correct");
              return;
            }
            const result = await auth(req.body);
            if (result instanceof Error) {
              res.status(500).send(result.message);
              return;
            }
            res.status(200).contentType("application/json").send(result);
          } catch (e) {
            res.status(500).send(`Error occured - ${e}`);
          }
        });

        router.get("/mailconfirm/:token", async function (req, res) {
          try {
            const secret = req.params.token.split("_")[0];

            if (secret !== process.env.SECRET_EMAIL_PHRASE) {
              res.status(500).send("error occured");
              return;
            }

            const result = await confirmEmail(req.params.token.split("_")[1]);
            if (result instanceof Error) {
              res.status(500).send(result.message);
              return;
            }
            res.status(200).contentType("application/json").send(result);
          } catch (e) {
            res.status(500).send(`Error occured - ${e}`);
          }
        });

        router.listen(port);
        console.log("listen on port " + port);
      },
    };
  };
}
