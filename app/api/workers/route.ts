export const runtime = 'nodejs'; // Add this line
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
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
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}