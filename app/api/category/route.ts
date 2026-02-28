export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Destructure using the names from your frontend
        const { productname, productAbbreviation, productCode } = body;

        // 1. Validation
        if (!productname || !productAbbreviation || !productCode) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // 2. Check for duplicates in the CATEGORY model
        // Note the field names match your schema: product_name, Abbreviation, product_code
        const existingCategory = await prisma.category.findFirst({
            where: {
                OR: [
                    { product_name: productname },
                    { product_code: productCode },
                    { Abbreviation: productAbbreviation }
                ]
            }
        });

        if (existingCategory) {
            return NextResponse.json(
                { error: "Category with this name, code, or abbreviation already exists" },
                { status: 400 }
            );
        }

        // 3. Create the new Category
        const category = await prisma.category.create({
            data: {
                product_name: productname,
                Abbreviation: productAbbreviation,
                product_code: productCode,
            },
        });

        return NextResponse.json(category, { status: 201 });

    } catch (error: any) {
        console.error('❌ Database Error:', error);

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Unique constraint failed: This product details already exist." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create category. Ensure you have run 'npx prisma generate'." },
            { status: 500 }
        );
    }
}


export async function GET() {
    try {
        // 1. SELECT ONLY WHAT YOU NEED
        // Avoid 'select *' to reduce database I/O and network payload
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                product_name: true,
                Abbreviation: true,
                product_code: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc' // Newest items first
            },
            // 2. LIMIT (Optional but recommended for production)
            // take: 100, 
        });

        // 3. CACHE CONTROL HEADERS
        // Instructs the browser/CDN to not store sensitive inventory data
        return NextResponse.json(categories, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'Pragma': 'no-cache',
            },
        });

    } catch (error: any) {
        // 4. SERVER-SIDE LOGGING
        // In production, you'd use a service like Sentry or Axiom here
        console.error('❌ [CATEGORY_GET_ERROR]:', error);

        return NextResponse.json(
            { error: "Internal Server Error", details: "Could not retrieve categories." },
            { status: 500 }
        );
    }
}