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

        // 2. Transaction for atomic consistency
        const newItem = await prisma.$transaction(async (tx) => {
            return await tx.stockItem.create({
                data: {
                    itemCode: body.itemCode,
                    metal: body.metal,
                    carat: body.carat,
                    purity: body.purity ? parseFloat(body.purity) : null, // Added Purity handling
                    categoryName: body.categoryName,
                    productCode: body.productCode,
                    description: body.description,
                    workerName: body.workerName,
                    netWeight: parseFloat(body.netWeight),
                    wastageGram: parseFloat(body.wastageGram || 0),
                    wastagePercent: parseFloat(body.wastagePercent || 0),
                    making: parseFloat(body.making || 0),
                    imageUrl: body.imageUrl,

                    // Mapped to your schema: stoneDetails
                    stoneDetails: body.stoneData?.name ? {
                        create: {
                            name: body.stoneData.name,
                            weight: parseFloat(body.stoneData.weight || 0),
                            price: parseFloat(body.stoneData.price || 0),
                        }
                    } : undefined,

                    // Mapped to your schema: beadDetails
                    beadDetails: body.beadData?.weight ? {
                        create: {
                            weight: parseFloat(body.beadData.weight || 0),
                            price: parseFloat(body.beadData.price || 0),
                        }
                    } : undefined,

                    // Mapped to your schema: diamondDetails
                    diamondDetails: body.diamondData?.name ? {
                        create: {
                            name: body.diamondData.name,
                            weight: parseFloat(body.diamondData.weight || 0),
                            color: body.diamondData.color,
                            cut: body.diamondData.cut,
                            clarity: body.diamondData.clarity,
                            rate: parseFloat(body.diamondData.rate || 0),
                            price: parseFloat(body.diamondData.price || 0),
                        }
                    } : undefined,
                },
                include: {
                    stoneDetails: true,
                    beadDetails: true,
                    diamondDetails: true,
                }
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

    try {
        const item = await prisma.stockItem.findUnique({
            where: { itemCode: itemCode },
            include: {
                stoneDetails: true,
                beadDetails: true,
                diamondDetails: true,
            },
        });

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}