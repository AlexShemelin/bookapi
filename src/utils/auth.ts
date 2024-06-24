import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/*
  const ROLE_USER = 1; // 0001
  const ROLE_ADMIN = 2; // 0010

  logic sum: 0001 (1) | 0010 (2) = 0011 (3)
*/

export async function createHashFromPassword(password: string) {
  try {
    if (!process.env.SALT) {
      return new Error("SALT env is undefined");
    }
    return await bcrypt.hash(password, process.env.SALT);
  } catch (error) {
    return new Error(`createHashFromPassword error - ${error}`);
  }
}

export async function generateToken(
  password: string,
  dbpassword: string,
  username: string,
  role: number
) {
  if (!process.env.JWT_SECRET) {
    return new Error("JWT_SECRET env is undefined");
  }
  // Compare the provided password with the stored hash
  const match = await bcrypt.compare(password, dbpassword);
  if (!match) {
    return new Error("Authentication failed: incorrect password");
  }
  // Generate a JWT
  const token = jwt.sign({ username, role }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
  return token;
}
