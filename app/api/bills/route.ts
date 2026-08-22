import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path if needed
import { randomUUID } from "node:crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            billSerialNumber,
            customer,
            cart,
            discount = 0,
            extraDiscount = 0,
            exchangeValue = 0,
            advance = 0,
            finalTotal = 0,
        } = body;

        // 1. Validation
        if (!billSerialNumber) {
            return NextResponse.json(
                { error: "Bill serial number is required." },
                { status: 400 }
            );
        }

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json(
                { error: "Cannot create an invoice with an empty cart." },
                { status: 400 }
            );
        }

        // 2. Perform DB operations inside a transaction
        const createdBill = await prisma.$transaction(async (tx) => {
            // Optional: Ensure customer exists or link customer if you have a Customer relation
            // e.g., customerId = customer?.id

            // Create the main Bill record along with nested BillItems
            const bill = await tx.bill.create({
                data: {
                    billSerialNumber,
                    discount: Number(discount) || 0,
                    extraDiscount: Number(extraDiscount) || 0,
                    exchangeValue: Number(exchangeValue) || 0,
                    advance: Number(advance) || 0,
                    finalTotal: Number(finalTotal) || 0,
                    customerName: customer?.name || "Walk-in Customer",
                    customerPhone: customer?.phone || null,
                    createdAt: new Date(),

                    // Nested creation of BillItems
                    items: {
                        create: cart.map((item: any) => {
                            const billItemId = item.id && item.id.length > 20 ? item.id : crypto.randomUUID();

                            return {
                                id: billItemId,
                                productCode: item.productCode || null,
                                itemCode: item.itemCode || null,
                                categoryName: item.categoryName || null,
                                description: item.description || null,
                                metal: item.metal || null,
                                carat: item.carat || null,
                                purity: item.purity || null,
                                netWeight: item.netWeight ? Number(item.netWeight) : null,
                                wastagePercent: item.wastagePercent ? Number(item.wastagePercent) : null,
                                wastageGram: item.wastageGram ? Number(item.wastageGram) : null,
                                makingCharges: item.making ? Number(item.making) : 0,
                                stonesTotal: item.stonesTotal ? Number(item.stonesTotal) : 0,
                                itemTotal: Number(item.itemTotal) || 0,
                                workerName: item.workerName || null,
                                imageUrl: item.imageUrl || null,
                                advance: item.advance ? Number(item.advance) : 0,
                                createdAt: new Date(),

                                // Nested Stone details
                                ...(item.stoneDetails && item.stoneDetails.length > 0 && {
                                    stoneDetails: {
                                        create: item.stoneDetails.map((stone: any) => ({
                                            id: crypto.randomUUID(),
                                            name: stone.name || null,
                                            weight: stone.weight ? Number(stone.weight) : null,
                                            quantity: stone.quantity ? Number(stone.quantity) : null,
                                            price: stone.price ? Number(stone.price) : null,
                                        })),
                                    },
                                }),

                                // Nested Diamond details
                                ...(item.diamondDetails && item.diamondDetails.length > 0 && {
                                    diamondDetails: {
                                        create: item.diamondDetails.map((diamond: any) => ({
                                            id: crypto.randomUUID(),
                                            name: diamond.name || null,
                                            clarity: diamond.clarity || null,
                                            color: diamond.color || null,
                                            cut: diamond.cut || null,
                                            weight: diamond.weight ? Number(diamond.weight) : null,
                                            quantity: diamond.quantity ? Number(diamond.quantity) : null,
                                            rate: diamond.rate ? Number(diamond.rate) : null,
                                            price: diamond.price ? Number(diamond.price) : null,
                                        })),
                                    },
                                }),

                                // Nested Bead detail (1:1 relation)
                                ...(item.beadDetails && (item.beadDetails.weight || item.beadDetails.price) && {
                                    beadDetails: {
                                        create: {
                                            id: crypto.randomUUID(),
                                            weight: item.beadDetails.weight ? Number(item.beadDetails.weight) : null,
                                            price: item.beadDetails.price ? Number(item.beadDetails.price) : null,
                                        },
                                    },
                                }),
                            };
                        }),
                    },
                },
                include: {
                    items: {
                        include: {
                            stoneDetails: true,
                            diamondDetails: true,
                            beadDetails: true,
                        },
                    },
                },
            });

            return bill;
        });

        return NextResponse.json({ success: true, data: createdBill }, { status: 201 });
    } catch (error: any) {
        console.error("[POST_BILL_ERROR]:", error);
        return NextResponse.json(
            { error: "Failed to save invoice.", details: error.message },
            { status: 500 }
        );
    }
}