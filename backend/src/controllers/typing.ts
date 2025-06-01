import type { Context } from "hono";
import { toggleSuccess } from "../models/typing";
import { renameTypingSessionByUserId } from "../models/typing";
import { getCompleteStory } from "../models/user";
const successTyping = async (c: Context) => {
  const { userId, typingSessionId } = await c.req.json();
  if (!userId) {
    return c.json(
      {
        status: false,
        message: "User ID is required",
      },
      400,
    );
  }

  const succeed = await toggleSuccess(Number(userId), Number(typingSessionId));
  if (!succeed) {
    return c.json({ status: false, message: "can't update typing status." });
  }

  return c.json({
    status: true,
    message: "Typing route is working!",
  });
};

const renameTypingSession = async (c: Context) => {
  const typingSessionId = c.req.param("id");
  const { userId, newName } = await c.req.json();
  if (!userId || !typingSessionId || !newName) {
    return c.json(
      {
        status: false,
        message: "User ID, Typing Session ID and New Name are required",
      },
      400,
    );
  }

  const updatedSessionName = await renameTypingSessionByUserId(
    Number(userId),
    Number(typingSessionId),
    newName,
  );

  // Logic to rename the typing session would go here
  // For now, we will just return a success message
  return c.json({
    updatedSessionName,
    status: true,
    message: "Typing session renamed successfully!",
  });
};

const getCompleteStoryById = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) {
    return c.json({ error: "Typing session ID is required" }, 400);
  }
  const completedStory = await getCompleteStory(Number(id));
  if (!completedStory) {
    return c.json({ error: "Failed to fetch completed story" }, 500);
  }
  return c.json({
    status: true,
    completedStory,
  });
};

export { successTyping, renameTypingSession, getCompleteStoryById };
