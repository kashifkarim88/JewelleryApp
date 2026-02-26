import ws from 'ws'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'

// 1. Mandatory WebSocket setup for Neon Serverless
if (typeof window === 'undefined') {
    neonConfig.webSocketConstructor = ws
}

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
        throw new Error("❌ DATABASE_URL is missing from environment variables.")
    }

    // 2. Setup the Pool and Adapter
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool as any)

    // 3. Return the client with the adapter explicitly passed
    // This tells Prisma NOT to look for a local database
    return new PrismaClient({ adapter })
}

// 4. Singleton pattern for Next.js Fast Refresh
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma