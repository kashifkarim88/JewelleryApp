import ws from 'ws'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
        // During build, return null or a mock
        if (process.env.NODE_ENV === 'production') {
            throw new Error('DATABASE_URL is not set')
        }
        // For development/build, return a mock or throw
        return new PrismaClient()
    }
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Ensure we don't recreate the client on every hot reload
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma