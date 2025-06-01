import type { Context } from "hono";
import { verify } from "hono/jwt";

const tokenValidation = async (c: Context) => {
  try {
    // Step 1: Extract the Authorization header
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ status: false, message: "Unauthorized" }, 401);
    }

    // Step 2: Extract the token from the 'Bearer' prefix
    const token = authHeader.replace("Bearer ", "");

    // Step 3: Check if the JWT Secret key is available
    const secretKey = process.env.JWT_SECRET;
    console.log(secretKey);
    if (!secretKey) {
      return c.json({ status: false, message: "Secret key not found." }, 500);
    }

    // Step 4: Verify the token using the secret key
    try {
      const payload = await verify(token, secretKey); // This will throw an error if the token is invalid
      c.set("user", payload); // Store user info for later
      console.log("passed");
      return c.json({ status: true, message: "Token valid", user: payload });
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        console.log("error1");
        return c.json({ status: false, message: "Token has expired" }, 401);
      }
      if (err.name === "JsonWebTokenError") {
        console.log("error2");
        return c.json({ status: false, message: "Invalid token" }, 401);
      }
      return c.json(
        { status: false, message: "Token verification failed" },
        401,
      );
    }
  } catch (error) {
    // Generic catch block for unexpected errors
    return c.json({ status: false, message: "Internal server error" }, 500);
  }
};

export { tokenValidation };
