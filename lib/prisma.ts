import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

// In dev, Next.js hot-reloads modules on every save, which would otherwise
// spin up a brand new PrismaClient (and a new connection pool) each time.
// Stashing the instance on `globalThis` keeps one client alive across reloads.
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}