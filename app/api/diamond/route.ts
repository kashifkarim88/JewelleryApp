export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name } = body;

        // 1. Validation
        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // 2. Check for existing Diamond (using prisma.diamond, not prisma.worker)
        const existingDiamond = await prisma.diamond.findFirst({
            where: { name }
        });

        if (existingDiamond) {
            return NextResponse.json(
                { error: "Diamond with this name already exists" },
                { status: 400 }
            );
        }

        // 3. Create new diamond
        const diamond = await prisma.diamond.create({
            data: { name },
        });

        return NextResponse.json(diamond, { status: 201 });

    } catch (error: any) {
        console.error('[DIAMOND_POST_ERROR]:', error);

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Unique constraint failed: This name is already taken." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create diamond record." },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const diamonds = await prisma.diamond.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(diamonds, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=30',
            },
        });
    } catch (error) {
        console.error('[DIAMOND_GET_ERROR]:', error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}