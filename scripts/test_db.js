// scripts/test-db.js
const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: '.env' })

async function testConnection() {
    console.log('Testing database connection...')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 30) + '...')

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is not set!')
        process.exit(1)
    }

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    })

    try {
        console.log('Attempting to connect...')
        // Try a simple query
        const result = await prisma.$queryRaw`SELECT 1 as connected`
        console.log('✅ Successfully connected to database!', result)

        // Check if Worker table exists
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
        console.log('📊 Tables in database:', tables)

    } catch (error) {
        console.error('❌ Connection failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testConnection()