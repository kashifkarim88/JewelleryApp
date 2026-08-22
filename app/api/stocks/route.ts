// app/api/stocks/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ==========================================
// 1. POST API - Create Stock Item
// ==========================================
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Basic Validation
        if (!body.itemCode || !body.categoryName || !body.netWeight) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Support both beadData object or direct state object passed from frontend
        const beads = body.beadData || body.beads;
        const hasBeadData = beads && (
            parseFloat(beads.beadsWgt || beads.weight || 0) > 0 ||
            parseInt(beads.beadsQty || beads.quantity || 0) > 0 ||
            parseFloat(beads.beadsPrice || beads.price || 0) > 0
        );

        const newItem = await prisma.stockItem.create({
            data: {
                itemCode: body.itemCode,
                metal: body.metal,
                carat: body.carat || null,
                purity: body.purity ? parseFloat(body.purity) : null,
                categoryName: body.categoryName,
                productCode: body.productCode,
                description: body.description || null,
                workerName: body.workerName,
                netWeight: parseFloat(body.netWeight || 0),
                wastageGram: parseFloat(body.wastageGram || 0),
                wastagePercent: parseFloat(body.wastagePercent || 0),
                making: parseFloat(body.making || 0),
                imageUrl: body.imageUrl || null,

                // Stone Mapping
                stoneDetails: body.stoneData && body.stoneData.length > 0 ? {
                    create: body.stoneData.map((s: any) => ({
                        name: s.name || null,
                        weight: parseFloat(s.weight || 0),
                        price: parseFloat(s.price || 0),
                        squantity: parseInt(s.qty || body.squantity || 0)
                    }))
                } : undefined,

                // Bead Details (Includes quantity)
                beadDetails: hasBeadData ? {
                    create: {
                        weight: parseFloat(beads.beadsWgt || beads.weight || 0),
                        quantity: parseInt(beads.beadsQty || beads.quantity || 0),
                        price: parseFloat(beads.beadsPrice || beads.price || 0),
                    }
                } : undefined,

                // Diamond Mapping
                diamondDetails: body.diamondData && body.diamondData.length > 0 ? {
                    create: body.diamondData.map((d: any) => ({
                        name: d.name || null,
                        weight: parseFloat(d.weight || 0),
                        color: d.color || null,
                        cut: d.cut || null,
                        clarity: d.clarity || null,
                        rate: parseFloat(d.rate || 0),
                        price: parseFloat(d.price || 0),
                        dquantity: parseInt(d.qty || body.dquantity || 0)
                    }))
                } : undefined,
            },
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

// ==========================================
// 2. GET API - Fetch Stock Item by Code
// ==========================================
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

        return NextResponse.json(item);
    } catch (error) {
        console.error("Fetch Stock Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}