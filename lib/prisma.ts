import { PrismaClient } from '@prisma/client'

// Create a function to get the PrismaClient
const prismaClientSingleton = () => {
    // Check if we're in a build environment
    const isBuild = process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL;

    if (isBuild) {
        // During build, return a mock that won't actually connect
        console.log('🛠️ Build environment detected - using mock PrismaClient');

        // Return a proxy that intercepts any method calls during build
        return new Proxy({} as PrismaClient, {
            get: (target, prop) => {
                if (prop === 'worker' || prop === '$connect' || prop === '$disconnect') {
                    return new Proxy({} as any, {
                        get: () => {
                            // During build, return a function that doesn't do anything
                            return async () => {
                                console.log(`🛠️ Build-time mock: ${String(prop)} called`);
                                return null;
                            };
                        }
                    });
                }
                return undefined;
            }
        }) as PrismaClient;
    }

    // Normal runtime - use Neon adapter
    try {
        // Dynamically import Neon dependencies only at runtime
        const { PrismaNeon } = require('@prisma/adapter-neon');
        const { Pool, neonConfig } = require('@neondatabase/serverless');
        const ws = require('ws');

        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            throw new Error('DATABASE_URL is not set');
        }

        // Setup WebSocket for Neon
        if (typeof window === 'undefined') {
            neonConfig.webSocketConstructor = ws;
        }

        const pool = new Pool({ connectionString });
        const adapter = new PrismaNeon(pool);

        return new PrismaClient({ adapter });
    } catch (error) {
        console.error('Failed to initialize database connection:', error);
        throw error;
    }
}

// Use global for hot reloading
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;