import bcrypt = require("bcryptjs");

const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePassword = async (
  enteredPassword: string,
  storedHashedPassword: string,
) => {
  return await bcrypt.compare(enteredPassword, storedHashedPassword);
};

export { hashPassword, comparePassword };
