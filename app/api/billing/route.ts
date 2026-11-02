import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

/*
 * Convert a value coming from the frontend into a Prisma Decimal.
 * Empty/null/undefined values are returned as null.
 */
function toDecimalOrNull(value: unknown): Prisma.Decimal | null {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    return new Prisma.Decimal(String(value));
}

/*
 * Values which are required to be Decimal in the database.
 */
function toDecimal(value: unknown, defaultValue = 0): Prisma.Decimal {
    if (value === null || value === undefined || value === "") {
        return new Prisma.Decimal(defaultValue);
    }

    return new Prisma.Decimal(String(value));
}

/*
 * Convert a value to a JavaScript number.
 * Used for Float fields such as purity.
 */
function toFloatOrNull(value: unknown): number | null {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
        return null;
    }

    return numberValue;
}

/*
 * Convert a value to an integer or null.
 */
function toIntOrNull(value: unknown): number | null {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
        return null;
    }

    return Math.trunc(numberValue);
}

export async function POST(request: Request) {
    let printOperationId: unknown;

    try {
        const body = await request.json();

        const {
            billSerialNumber,
            customer,
            sellerName,
            discount,
            extraDiscount,
            exchangeValue,
            advancePaid,
            finalTotal,
            items,
        } = body;

        printOperationId = body.printOperationId;

        // ------------------------------------------
        // Basic validation
        // ------------------------------------------

        if (!printOperationId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "printOperationId is required.",
                },
                { status: 400 }
            );
        }

        if (!billSerialNumber) {
            return NextResponse.json(
                {
                    success: false,
                    error: "billSerialNumber is required.",
                },
                { status: 400 }
            );
        }

        if (!customer) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Customer information is required.",
                },
                { status: 400 }
            );
        }

        if (!customer.name || !customer.phone) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Customer name and phone are required.",
                },
                { status: 400 }
            );
        }

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "At least one bill item is required.",
                },
                { status: 400 }
            );
        }

        // ------------------------------------------
        // Prepare all item data BEFORE transaction
        //
        // This is intentionally outside the transaction
        // so the transaction stays as short as possible.
        // ------------------------------------------

        const billItems = items.map((item: any) => ({
            productCode:
                item.productCode === null ||
                    item.productCode === undefined
                    ? null
                    : String(item.productCode),

            itemCode:
                item.itemCode === null ||
                    item.itemCode === undefined
                    ? null
                    : String(item.itemCode),

            categoryName:
                item.categoryName === null ||
                    item.categoryName === undefined
                    ? null
                    : String(item.categoryName),

            description:
                item.description === null ||
                    item.description === undefined
                    ? null
                    : String(item.description),

            metal:
                item.metal === null ||
                    item.metal === undefined
                    ? null
                    : String(item.metal),

            carat:
                item.carat === null ||
                    item.carat === undefined
                    ? null
                    : String(item.carat),

            purity: toFloatOrNull(item.purity),

            netWeight: toDecimalOrNull(item.netWeight),

            wastagePercent: toDecimalOrNull(item.wastagePercent),

            wastageGram: toDecimalOrNull(item.wastageGram),

            making: toDecimalOrNull(item.making),

            stonesTotal: toDecimalOrNull(item.stonesTotal),

            itemTotal: toDecimal(item.itemTotal),

            workerName:
                item.workerName === null ||
                    item.workerName === undefined
                    ? null
                    : String(item.workerName),

            imageUrl:
                item.imageUrl === null ||
                    item.imageUrl === undefined
                    ? null
                    : String(item.imageUrl),

            advance: toDecimal(item.advance),

            // --------------------------------
            // Stones
            // --------------------------------

            stoneDetails: {
                create: Array.isArray(item.stoneDetails)
                    ? item.stoneDetails.map((stone: any) => ({
                        name:
                            stone.name === null ||
                                stone.name === undefined
                                ? null
                                : String(stone.name),

                        weight: toDecimalOrNull(stone.weight),

                        quantity: toIntOrNull(
                            stone.quantity ?? stone.squantity
                        ),

                        price: toDecimalOrNull(stone.price),
                    }))
                    : [],
            },

            // --------------------------------
            // Diamonds
            // --------------------------------

            diamondDetails: {
                create: Array.isArray(item.diamondDetails)
                    ? item.diamondDetails.map((diamond: any) => ({
                        name:
                            diamond.name === null ||
                                diamond.name === undefined
                                ? null
                                : String(diamond.name),

                        clarity:
                            diamond.clarity === null ||
                                diamond.clarity === undefined
                                ? null
                                : String(diamond.clarity),

                        color:
                            diamond.color === null ||
                                diamond.color === undefined
                                ? null
                                : String(diamond.color),

                        cut:
                            diamond.cut === null ||
                                diamond.cut === undefined
                                ? null
                                : String(diamond.cut),

                        weight: toDecimalOrNull(diamond.weight),

                        quantity: toIntOrNull(
                            diamond.quantity ?? diamond.dquantity
                        ),

                        rate: toDecimalOrNull(diamond.rate),

                        price: toDecimalOrNull(diamond.price),
                    }))
                    : [],
            },

            // --------------------------------
            // Beads
            // --------------------------------

            ...(item.beadDetails
                ? {
                    beadDetails: {
                        create: {
                            weight: toDecimalOrNull(
                                item.beadDetails.weight
                            ),

                            quantity: toIntOrNull(
                                item.beadDetails.quantity
                            ),

                            price: toDecimalOrNull(
                                item.beadDetails.price
                            ),
                        },
                    },
                }
                : {}),
        }));

        // ------------------------------------------
        // Save everything in ONE short transaction.
        // ------------------------------------------

        const result = await prisma.$transaction(
            async (tx) => {
                // ----------------------------------------
                // 1. Find or create customer
                // ----------------------------------------

                const savedCustomer = await tx.customer.upsert({
                    where: {
                        phone: String(customer.phone),
                    },

                    update: {
                        name: String(customer.name),
                    },

                    create: {
                        name: String(customer.name),
                        phone: String(customer.phone),
                    },

                    select: {
                        id: true,
                    },
                });

                // ----------------------------------------
                // 2. Create Bill
                // ----------------------------------------

                const bill = await tx.bill.create({
                    data: {
                        billSerialNumber: String(billSerialNumber),

                        printOperationId: String(printOperationId),

                        customerId: savedCustomer.id,

                        sellerName:
                            sellerName === null ||
                                sellerName === undefined
                                ? null
                                : String(sellerName),

                        discount: toDecimal(discount),

                        extraDiscount: toDecimal(extraDiscount),

                        exchangeValue: toDecimal(exchangeValue),

                        advancePaid: toDecimal(advancePaid),

                        finalTotal: toDecimal(finalTotal),

                        // ------------------------------------
                        // Create all BillItems
                        // ------------------------------------

                        items: {
                            create: billItems,
                        },
                    },

                    // Only return what the API actually needs.
                    select: {
                        billSerialNumber: true,
                        customerId: true,
                    },
                });

                return bill;
            },

            {
                // Safety net for slower database connections.
                // The main optimization is keeping the transaction short.
                timeout: 15000,
            }
        );

        // ------------------------------------------
        // Success
        // ------------------------------------------

        return NextResponse.json(
            {
                success: true,
                alreadySaved: false,
                message: "Billing information saved successfully.",
                billSerialNumber: result.billSerialNumber,
                customerId: result.customerId,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Billing API Error:", error);

        /*
         * Prisma unique constraint.
         *
         * If two requests arrive at almost the same time
         * with the same printOperationId, the database
         * rejects the second one.
         *
         * We then check whether the bill already exists.
         */

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002" && printOperationId) {
                const existingBill = await prisma.bill.findUnique({
                    where: {
                        printOperationId: String(printOperationId),
                    },

                    select: {
                        billSerialNumber: true,
                    },
                });

                if (existingBill) {
                    return NextResponse.json({
                        success: true,
                        alreadySaved: true,
                        message:
                            "This print operation has already been saved.",
                        billSerialNumber:
                            existingBill.billSerialNumber,
                    });
                }
            }
        }

        return NextResponse.json(
            {
                success: false,
                error:
                    error?.message ||
                    "An unexpected error occurred while saving the bill.",
            },
            { status: 500 }
        );
    }
}