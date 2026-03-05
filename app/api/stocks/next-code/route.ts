import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        /**
         * SQL Logic Breakdown:
         * 1. SUBSTRING(itemCode FROM 4): Removes 'IC-' (starts at 4th char).
         * 2. CAST(... AS INTEGER): Converts the remaining string to a number.
         * 3. MAX(...): Finds the mathematically highest number in the table.
         */
        const result: any[] = await prisma.$queryRaw`
            SELECT MAX(CAST(SUBSTRING("itemCode" FROM 4) AS INTEGER)) as max_num 
            FROM "StockItem" 
            WHERE "itemCode" LIKE 'IC-%'
        `;

        // result will look like: [{ max_num: 15 }] or [{ max_num: null }]
        const highestNumber = result[0]?.max_num || 0;

        // Increment for the next entry
        const nextCode = `IC-${highestNumber + 1}`;

        return NextResponse.json({ nextCode });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { error: "Failed to generate next code" },
            { status: 500 }
        );
    }
}