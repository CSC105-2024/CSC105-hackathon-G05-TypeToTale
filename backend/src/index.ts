import { Hono } from "hono";
import { userRouter, userSecureRouter } from "./routes/user";
import { cors } from "hono/cors";
const app = new Hono();

app.use("*", cors());
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/user/api", userRouter);
app.route("/user/api/secure", userSecureRouter);
export default app;
