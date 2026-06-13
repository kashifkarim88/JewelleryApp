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

        // 2. Check for existing Stone (using prisma.stone, not prisma.worker)
        const existingStone = await prisma.stone.findFirst({
            where: { name }
        });

        if (existingStone) {
            return NextResponse.json(
                { error: "Stone with this name already exists" },
                { status: 400 }
            );
        }

        // 3. Create new stone
        const stone = await prisma.stone.create({
            data: { name },
        });

        return NextResponse.json(stone, { status: 201 });

    } catch (error: any) {
        console.error('[STONE_POST_ERROR]:', error);

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Unique constraint failed: This name is already taken." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create stone record." },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const stones = await prisma.stone.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(stones, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=30',
            },
        });
    } catch (error) {
        console.error('[STONE_GET_ERROR]:', error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}