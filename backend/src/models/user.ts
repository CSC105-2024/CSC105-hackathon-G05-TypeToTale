import { hashPassword, comparePassword } from "../utils/hash"; // Assuming you have a utility to hash passwords
import { db } from "../services/prisma"; // Assuming you have a database module to interact with your database
import { assignToken } from "../middlewares/auth";
import { uploadToCloudinary } from "../services/cloudinary";

const signUp = async (username: string, email: string, password: string) => {
  try {
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return { status: false, msg: "user has existed" };
    }
    const hashedPassword = await hashPassword(password); // Hash the password before storing it
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        user_image:
          "https://res.cloudinary.com/drjdfs1p5/image/upload/v1746346924/products/sapztapbybwptc1k7ox2.jpg",
      },
    });

    return { status: true, newUser };
  } catch (err) {
    console.error(err);
    return { status: false, msg: "Internal server error" };
  }
};

const isLogin = async (email: string, password: string) => {
  const user = await db.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    return {
      status: false,
      msg: "Can't find user account!",
    };
  }
  const hashedPassword = user?.password;
  const isCorrect = await comparePassword(password, hashedPassword);
  console.log(isCorrect);
  if (!isCorrect) {
    return {
      status: false,
      msg: "Password is invalid.",
    };
  }

  const token = await assignToken(user.id, user.username, user.email);
  if (!token.status) {
    return { status: token.status, msg: "secretKey not found" };
  }

  return {
    status: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      img_url: user.user_image,
    },
  };
};

const createTypingSession = async (
  theme: string,
  userId: number,
  validStory: string,
  invalidStory: string,
) => {
  try {
    console.log(theme, userId, validStory, invalidStory);
    const session = await db.typingSession.create({
      data: {
        theme,
        userId,
        validStory,
        invalidStory,
        status: false,
      },
    });

    return session;
  } catch (error) {
    console.error("Failed to create typing session:", error);
    throw new Error("Could not create typing session");
  }
};

const editUser = async (
  userId: number,
  username: string,
  email: string,
  image: File,
) => {
  try {
    if (!image) {
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          username,
          email,
        },
      });
      return {
        status: true,
        updatedUser,
      };
    } else {
      const image_url = await uploadToCloudinary(image);
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          username,
          email,
          user_image: image_url.secure_url, // Assuming uploadToCloudinary returns an object with secure_url
        },
      });
      return {
        status: true,
        updatedUser,
      };
    }
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return {
      status: false,
      msg: "Failed to update user profile",
    };
  }
};

const getTypingSessionByUserId = async (userId: number) => {
  try {
    const books = await db.typingSession.findMany({
      where: { userId },
    });
    return { status: true, books };
  } catch (error) {
    console.error("Failed to fetch books by user ID:", error);
    throw new Error("Could not fetch books");
  }
};

const getTypingSessionById = async (sessionId: number) => {
  try {
    const session = await db.typingSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return { status: false, msg: "Session not found" };
    }
    return { status: true, session };
  } catch (error) {
    console.error("Failed to fetch typing session by ID:", error);
    throw new Error("Could not fetch typing session");
  }
};

const updateTypingSessionById = async (
  id: number,
  data: { status?: boolean },
) => {
  try {
    const updatedSession = await db.typingSession.update({
      where: { id },
      data: {
        status: data.status,
        updatedAt: new Date(),
      },
    });
    return updatedSession;
  } catch (error) {
    console.error("Error updating typing session:", error);
    return null;
  }
};

const getCompleteStory = async (id: number) => {
  try {
    const session = await db.typingSession.findUnique({
      where: { id, status: true },
      select: {
        validStory: true,
        invalidStory: true,
        createdAt: true,
      },
    });
    if (!session) {
      return { status: false, msg: "Session not found" };
    }
    return { status: true, session };
  } catch (error) {
    console.error("Failed to fetch complete story:", error);
    throw new Error("Could not fetch complete story");
  }
};

const deleteTypingSession = async (id: number) => {
  try {
    const deletedSession = await db.typingSession.delete({
      where: { id },
    });
    return { status: true, deletedSession };
  } catch (error) {
    console.error("Failed to delete typing session:", error);
    return { status: false, msg: "Could not delete typing session" };
  }
};

export {
  signUp,
  isLogin,
  createTypingSession,
  editUser,
  getTypingSessionByUserId,
  getTypingSessionById,
  updateTypingSessionById,
  getCompleteStory,
  deleteTypingSession,
};
