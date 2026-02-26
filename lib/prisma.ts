import ws from 'ws'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'

const prismaClientSingleton = () => {
    // 1. Get the URL
    const connectionString = process.env.DATABASE_URL

    // 2. If no URL (during build), create a mock connection for build purposes
    if (!connectionString) {
        console.warn('DATABASE_URL not found, using mock PrismaClient for build')
        // Create a minimal PrismaClient that won't actually connect
        // This allows the build to complete
        return new PrismaClient({
            datasources: {
                db: {
                    url: 'postgresql://dummy:dummy@localhost:5432/dummy'
                }
            }
        })
    }

    // 3. Setup WebSocket for Neon (Server-only)
    if (typeof window === 'undefined') {
        neonConfig.webSocketConstructor = ws
    }

    // 4. Create the connection
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool as any)

    // 5. Return the actual client with adapter
    return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Ensure we don't recreate the client on every hot reload
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma