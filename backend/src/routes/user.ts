import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth";
import {
  login,
  signup,
  editUserProfile,
  getUserTypingSession,
  updateTypingSession,
  getTypingSession,
  deleteTyping,
} from "../controllers/user";
import { geminiCreateStory } from "../controllers/gemini";
import { tokenValidation } from "../middlewares/tokenValidation";
import {
  renameTypingSession,
  getCompleteStoryById,
} from "../controllers/typing";

const userRouter = new Hono();
const userSecureRouter = new Hono();

userSecureRouter.use(authMiddleware);

userSecureRouter.get("/typing-session/:id", getTypingSession);
userSecureRouter.get("/typing-sessions/:userId", getUserTypingSession);
userSecureRouter.get("/complete-story/:id", getCompleteStoryById);

userSecureRouter.post("/generate-story/:userId", geminiCreateStory);

userSecureRouter.put("/edit-profile/:id", editUserProfile);
userSecureRouter.put("/rename-typing-session/:id", renameTypingSession);
userSecureRouter.put("/typing-session/:id", updateTypingSession);

userSecureRouter.delete("/typing-session/:id", deleteTyping);

userRouter.get("/token-validation", tokenValidation);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/", (c) => {
  return c.text("User route is working!");
});

export { userRouter, userSecureRouter };
