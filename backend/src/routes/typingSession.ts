import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth";
import { successTyping } from "../controllers/typing";
const typingSessionRouter = new Hono();

typingSessionRouter.use(authMiddleware);

typingSessionRouter.post("/complete", successTyping);

export { typingSessionRouter };
