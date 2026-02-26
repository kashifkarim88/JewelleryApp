import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
        // This will help you debug if the env variable is missing on Vercel
        console.error('❌ DATABASE_URL is not set in environment variables')
        throw new Error('DATABASE_URL is not set')
    }

    return new PrismaClient({
        datasources: {
            db: {
                url: connectionString,
            },
        },
    })
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma