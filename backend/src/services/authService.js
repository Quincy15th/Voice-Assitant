import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../utils/env.js";
import { createUser, findUserByEmail } from "../repository/userRepository.js";

class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function signAccessToken(userId) {
  return jwt.sign(
    { userId: String(userId) },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

export async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw new AuthError("Thiếu dữ liệu (name, email, password).", 400);
  }
  if (typeof password !== "string" || password.length < 6) {
    throw new AuthError("Mật khẩu tối thiểu 6 ký tự.", 400);
  }

  const existed = await findUserByEmail(email);
  if (existed) {
    throw new AuthError("Email đã được sử dụng.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, hashedPassword });
  const accessToken = signAccessToken(user.id);

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profile: user.profile,
    },
  };
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new AuthError("Thiếu dữ liệu (email, password).", 400);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AuthError("Email hoặc mật khẩu không đúng.", 401);
  }

  const ok = await bcrypt.compare(password, user.hashedPassword);
  if (!ok) {
    throw new AuthError("Email hoặc mật khẩu không đúng.", 401);
  }

  const accessToken = signAccessToken(user.id);
  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profile: user.profile,
    },
  };
}

export function isAuthError(err) {
  return err instanceof AuthError && typeof err.statusCode === "number";
}
