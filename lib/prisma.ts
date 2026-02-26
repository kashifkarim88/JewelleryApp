import ws from 'ws'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'

const prismaClientSingleton = () => {
    // 1. Get the URL
    const connectionString = process.env.DATABASE_URL

    // 2. If no URL (Building), return a plain client so Next.js doesn't crash
    if (!connectionString) {
        return new PrismaClient()
    }

    // 3. Setup WebSocket for Neon (Server-only)
    if (typeof window === 'undefined') {
        neonConfig.webSocketConstructor = ws
    }

    // 4. Create the connection
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool as any)

    // 5. IMPORTANT: You MUST pass the adapter here
    return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Ensure we don't recreate the client on every hot reload
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma