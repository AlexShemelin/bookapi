import express from "express";
import cors from "cors";
import { JoiValidator } from "./interface/validator";
import { appController } from "./controller/index";
import { SQLiteDB } from "./interface/db_implementations/sqlite";
import { InMemoryTestDB } from "./interface/db_implementations/inMemory";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const router = express();
  router.use(cors());
  router.use(express.json());

  const SQLite = new SQLiteDB();
  const InMemoryDB = new InMemoryTestDB({
    books: [],
    // pre-defined admin
    users: [
      {
        email: "admin@bookapi.com",
        id: 1,
        password:
          "$2b$05$GPIu/cuBJJ5FAOUvTXzK0u1n6kGavZ.k8Akr/Zubf9uPkWaDD2aIi", // admin
        role: (Number(process.env.ROLE_ADMIN) | Number(process.env.ROLE_USER)) || 1,
        token: "",
        username: "admin",
        confirmed_account: true,
      },
    ],
  });
  const DB = process.env.MODE === "TEST" ? InMemoryDB : SQLite;
  const controller = appController(router, DB, new JoiValidator());
  controller().run(Number(process.env.ROUTER_PORT));
}

main();
