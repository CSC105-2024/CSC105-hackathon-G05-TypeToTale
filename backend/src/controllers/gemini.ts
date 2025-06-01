import type { Context } from "hono";
import { geminiCreateStoryRequest } from "../types/gemini";
import { geminiAI, geminiMakeInvalidStory } from "../services/gemini";
import { createTypingSession } from "../models/user";

const geminiCreateStory = async (c: Context) => {
  const userId = c.req.param("userId");
  const { theme } = await c.req.json<geminiCreateStoryRequest>();
  const validStory = await geminiAI(theme);
  if (!validStory) {
    return c.json(
      {
        message: "Failed to generate story",
      },
      500,
    );
  }

  const invalidStory = await geminiMakeInvalidStory(validStory);
  if (!invalidStory) {
    return c.json(
      {
        message: "Failed to generate invalid story",
      },
      500,
    );
  }

  await createTypingSession(theme, Number(userId), validStory, invalidStory);

  return c.json({
    message: "Story generated successfully",
    theme,
    validStory,
    invalidStory,
  });
};

export { geminiCreateStory };
