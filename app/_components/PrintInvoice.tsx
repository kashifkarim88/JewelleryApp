"use client";

import React, { useEffect, useMemo } from 'react';
import { useGoldStore } from '../hooks/useGoldStore';
import { Image as ImageIcon } from 'lucide-react';

interface ClientProfile {
    name: string;
    phone: string;
    seller?: string;
}

interface DetailItem {
    weight?: string | number;
    name?: string;
    price?: string | number;
}

export interface CartItem {
    id: string;
    itemCode: string;
    productCode?: string;
    categoryName: string;
    carat: string;
    purity?: string | number;
    metal: string;
    netWeight: number;
    wastagePercent: number;
    making: number;
    discount?: number;
    advance?: number;
    diamondDetails?: DetailItem[] | null;
    stoneDetails?: DetailItem[] | null;
    beadDetails?: DetailItem | DetailItem[] | null;
    peritemTotal?: number;
    itemTotal?: string | number;
    stonesTotal?: string | number;
    stonePrice?: string | number;
    wastageGram?: string | number;
    imageUrl?: string;
}

interface ProcessedCartItem extends CartItem {
    netW: number;
    wasteW: number;
    grossMetalWeight: number;
    stonePrice: number;
    absoluteMetalPrice: number;
    structuralAccentsWeight: number;
}

interface PrintInvoiceProps {
    customer: ClientProfile;
    cart: CartItem[];
    discount: number;
    exchangeValue: number;
    advance: number;
    finalTotal: number;
}

export const PrintInvoice = ({
    customer,
    cart,
    exchangeValue,
    advance,
    finalTotal,
    discount,
}: PrintInvoiceProps) => {
    const {
        rate21ct, rate24ct, rate22ct, rate20ct, rate18ct, rate14ct,
        ratePalladium, rateSilver, ratePlatinum
    } = useGoldStore();

    const rateLookup = useMemo((): Record<string, number> => ({
        '24k': Number(rate24ct) || 0, '24ct': Number(rate24ct) || 0,
        '22k': Number(rate22ct) || 0, '22ct': Number(rate22ct) || 0,
        '21k': Number(rate21ct) || 0, '21ct': Number(rate21ct) || 0,
        '20k': Number(rate20ct) || 0, '20ct': Number(rate20ct) || 0,
        '18k': Number(rate18ct) || 0, '18ct': Number(rate18ct) || 0,
        '14k': Number(rate14ct) || 0, '14ct': Number(rate14ct) || 0,
        'palladium': Number(ratePalladium) || 0,
        'silver': Number(rateSilver) || 0,
        'platinum': Number(ratePlatinum) || 0
    }), [
        rate21ct,
        rate24ct,
        rate22ct,
        rate20ct,
        rate18ct,
        rate14ct,
        ratePalladium,
        rateSilver,
        ratePlatinum
    ]);

    const getItemRate = (item: CartItem): number => {
        const caratKey = item.carat
            ? String(item.carat).toLowerCase().trim()
            : '';

        const metalKey = item.metal
            ? String(item.metal).toLowerCase().trim()
            : '';

        if (
            ['palladium', 'silver', 'platinum'].includes(metalKey) ||
            ['palladium', 'silver', 'platinum'].includes(caratKey)
        ) {
            if (metalKey === 'palladium' || caratKey === 'palladium') {
                return Number(ratePalladium) || 0;
            }

            if (metalKey === 'silver' || caratKey === 'silver') {
                return Number(rateSilver) || 0;
            }

            if (metalKey === 'platinum' || caratKey === 'platinum') {
                return Number(ratePlatinum) || 0;
            }
        }

        if (rateLookup[caratKey]) {
            return rateLookup[caratKey];
        }

        if (metalKey === 'gold') {
            if (caratKey.includes('21')) {
                return Number(rate21ct) || 0;
            }

            if (caratKey.includes('22')) {
                return Number(rate22ct) || 0;
            }

            if (caratKey.includes('24')) {
                return Number(rate24ct) || 0;
            }

            if (caratKey.includes('18')) {
                return Number(rate18ct) || 0;
            }
        }

        return rateLookup[metalKey] || 0;
    };

    const sumDetailsWeight = (
        details: DetailItem | DetailItem[] | undefined | null
    ): number => {
        if (!details) return 0;

        if (Array.isArray(details)) {
            return details.reduce(
                (acc, current) => acc + (Number(current?.weight) || 0),
                0
            );
        }

        return Number((details as DetailItem).weight) || 0;
    };

    const uniqueRatesToShow = useMemo(() => {
        return cart.filter(
            (item, index, self) =>
                index ===
                self.findIndex(
                    (t) => (t.carat || t.metal) === (item.carat || item.metal)
                )
        );
    }, [cart]);

    const processedCartItems = useMemo((): ProcessedCartItem[] => {
        return cart.map((item) => {
            const netW = Number(item.netWeight) || 0;

            const wasteW = item.wastageGram
                ? Number(item.wastageGram)
                : (netW * (Number(item.wastagePercent) || 0)) / 100;

            const grossMetalWeight = netW + wasteW;

            const stonePrice =
                Number(item.stonesTotal || item.stonePrice) || 0;

            const absoluteMetalPrice =
                (Number(item.peritemTotal || item.itemTotal) || 0) -
                stonePrice;

            const structuralAccentsWeight =
                sumDetailsWeight(item.diamondDetails) +
                sumDetailsWeight(item.stoneDetails) +
                sumDetailsWeight(item.beadDetails);

            return {
                ...item,
                netW,
                wasteW,
                grossMetalWeight,
                stonePrice,
                absoluteMetalPrice,
                structuralAccentsWeight,
            };
        });
    }, [cart]);

    const cartPages = useMemo((): ProcessedCartItem[][] => {
        const chunks: ProcessedCartItem[][] = [];

        // Exactly two items per printed page.
        for (let i = 0; i < processedCartItems.length; i += 2) {
            chunks.push(processedCartItems.slice(i, i + 2));
        }

        return chunks;
    }, [processedCartItems]);

    /*
     * PAGE-BY-PAGE FINANCIAL ALLOCATION
     *
     * The invoice-level advance and discount are treated as balances
     * that are consumed from page 1 onward.
     *
     * Example:
     *   Invoice Advance = 9,891,653
     *   Page 1 Total    = 5,415,315.49
     *
     * Page 1 uses 5,415,315.49 advance and leaves:
     *   4,476,337.51
     *
     * The remaining advance is then available to page 2.
     *
     * Discount follows the same carry-forward logic, but it is applied
     * only after the page's advance has been consumed.
     *
     * This also prevents negative Net Balance values.
     *
     * IMPORTANT:
     * `advance` and `discount` are the invoice-level totals.
     * We intentionally do NOT add `item.advance` or `item.discount`
     * here, because doing so can double-count them.
     */
    const pageFinancialSummaries = useMemo(() => {
        let remainingAdvance = Math.max(Number(advance) || 0, 0);
        let remainingDiscount = Math.max(Number(discount) || 0, 0);

        return cartPages.map((pageItems) => {
            const pageTotalAmount = pageItems.reduce(
                (sum, item) =>
                    sum +
                    (Number(item.peritemTotal || item.itemTotal) || 0),
                0
            );

            // Consume available advance against this page first.
            const pageAdvance = Math.min(
                remainingAdvance,
                pageTotalAmount
            );

            remainingAdvance -= pageAdvance;

            // Never allow the amount after advance to become negative.
            const amountAfterAdvance = Math.max(
                pageTotalAmount - pageAdvance,
                0
            );

            // Consume discount only from the amount still remaining
            // after advance has been applied.
            const pageDiscount = Math.min(
                remainingDiscount,
                amountAfterAdvance
            );

            remainingDiscount -= pageDiscount;

            // Never display a negative balance.
            const pageNetBalance = Math.floor(
                Math.max(
                    amountAfterAdvance - pageDiscount,
                    0
                )
            );

            return {
                pageTotalAmount,
                pageAdvance,
                pageDiscount,
                pageNetBalance,
                remainingAdvance,
                remainingDiscount,
            };
        });
    }, [cartPages, advance, discount]);

    useEffect(() => {
        console.log(
            "=================== PRINT INVOICE INCOMING DATA DETECTOR ==================="
        );

        console.log(
            "Customer Profile Metadata object:",
            customer
        );

        console.log(
            "Active Target Items Collection Matrix Array (cart):",
            cart
        );

        console.log(
            "Combined Deductions Applied (discount):",
            discount
        );

        console.log(
            "Trade-In Valuations Asset Balance (exchangeValue):",
            exchangeValue
        );

        console.log(
            "Upfront Client Deposits Tracked (advance):",
            advance
        );

        console.log(
            "Net Final Due Invoice Total (finalTotal):",
            finalTotal
        );

        console.log(
            "============================================================================"
        );
    }, [
        customer,
        cart,
        discount,
        exchangeValue,
        advance,
        finalTotal
    ]);

    const formattedDate = useMemo(() => {
        return new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value || 0);
    };

    return (
        <div className="hidden print:block print:bg-white print:text-black">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
            @media print { 
              @page { 
                size: 20.1cm 26.4cm; 
                margin: 0mm; 
              } 
              
              body { 
                visibility: hidden; 
                background: white; 
                margin: 0;
                padding: 0;
              } 
              
              .print-container { 
                visibility: visible; 
                position: absolute;
                left: 10mm;
                top: 0;
                width: 181mm;
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              } 
              
              .print-page {
                page-break-after: always;
                break-after: page;
                position: relative;
                width: 100%;
                box-sizing: border-box;
                padding-top: 5.3cm; 
              }
              
              tr { 
                page-break-inside: avoid !important; 
                break-inside: avoid !important; 
              }
            }
          `,
                }}
            />

            <div className="print-container font-sans text-[9.5px] text-zinc-800 leading-tight antialiased select-none">

                <div className="relative z-10 w-full flex flex-col pb-[10mm]">

                    {/* --- CART ITEMS PAGE ENGINE --- */}
                    {cartPages.map((pageItems, pageIdx) => {
                        // Each printed page contains exactly two items (or one on the final page).
                        // Financial totals below are calculated only from this page's items.

                        return (
                            <div
                                key={pageIdx}
                                className="print-page flex flex-col space-y-2 w-full min-h-0"
                            >

                                {/* --- HEADER BLOCK (RENDERED ON EVERY PAGE) --- */}
                                <>
                                    <div className="flex justify-between items-start w-full">

                                        <div className="flex flex-col">

                                            <h1 className="text-xl font-extrabold tracking-tight text-zinc-900">
                                                Sale Invoice
                                            </h1>

                                            <div className="mt-0.5 flex flex-col items-start">

                                                <div
                                                    className="h-6 w-32 bg-zinc-900 border border-zinc-950 flex items-baseline justify-between px-1.5 pt-0.5 overflow-hidden"
                                                    style={{
                                                        backgroundImage:
                                                            "repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 7px, #fff 7px, #fff 8px)",
                                                    }}
                                                ></div>

                                                <span className="text-[7.5px] font-mono tracking-[0.3em] text-zinc-700 mt-0.5 pl-2">
                                                    * 0 2 0 0 0 0 6 3 2 8 *
                                                </span>

                                            </div>

                                        </div>

                                        <div className="text-right pt-0.5">
                                            <p className="text-[10px] font-medium">
                                                <span className="font-bold text-zinc-900">
                                                    Date:
                                                </span>{" "}
                                                {formattedDate}
                                            </p>
                                        </div>

                                    </div>

                                    {/* --- DETAILS OVERVIEW CONTROLLERS --- */}
                                    <div className="w-full flex items-stretch justify-between gap-2.5">

                                        <div className="w-[62mm] border border-zinc-800 rounded-sm overflow-hidden bg-white shadow-sm flex flex-col">

                                            <div className="bg-zinc-200/80 px-1.5 py-0.5 border-b border-zinc-800">
                                                <p className="font-extrabold text-zinc-900 text-[8px] uppercase tracking-wider">
                                                    Bill To
                                                </p>
                                            </div>

                                            <div className="p-1 space-y-0.5 text-zinc-900 font-medium flex-1 justify-center flex flex-col">

                                                <p className="font-black text-[10px] tracking-tight text-zinc-950 leading-tight">
                                                    {customer?.name || "Walk-in Customer"}
                                                </p>

                                                <p className="text-[8.5px]">
                                                    Contact #: {customer?.phone || "N/A"}
                                                </p>

                                                <p className="text-[8.5px]">
                                                    Seller:{" "}
                                                    <span className="font-semibold">
                                                        {customer?.seller || "N/A"}
                                                    </span>
                                                </p>

                                                <p className="text-[8.5px] text-zinc-500">
                                                    Pakistan
                                                </p>

                                            </div>

                                        </div>

                                        <div className="w-[85mm] border border-zinc-800 rounded-sm overflow-hidden bg-white shadow-sm flex flex-col">

                                            <div className="bg-zinc-200/80 px-1.5 py-0.5 border-b border-zinc-800 flex justify-between items-center">

                                                <p className="font-extrabold text-zinc-900 text-[8px] uppercase tracking-wider">
                                                    Live Invoice Metal Rates Lookup
                                                </p>

                                                <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>

                                            </div>

                                            <div className="p-1 flex-1 flex flex-col justify-center space-y-0.5">

                                                {pageItems
                                                    .filter(
                                                        (item, index, self) =>
                                                            index ===
                                                            self.findIndex(
                                                                (t) =>
                                                                    (t.carat || t.metal) ===
                                                                    (item.carat || item.metal)
                                                            )
                                                    )
                                                    .map((item, idx) => {

                                                        const computedRate =
                                                            getItemRate(item);

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center justify-between border-b border-zinc-100 pb-0.5 last:border-0 last:pb-0 w-full"
                                                            >

                                                                <div className="flex items-baseline space-x-1 w-[30mm]">

                                                                    <span className="font-bold text-zinc-900 text-[8.5px] tracking-tight">
                                                                        {item.carat ||
                                                                            item.metal ||
                                                                            "Item"}
                                                                    </span>

                                                                    <span className="text-[7.5px] font-medium text-zinc-400 lowercase tracking-tight">
                                                                        ({item.metal || "Gold"})
                                                                    </span>

                                                                </div>

                                                                <div className="flex-1 text-right">

                                                                    <span className="text-[8.5px] font-bold text-zinc-700 font-mono tracking-tight">
                                                                        {computedRate > 0
                                                                            ? `Rs ${formatCurrency(computedRate)}`
                                                                            : "—"}
                                                                    </span>

                                                                </div>

                                                            </div>
                                                        );

                                                    })}

                                            </div>

                                        </div>

                                    </div>

                                    {/* --- MEMO --- */}
                                    <div className="w-full border-b border-zinc-800 pb-0.5 flex items-baseline">

                                        <span className="font-bold text-zinc-900 text-[9px] uppercase tracking-wider mr-1.5">
                                            Memo
                                        </span>

                                        <div className="flex-1 text-[9px] font-semibold text-zinc-800 pl-2 italic tracking-wide truncate">
                                            {pageItems
                                                .map(
                                                    (item) =>
                                                        `${item.carat ||
                                                        item.metal ||
                                                        "21K"} - ${item.categoryName ||
                                                        "Jewellery Item"
                                                        }`
                                                )
                                                .join(", ")}
                                        </div>

                                    </div>
                                </>

                                {/* --- TABLE CONTENT --- */}
                                <div className="w-full border border-zinc-800 rounded-sm overflow-hidden bg-transparent">

                                    <table className="w-full text-left border-collapse table-fixed min-w-0">

                                        <thead>

                                            <tr className="bg-zinc-300 text-zinc-900 font-bold border-b border-zinc-800 text-[9px]">

                                                <th className="py-0.5 px-1 w-[7%] text-center">
                                                    S No.
                                                </th>

                                                <th className="py-0.5 px-1.5 w-[18%]">
                                                    Item Code
                                                </th>

                                                <th className="py-0.5 px-1.5 w-[35%]">
                                                    Description
                                                </th>

                                                <th className="py-0.5 px-1 w-[10%] text-center">
                                                    Purity
                                                </th>

                                                <th className="py-0.5 px-1 w-[10%] text-center">
                                                    Weight (gm)
                                                </th>

                                                <th className="py-0.5 px-1 w-[10%] text-center">
                                                    Wastage (gm)
                                                </th>

                                                <th className="py-0.5 px-1 w-[10%] text-center">
                                                    Total Weight
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {pageItems.map((item, index) => {

                                                const structuralSerialIndex =
                                                    pageIdx * 2 + index + 1;

                                                return (
                                                    <React.Fragment key={item.id || index}>

                                                        {/* Main Item Row */}
                                                        <tr className="bg-zinc-100 opacity-70 border-b border-zinc-100 font-medium text-zinc-900 align-top text-[9px]">

                                                            <td className="py-0.5 px-1 text-center font-bold">
                                                                {String(
                                                                    structuralSerialIndex
                                                                ).padStart(2, "0")}
                                                            </td>

                                                            <td className="py-0.5 px-1.5 font-mono tracking-wider">
                                                                {item.itemCode || "N/A"}
                                                            </td>

                                                            <td className="py-0.5 px-1.5 font-semibold">
                                                                {item.metal
                                                                    ? `${item.metal} - ${item.categoryName ||
                                                                    "Jewellery Piece"
                                                                    }`
                                                                    : item.categoryName ||
                                                                    "Jewellery Piece"}
                                                            </td>

                                                            <td className="py-0.5 px-1 text-center font-bold">
                                                                {item.metal === "Palladium"
                                                                    ? item.purity
                                                                        ? `${item.purity}%`
                                                                        : "—"
                                                                    : item.carat ||
                                                                    item.metal ||
                                                                    "—"}
                                                            </td>

                                                            <td className="py-0.5 px-1 text-center font-semibold">
                                                                {item.netW?.toFixed(3) ??
                                                                    "0.000"}
                                                            </td>

                                                            <td className="py-0.5 px-1 text-right font-semibold">
                                                                {item.wasteW?.toFixed(3) ??
                                                                    "0.000"}
                                                            </td>

                                                            <td className="py-0.5 px-1 text-right font-semibold">
                                                                {item.grossMetalWeight?.toFixed(
                                                                    3
                                                                ) ?? "0.000"}
                                                            </td>

                                                        </tr>

                                                        {/* Detail Breakdown Row */}
                                                        <tr className="border-b border-zinc-800 text-[8.5px] min-w-0">

                                                            <td
                                                                colSpan={2}
                                                                className="py-1 px-1.5 align-middle"
                                                            >

                                                                <div className="w-16 h-11 border border-zinc-300 rounded-sm overflow-hidden p-0.5 mx-auto flex items-center justify-center bg-white">

                                                                    {item.imageUrl ? (
                                                                        <img
                                                                            src={item.imageUrl}
                                                                            className="w-full h-full object-cover"
                                                                            alt="Invoice Item Thumbnail"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full border border-dashed border-zinc-300 bg-zinc-50/50 flex flex-col items-center justify-center gap-0.5 text-zinc-400">

                                                                            <ImageIcon
                                                                                size={12}
                                                                                strokeWidth={1.5}
                                                                            />

                                                                            <span className="text-[6.5px] font-medium tracking-tight">
                                                                                No Image
                                                                            </span>

                                                                        </div>
                                                                    )}

                                                                </div>

                                                            </td>

                                                            <td
                                                                colSpan={6}
                                                                className="p-0 align-top min-w-0 overflow-hidden"
                                                            >
                                                                <div className="w-full min-w-0 flex flex-col font-medium py-0.5 text-zinc-900 overflow-hidden">
                                                                    {/* ============================= */}
                                                                    {/* GOLD / METAL ROW */}
                                                                    {/* ============================= */}

                                                                    <div className="w-full border-b border-zinc-200 bg-zinc-100 min-w-0">

                                                                        {/* Sub Total - Row 1 */}
                                                                        <div className="grid grid-cols-[minmax(70px,1fr)_auto] items-center gap-2 px-1.5 py-0.5 min-w-0">
                                                                            <div className="font-bold text-zinc-950 whitespace-nowrap">
                                                                                Sub Totals
                                                                            </div>

                                                                            <div className="text-right font-mono font-semibold whitespace-nowrap shrink-0">
                                                                                {formatCurrency(
                                                                                    (item.absoluteMetalPrice || 0) -
                                                                                    (Number(item.making) || 0)
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Making - Row 2 */}
                                                                        <div className="grid grid-cols-[minmax(70px,1fr)_auto] items-center gap-2 px-1.5 py-0.5 min-w-0 border-t border-zinc-200">
                                                                            <div className="font-bold text-zinc-950 whitespace-nowrap">
                                                                                Making
                                                                            </div>

                                                                            <div className="text-right font-mono font-semibold whitespace-nowrap shrink-0">
                                                                                {formatCurrency(Number(item.making) || 0)}
                                                                            </div>
                                                                        </div>

                                                                    </div>




                                                                    {/* ============================= */}
                                                                    {/* STONES */}
                                                                    {/* ============================= */}
                                                                    {
                                                                        item.stoneDetails && item.stoneDetails.length > 0 && (
                                                                            <div className="grid grid-cols-[64px_minmax(0,1fr)] w-full border-b border-zinc-200 bg-zinc-100 min-w-0">

                                                                                <div className="px-1.5 py-0.5 font-bold text-zinc-950 whitespace-nowrap">
                                                                                    Stones
                                                                                </div>

                                                                                <div className="px-1.5 py-0.5 text-zinc-700 min-w-0 font-medium overflow-hidden">

                                                                                    {item.stoneDetails &&
                                                                                        item.stoneDetails.length > 0 ? (

                                                                                        <div className="flex flex-col">

                                                                                            {item.stoneDetails.map((stone, index) => (

                                                                                                <div
                                                                                                    key={index}
                                                                                                    className="flex justify-between items-center"
                                                                                                >

                                                                                                    <span>
                                                                                                        {stone.name || "Unknown Stone"} -{" "}
                                                                                                        {stone.weight ?? 0} ct
                                                                                                    </span>

                                                                                                    <span className="font-mono font-semibold whitespace-nowrap shrink-0">
                                                                                                        Rs{" "}
                                                                                                        {formatCurrency(
                                                                                                            Number(stone.price) || 0
                                                                                                        )}
                                                                                                    </span>

                                                                                                </div>

                                                                                            ))}

                                                                                            {/* Total Stone Price */}
                                                                                            <div className="border-t border-zinc-300 mt-0.5 pt-0.5 flex justify-between font-bold text-zinc-950">

                                                                                                <span>
                                                                                                    Total Stone Price
                                                                                                </span>

                                                                                                <span className="font-mono whitespace-nowrap">
                                                                                                    Rs{" "}
                                                                                                    {formatCurrency(
                                                                                                        item.stoneDetails.reduce(
                                                                                                            (total, stone) =>
                                                                                                                total +
                                                                                                                (Number(stone.price) || 0),
                                                                                                            0
                                                                                                        )
                                                                                                    )}
                                                                                                </span>

                                                                                            </div>

                                                                                        </div>

                                                                                    ) : null}

                                                                                </div>

                                                                            </div>)
                                                                    }



                                                                    {/* ============================= */}
                                                                    {/* DIAMONDS */}
                                                                    {/* ============================= */}

                                                                    {
                                                                        item.diamondDetails && item.diamondDetails.length > 0 && (
                                                                            <div className="grid grid-cols-[64px_minmax(0,1fr)] w-full border-b border-zinc-200 bg-zinc-100 min-w-0">

                                                                                <div className="px-1.5 py-0.5 font-bold text-zinc-950 whitespace-nowrap">
                                                                                    Diamonds
                                                                                </div>

                                                                                <div className="px-1.5 py-0.5 text-zinc-700 min-w-0 font-medium overflow-hidden">

                                                                                    {item.diamondDetails &&
                                                                                        item.diamondDetails.length > 0 ? (

                                                                                        <div className="flex flex-col">

                                                                                            {item.diamondDetails.map(
                                                                                                (diamond, index) => (

                                                                                                    <div
                                                                                                        key={index}
                                                                                                        className="flex justify-between items-center"
                                                                                                    >

                                                                                                        <span>
                                                                                                            {diamond.name || "Diamond"} -{" "}
                                                                                                            {diamond.weight ?? 0} ct
                                                                                                        </span>

                                                                                                        <span className="font-mono font-semibold whitespace-nowrap shrink-0">
                                                                                                            Rs{" "}
                                                                                                            {formatCurrency(
                                                                                                                Number(diamond.price) || 0
                                                                                                            )}
                                                                                                        </span>

                                                                                                    </div>

                                                                                                )
                                                                                            )}

                                                                                            {/* Total Diamond Price */}
                                                                                            <div className="border-t border-zinc-300 mt-0.5 pt-0.5 flex justify-between font-bold text-zinc-950">

                                                                                                <span>
                                                                                                    Total Diamond Price
                                                                                                </span>

                                                                                                <span className="font-mono whitespace-nowrap">
                                                                                                    Rs{" "}
                                                                                                    {formatCurrency(
                                                                                                        item.diamondDetails.reduce(
                                                                                                            (total, diamond) =>
                                                                                                                total +
                                                                                                                (Number(diamond.price) || 0),
                                                                                                            0
                                                                                                        )
                                                                                                    )}
                                                                                                </span>

                                                                                            </div>

                                                                                        </div>

                                                                                    ) : null}

                                                                                </div>

                                                                            </div>)
                                                                    }



                                                                    {/* ============================= */}
                                                                    {/* BEADS */}
                                                                    {/* ============================= */}

                                                                    {
                                                                        item.beadDetails &&
                                                                        (
                                                                            Array.isArray(item.beadDetails)
                                                                                ? item.beadDetails.length > 0
                                                                                : true
                                                                        ) && (
                                                                            <div className="grid grid-cols-[64px_minmax(0,1fr)] w-full border-b border-zinc-200 bg-zinc-100 min-w-0">

                                                                                <div className="px-1.5 py-0.5 font-bold text-zinc-950 whitespace-nowrap">
                                                                                    Beads
                                                                                </div>

                                                                                <div className="px-1.5 py-0.5 text-zinc-700 min-w-0 font-medium overflow-hidden">

                                                                                    {item.beadDetails ? (

                                                                                        <div className="flex flex-col">

                                                                                            {(Array.isArray(item.beadDetails)
                                                                                                ? item.beadDetails
                                                                                                : [item.beadDetails]
                                                                                            ).map((bead, index) => (

                                                                                                <div
                                                                                                    key={index}
                                                                                                    className="flex justify-between items-center"
                                                                                                >

                                                                                                    <span>
                                                                                                        {bead.name || "Bead"} -{" "}
                                                                                                        {bead.weight ?? 0} ct
                                                                                                    </span>

                                                                                                    <span className="font-mono font-semibold whitespace-nowrap shrink-0">
                                                                                                        Rs{" "}
                                                                                                        {formatCurrency(
                                                                                                            Number(bead.price) || 0
                                                                                                        )}
                                                                                                    </span>

                                                                                                </div>

                                                                                            ))}

                                                                                            {/* Total Bead Price */}
                                                                                            <div className="border-t border-zinc-300 mt-0.5 pt-0.5 flex justify-between font-bold text-zinc-950">

                                                                                                <span>
                                                                                                    Total Bead Price
                                                                                                </span>

                                                                                                <span className="font-mono whitespace-nowrap">
                                                                                                    Rs{" "}
                                                                                                    {formatCurrency(
                                                                                                        (
                                                                                                            Array.isArray(
                                                                                                                item.beadDetails
                                                                                                            )
                                                                                                                ? item.beadDetails
                                                                                                                : [item.beadDetails]
                                                                                                        ).reduce(
                                                                                                            (total, bead) =>
                                                                                                                total +
                                                                                                                (Number(bead.price) || 0),
                                                                                                            0
                                                                                                        )
                                                                                                    )}
                                                                                                </span>

                                                                                            </div>

                                                                                        </div>

                                                                                    ) : null}

                                                                                </div>

                                                                            </div>)
                                                                    }


                                                                    {/* ============================= */}
                                                                    {/* ITEM SUBTOTAL */}
                                                                    {/* ============================= */}

                                                                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 font-bold w-full text-zinc-950 py-0.5 px-1.5 min-w-0">

                                                                        <div className="text-right uppercase tracking-tight text-[8px] min-w-0">
                                                                            Item Total (Rs)
                                                                        </div>

                                                                        <div className="text-right text-[10px] font-extrabold font-mono whitespace-nowrap shrink-0">
                                                                            {formatCurrency(
                                                                                Number(
                                                                                    item.peritemTotal ||
                                                                                    item.itemTotal ||
                                                                                    0
                                                                                )
                                                                            )}
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </td>

                                                        </tr>

                                                    </React.Fragment>
                                                );

                                            })}

                                        </tbody>

                                    </table>

                                </div>

                                {/* --- PAGE FINANCIAL SUMMARY --- */}
                                {(() => {
                                    const summary =
                                        pageFinancialSummaries[pageIdx];

                                    if (!summary) {
                                        return null;
                                    }

                                    return (
                                        <div className="w-full flex justify-end page-break-inside-avoid pt-0.5">
                                            <div className="w-[70mm] flex flex-col font-bold text-zinc-900 text-right text-[9.5px]">

                                                {/* TOTAL AMOUNT */}
                                                <div className="flex justify-between py-0.5 border-b border-zinc-300">
                                                    <span className="text-zinc-700 font-medium">
                                                        Total Amount (Rs)
                                                    </span>

                                                    <span className="text-[10px] font-black font-mono whitespace-nowrap">
                                                        {formatCurrency(summary.pageTotalAmount)}
                                                    </span>
                                                </div>

                                                {/* ADVANCE USED FOR THIS PAGE */}
                                                <div className="flex justify-between py-0.5 border-b border-zinc-300">
                                                    <span className="text-zinc-700 font-medium">
                                                        Advance Paid (Rs)
                                                    </span>

                                                    <span className="text-[10px] font-bold font-mono whitespace-nowrap">
                                                        {formatCurrency(summary.pageAdvance)}
                                                    </span>
                                                </div>

                                                {/* DISCOUNT USED FOR THIS PAGE */}
                                                <div className="flex justify-between py-0.5 border-b border-zinc-300">
                                                    <span className="text-zinc-700 font-medium">
                                                        Total Discount (Rs)
                                                    </span>

                                                    <span className="text-[10px] font-bold font-mono whitespace-nowrap">
                                                        {formatCurrency(summary.pageDiscount)}
                                                    </span>
                                                </div>

                                                {/* NET BALANCE */}
                                                <div className="flex justify-between py-0.5 border-b-[2px] border-double border-zinc-900 mt-0.5">
                                                    <span className="text-zinc-950 font-extrabold text-[10px] uppercase tracking-tight">
                                                        Net Balance (Rs)
                                                    </span>

                                                    <span className="text-[12px] font-black font-mono tracking-tight whitespace-nowrap">
                                                        {formatCurrency(summary.pageNetBalance)}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })()}

                            </div>
                        );
                    })}

                </div>

            </div>

        </div>
    );
};