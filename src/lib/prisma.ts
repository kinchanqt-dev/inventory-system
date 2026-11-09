import { createMariadbAdapter } from "@/lib/create-mariadb-adapter";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSchemaVersion: string | undefined;
};

/** Bump when the Prisma schema gains/removes models so HMR drops a stale client. */
const PRISMA_SCHEMA_VERSION = "shop-settings-product-image-v1";

function createPrismaClient() {
  return new PrismaClient({ adapter: createMariadbAdapter() });
}

function getPrismaClient() {
  if (
    globalForPrisma.prisma &&
    globalForPrisma.prismaSchemaVersion === PRISMA_SCHEMA_VERSION
  ) {
    return globalForPrisma.prisma;
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
  }

  return client;
}

export const prisma = getPrismaClient();
