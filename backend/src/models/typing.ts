import { db } from "../services/prisma";

const toggleSuccess = async (sessionId: number, userId: number) => {
  try {
    await db.typingSession.update({
      where: {
        userId,
        id: sessionId,
      },
      data: {
        status: true,
      },
    });
    return true;
  } catch (error) {
    console.error("Error updating typing session status:", error);
    throw new Error("Failed to update typing session status.");
  }
};

const renameTypingSessionByUserId = async (
  userId: number,
  sessionId: number,
  newName: string,
) => {
  try {
    await db.typingSession.update({
      where: {
        userId,
        id: sessionId,
      },
      data: {
        theme: newName,
      },
    });
    return true;
  } catch (error) {
    console.error("Error renaming typing session:", error);
    throw new Error("Failed to rename typing session.");
  }
};
export { toggleSuccess, renameTypingSessionByUserId };
