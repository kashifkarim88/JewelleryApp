import ws from 'ws'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL

    // If the URL is missing during BUILD, we return a standard client.
    // This allows the Next.js build to finish.
    if (!connectionString) {
        return new PrismaClient()
    }

    if (typeof window === 'undefined') {
        neonConfig.webSocketConstructor = ws
    }

    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool as any)

    return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma