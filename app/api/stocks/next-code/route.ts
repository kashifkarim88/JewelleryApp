// app/api/stocks/next-code/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const prefix = searchParams.get('prefix');

        if (!prefix) {
            return NextResponse.json({ error: "Prefix required" }, { status: 400 });
        }

        const formattedPrefix = `${prefix}-`;

        // Calculate the starting position for substring
        // Prefix length + 2 (for the hyphen and 1-based indexing)
        const startPos = prefix.length + 2;

        const result: any[] = await prisma.$queryRaw`
            SELECT MAX(CAST(SUBSTRING("itemCode" FROM CAST(${startPos} AS INTEGER)) AS INTEGER)) as max_num 
            FROM "StockItem" 
            WHERE "itemCode" LIKE ${`${formattedPrefix}%`}
        `;

        const highestNumber = result[0]?.max_num || 0;
        const nextCode = `${formattedPrefix}${highestNumber + 1}`;

        return NextResponse.json({ nextCode });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
    }
}