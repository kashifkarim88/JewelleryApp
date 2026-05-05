import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Basic Validation
        if (!body.itemCode || !body.categoryName || !body.netWeight) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newItem = await prisma.$transaction(async (tx) => {
            return await tx.stockItem.create({
                data: {
                    itemCode: body.itemCode,
                    metal: body.metal,
                    carat: body.carat,
                    purity: body.purity ? parseFloat(body.purity) : null,
                    categoryName: body.categoryName,
                    productCode: body.productCode,
                    description: body.description,
                    workerName: body.workerName,
                    netWeight: parseFloat(body.netWeight || 0),
                    wastageGram: parseFloat(body.wastageGram || 0),
                    wastagePercent: parseFloat(body.wastagePercent || 0),
                    making: parseFloat(body.making || 0),
                    imageUrl: body.imageUrl,

                    // 2. Updated Stone Mapping (Handles Arrays)
                    stoneDetails: body.stoneData ? {
                        create: body.stoneData.map((s: any) => ({
                            name: s.name,
                            weight: parseFloat(s.weight || 0),
                            price: parseFloat(s.price || 0),
                            squantity: parseInt(s.qty || body.squantity || 0)
                        }))
                    } : undefined,

                    // 3. Bead Details (Remains single object logic)
                    beadDetails: body.beadData ? {
                        create: {
                            weight: parseFloat(body.beadData.weight || 0),
                            price: parseFloat(body.beadData.price || 0),
                        }
                    } : undefined,

                    // 4. Updated Diamond Mapping (Handles Arrays)
                    diamondDetails: body.diamondData ? {
                        create: body.diamondData.map((d: any) => ({
                            name: d.name,
                            weight: parseFloat(d.weight || 0),
                            color: d.color,
                            cut: d.cut,
                            clarity: d.clarity,
                            rate: parseFloat(d.rate || 0),
                            price: parseFloat(d.price || 0),
                            dquantity: parseInt(d.qty || body.dquantity || 0)
                        }))
                    } : undefined,
                },
            });
        });

        return NextResponse.json({ success: true, data: newItem }, { status: 201 });

    } catch (error: any) {
        console.error("Stock Entry Error:", error);

        if (error.code === 'P2002') {
            return NextResponse.json({ error: "This Item Code already exists." }, { status: 409 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const itemCode = searchParams.get("itemCode");

    if (!itemCode) {
        return NextResponse.json({ error: "Item code is required" }, { status: 400 });
    }

    const normalizedCode = itemCode.trim().toUpperCase();

    try {
        const item = await prisma.stockItem.findUnique({
            where: { itemCode: normalizedCode },
            include: {
                stoneDetails: true,
                beadDetails: true,
                diamondDetails: true,
            },
        });

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        console.log("Fetched Item:", item);
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}