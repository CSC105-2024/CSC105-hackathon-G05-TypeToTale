import type { Context } from "hono";
import type { signupRequest } from "../types/user";
import {
  signUp,
  isLogin,
  editUser,
  getTypingSessionByUserId,
  getTypingSessionById,
  updateTypingSessionById,
  deleteTypingSession,
} from "../models/user";
const signup = async (c: Context) => {
  try {
    const { username, email, password }: signupRequest =
      await c.req.json<signupRequest>();

    console.log("User signup attempt:", { username, email, password });

    await signUp(username, email, password);
    // For this example, we will just return a success message
    return c.json({ status: true, message: "User signed up successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    return c.json({ error: "Failed to sign up user" }, 500);
  }
};

const login = async (c: Context) => {
  try {
    const { email, password }: { email: string; password: string } =
      await c.req.json<{ email: string; password: string }>();

    console.log("User login attempt:", { email, password });

    const userLogin = await isLogin(email, password);
    if (!userLogin) {
      return c.json({ error: "Invalid email or password" }, 401);
    }
    // For this example, we will just return a success message
    return c.json({ message: "User logged in successfully", userLogin });
  } catch (error) {
    console.error("Error during login:", error);
    return c.json({ error: "Failed to log in user" }, 500);
  }
};

const editUserProfile = async (c: Context) => {
  try {
    const userId = c.req.param("id");
    const body = await c.req.formData();
    const username = body.get("username") as string;
    const email = body.get("email") as string;
    const image = body.get("image") as File;

    if (!userId || !username || !email) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const editedUser = await editUser(Number(userId), username, email, image);

    console.log(editedUser);
    if (!editedUser.status) {
      return c.json({ error: "Failed to edit user profile" }, 500);
    }

    return c.json({
      status: true,
      message: "User profile updated successfully",
      user: editedUser,
    });
  } catch (error) {
    console.error("Error editing user profile:", error);
    return c.json({ error: "An unexpected error occurred" }, 500);
  }
};

const getUserTypingSession = async (c: Context) => {
  try {
    const userId = c.req.param("userId");
    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const books = await getTypingSessionByUserId(Number(userId));
    if (!books.status) {
      return c.json({ error: "Failed to fetch typing sessions" }, 500);
    }

    return c.json({ status: true, books: books.books });
  } catch (error) {
    console.error("Error fetching typing sessions:", error);
    return c.json({ error: "An unexpected error occurred" }, 500);
  }
};

const getTypingSession = async (c: Context) => {
  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const book = await getTypingSessionById(Number(id));
    if (!book.status) {
      return c.json({ error: "Failed to fetch typing sessions" }, 500);
    }

    return c.json({ status: true, book });
  } catch (error) {
    console.error("Error fetching typing sessions:", error);
    return c.json({ error: "An unexpected error occurred" }, 500);
  }
};

const updateTypingSession = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();

    if (!id) {
      return c.json({ error: "Session ID is required" }, 400);
    }

    // Update the typing session status in your database
    const updatedSession = await updateTypingSessionById(Number(id), {
      status,
    });

    if (!updatedSession) {
      return c.json({ error: "Failed to update typing session" }, 500);
    }

    return c.json({
      status: true,
      message: "Session updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Error updating typing session:", error);
    return c.json({ error: "An unexpected error occurred" }, 500);
  }
};

const deleteTyping = async (c: Context) => {
  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ error: "Session ID is required" }, 400);
    }
    const deletedSession = await deleteTypingSession(Number(id));

    return c.json({ status: true, deletedSession });
  } catch (error) {
    console.error("Error deleting typing session:", error);
    return c.json({ error: "An unexpected error occurred" }, 500);
  }
};
export {
  signup,
  login,
  editUserProfile,
  getUserTypingSession,
  getTypingSession,
  updateTypingSession,
  deleteTyping,
};
