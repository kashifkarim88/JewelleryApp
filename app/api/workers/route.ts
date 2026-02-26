export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone_number, worker_code } = body;

        // Log environment (but don't log the actual URL for security)
        console.log('Environment Check:', {
            hasDbUrl: !!process.env.DATABASE_URL,
            nodeEnv: process.env.NODE_ENV,
            urlPrefix: process.env.DATABASE_URL ?
                process.env.DATABASE_URL.substring(0, 15) + '...' : 'none'
        });

        if (!name || !phone_number || !worker_code) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if we're in a build mock situation
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({
                message: "Build mode - this is a mock response",
                data: { name, phone_number, worker_code }
            }, { status: 200 });
        }

        const worker = await prisma.worker.create({
            data: {
                name,
                phone_number,
                worker_code,
            },
        });

        return NextResponse.json(worker, { status: 201 });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}