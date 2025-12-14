import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

type PrismaClientInit =
  | (ConstructorParameters<typeof PrismaClient>[0] & {
      engine?: { type: string };
      accelerateUrl?: string;
    })
  | undefined;

const prismaOptions: PrismaClientInit = {
  log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
};

if (process.env.PRISMA_ACCELERATE_URL) {
  prismaOptions.accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
} else {
  prismaOptions.engine = { type: "binary" };
}

if (process.env.NODE_ENV === "development") {
  console.info(
    `[prisma] using engine: ${
      process.env.PRISMA_ACCELERATE_URL ? "accelerate" : "binary (local)"
    }`
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    prismaOptions as unknown as ConstructorParameters<typeof PrismaClient>[0]
  );

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
