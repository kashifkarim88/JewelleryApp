export const dynamic = 'force-dynamic'; // Add this line
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
        console.log('DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 20) + '...');
        const body = await req.json();
        const { name, phone_number, worker_code } = body;
        console.log('Env Check:', !!process.env.DATABASE_URL);

        if (!name || !phone_number || !worker_code) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
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
        console.error('Full error:', error);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}