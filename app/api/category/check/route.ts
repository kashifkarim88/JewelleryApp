import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const abbr = searchParams.get("abbr")?.trim().toUpperCase();

        if (!abbr) return NextResponse.json({ exists: false });

        // 1. Check if the abbreviation already exists
        const existing = await prisma.category.findFirst({
            where: {
                Abbreviation: {
                    equals: abbr,
                }
            },
            select: { id: true }
        });

        // 2. If it exists, tell the frontend it's taken
        if (existing) {
            return NextResponse.json({ exists: true });
        }

        // 3. If it DOES NOT exist, calculate the next code
        // Count total categories to determine the next number
        const count = await prisma.category.count();
        const nextNumber = count + 1;
        const suggestedCode = `${abbr}-${nextNumber}`;

        return NextResponse.json({
            exists: false,
            suggestedCode: suggestedCode
        });

    } catch (error: any) {
        console.error("❌ DB CHECK ERROR:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}