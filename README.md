# :pushpin: G05-TypeTpTale
TypeToTale transforms typing practice by turning reading into an interactive challenge. Instead of passively reading, users type out short stories that are revealed paragraph by paragraph. This fun, engaging method helps improve typing speed and accuracy, especially for computer science students who need strong typing skills. The app uses AI to generate stories based on user interests, tracking progress with a digital bookshelf. With each correctly typed paragraph, users unlock the next, promoting precision and focus while learning.

### Tech stack:
- Frontend: React (bun)
- Backend: Hono (bun)
- Database: PostgreSQL (prisma)

# :rocket: Project Setup Instructions

**Note:** you can not run both frontend and backend properly if you don't have proper environment variable (such as prisma, google map, cloudinary, etc.) in **.env** which **we are not provided because it security reasons** but **if** you are our collaborators the website will work just fine.

**Make sure [Bun](https://bun.sh/)** is installed on your system before proceeding. You can install it by following the instructions on the official Bun website.

---

## Frontend Setup

1. **Clone the Repository**
   Open your terminal and clone the project repository:

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the Frontend Directory**

   ```bash
   cd frontend
   ```

3. **Install Dependencies**

   ```bash
   bun install
   ```

4. **Start the Development Server**

   ```bash
   bun run dev
   ```

---

## Backend Setup

1. **Navigate to the Backend Directory**
   If you already cloned the repository:

   ```bash
   cd backend
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Start the Backend Server**

   ```bash
   bun run dev
   ```
4. **After you put everything to .env run this command to migrate database**

   ```bash
   npx prisma migrate dev
   ```

---

Everything should be up and running now! Make sure both frontend and backend servers are running concurrently for full functionality.

---

### important:

> #### DO NOT PUSH TO MAIN.
>
> I have provided the Git documentation on Miro and necessary infomation. Please visit and read it to avoid any issues.


---

# :electric_plug: API Documentation for `TypeToTale`

### API Overview

| **Route**                                    | **Method** | **Description**                                  | **Authentication** |
| -------------------------------------------- | ---------- | ------------------------------------------------ | ------------------ |
| `/user/api/signup`                           | `POST`     | Register a new user.                             | None               |
| `/user/api/login`                            | `POST`     | Log in a user to obtain an authentication token. | None               |
| `/user/api/token-validation`                 | `GET`      | Validate the authentication token.               | None               |
| `/user/api/secure/typing-session/:id`        | `GET`      | Retrieve a specific typing session by its ID.    | Required           |
| `/user/api/secure/typing-sessions/:userId`   | `GET`      | Retrieve all typing sessions for a user.         | Required           |
| `/user/api/secure/complete-story/:id`        | `GET`      | Retrieve a complete story by its ID.             | Required           |
| `/user/api/secure/generate-story/:userId`    | `POST`     | Generate a new story for a user.                 | Required           |
| `/user/api/secure/edit-profile/:id`          | `PUT`      | Edit user profile.                               | Required           |
| `/user/api/secure/rename-typing-session/:id` | `PUT`      | Rename an existing typing session.               | Required           |
| `/user/api/secure/typing-session/:id`        | `PUT`      | Update an existing typing session.               | Required           |
| `/user/api/secure/typing-session/:id`        | `DELETE`   | Delete a typing session by ID.                   | Required           |

---

### Public Routes

| **Route**                    | **Method** | **Description**      | 
| ---------------------------- | ---------- | -------------------- |
| `/user/api/signup`           | `POST`     | Register a new user. |
| `/user/api/login`            | `POST`     | Log in a user.       |
| `/user/api/token-validation` | `GET`      | Validate the token.  |

---

### Secure Routes (Requires Authentication)

| **Route**                                    | **Method** | **Description**                     |                                                                              
| -------------------------------------------- | ---------- | ----------------------------------- |
| `/user/api/secure/typing-session/:id`        | `GET`      | Get typing session by ID.           |
| `/user/api/secure/typing-sessions/:userId`   | `GET`      | Get all typing sessions for a user. |
| `/user/api/secure/complete-story/:id`        | `GET`      | Get a complete story by ID.         |
| `/user/api/secure/generate-story/:userId`    | `POST`     | Generate a story for a user.        |
| `/user/api/secure/edit-profile/:id`          | `PUT`      | Edit a user profile.                |
| `/user/api/secure/rename-typing-session/:id` | `PUT`      | Rename a typing session.            |
| `/user/api/secure/typing-session/:id`        | `PUT`      | Update a typing session.            |
| `/user/api/secure/typing-session/:id`        | `DELETE`   | Delete a typing session.            |

---


