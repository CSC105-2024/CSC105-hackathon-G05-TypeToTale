import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();
process.on("beforeExit", async () => {
  await db.$disconnect();
});

export { db };
