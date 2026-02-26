import { defineConfig } from "@prisma/config";

// This prevents the "Missing required environment variable" error during Vercel build
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: DATABASE_URL,
  },
});