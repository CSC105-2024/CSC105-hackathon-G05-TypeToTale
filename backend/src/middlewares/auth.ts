// middleware/auth.ts
import { MiddlewareHandler } from "hono";
import { sign, verify } from "hono/jwt";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  console.log(authHeader);
  if (!authHeader) {
    console.log("Error auth");
    return c.json({ message: "Unauthorized" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    console.log(token);
    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
      throw new Error("JWT secret is not defined in environment variables");
    }
    const payload = await verify(token, jwt_secret);
    c.set("user", payload); // Store user info for later
    await next();
  } catch (err) {
    return c.json({ message: "Invalid token" }, 401);
  }
};

export const assignToken = async (
  userId: number,
  userName: string,
  email: string,
) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    return { status: false, msg: "secretKey not found" };
  }
  const token = await sign(
    {
      id: userId,
      username: userName,
      email: email,
      exp: Math.floor(Date.now() / 1000) + 60 * 100,
    },
    secretKey,
    "HS256",
  );
  return { status: true, token };
};
