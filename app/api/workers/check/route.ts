export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const lastWorker = await prisma.worker.findFirst({
            orderBy: {
                worker_code: 'desc',
            },
            select: {
                worker_code: true,
            },
        });

        if (!lastWorker) {
            return NextResponse.json({ nextCode: "WK-1" });
        }

        const currentCode = lastWorker.worker_code; // e.g., "WK-9"

        // RegEx breakdown:
        // prefix: everything before the hyphen
        // numberPart: everything after the hyphen
        const [prefix, numberPart] = currentCode.split('-');

        const nextNumber = parseInt(numberPart) + 1;

        return NextResponse.json({
            nextCode: `${prefix}-${nextNumber}`
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
    }
}