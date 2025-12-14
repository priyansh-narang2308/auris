import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  const msg =
    "Missing required environment variable DATABASE_URL.\n" +
    "Add a `DATABASE_URL` to your `.env.local` (or set it in your environment).\n" +
    "Example (Postgres): postgres://USER:PASSWORD@HOST:PORT/DATABASE";
  if (process.env.NODE_ENV === "production") {
    throw new Error(msg);
  } else {
    console.warn(msg);
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
