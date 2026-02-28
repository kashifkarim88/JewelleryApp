export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone_number, worker_code } = body;

        console.log('🔍 Request received:', { name, phone_number, worker_code });

        // Validation
        if (!name || !phone_number || !worker_code) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if worker with same phone or code already exists
        const existingWorker = await prisma.worker.findFirst({
            where: {
                OR: [
                    { phone_number },
                    { worker_code }
                ]
            }
        });

        if (existingWorker) {
            return NextResponse.json(
                { error: "Worker with this phone number or code already exists" },
                { status: 400 }
            );
        }

        // Create new worker
        const worker = await prisma.worker.create({
            data: {
                name,
                phone_number,
                worker_code,
            },
        });

        console.log('✅ Worker created:', worker);
        return NextResponse.json(worker, { status: 201 });

    } catch (error: any) {
        console.error('❌ Error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta
        });

        // Handle Prisma-specific errors
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "A worker with this phone number or code already exists" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create worker. Please try again." },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const workers = await prisma.worker.findMany({
            // 1. Fetch only the fields used by the UI to reduce payload size
            select: {
                id: true,
                name: true,
                worker_code: true,
            },
            // 2. Consistent sorting for a predictable UI
            orderBy: {
                name: 'asc',
            },
        });

        // 3. Response with Performance Headers
        return NextResponse.json(workers, {
            status: 200,
            headers: {
                // Cache for 5 seconds, allowing background refresh (SWR)
                'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=30',
            },
        });

    } catch (error) {
        // 4. Server-side logging for debugging
        console.error('[WORKER_GET_ERROR]:', error);

        // 5. Clean error response
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}