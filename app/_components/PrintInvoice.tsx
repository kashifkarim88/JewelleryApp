"use client";

import React, { useEffect, useMemo } from 'react';
import { useGoldStore } from '../hooks/useGoldStore';

// Assuming these interfaces come from your global types file
interface ClientProfile {
    name: string;
    phone: string;
    seller?: string;
}

interface DetailItem {
    weight?: string | number;
}

// 1. This matches your updated global CartItem interface
export interface CartItem {
    id: string;
    itemCode: string;
    productCode?: string;
    categoryName: string;
    carat: string;
    metal: string;
    netWeight: number;
    wastagePercent: number;
    making: number;
    discount?: number;
    advance?: number;
    diamondDetails?: DetailItem[] | null;
    stoneDetails?: DetailItem[] | null;
    beadDetails?: DetailItem | DetailItem[] | null; // Kept flexible for handling array or single object safely
    peritemTotal?: number;
    itemTotal?: string | number; // Fallback helper if accessed via raw string calculations
    stonesTotal?: string | number;
    stonePrice?: string | number;
    wastageGram?: string | number;
    imageUrl?: string;
}

// 2. Create an Enriched interface containing your runtime computed values
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
    cart: CartItem[]; // Receives standard application CartItem objects
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
    }), [rate21ct, rate24ct, rate22ct, rate20ct, rate18ct, rate14ct, ratePalladium, rateSilver, ratePlatinum]);

    const getItemRate = (item: CartItem): number => {
        const caratKey = item.carat ? String(item.carat).toLowerCase().trim() : '';
        const metalKey = item.metal ? String(item.metal).toLowerCase().trim() : '';

        if (['palladium', 'silver', 'platinum'].includes(metalKey) || ['palladium', 'silver', 'platinum'].includes(caratKey)) {
            if (metalKey === 'palladium' || caratKey === 'palladium') return Number(ratePalladium) || 0;
            if (metalKey === 'silver' || caratKey === 'silver') return Number(rateSilver) || 0;
            if (metalKey === 'platinum' || caratKey === 'platinum') return Number(ratePlatinum) || 0;
        }

        if (rateLookup[caratKey]) return rateLookup[caratKey];

        if (metalKey === 'gold') {
            if (caratKey.includes('21')) return Number(rate21ct) || 0;
            if (caratKey.includes('22')) return Number(rate22ct) || 0;
            if (caratKey.includes('24')) return Number(rate24ct) || 0;
            if (caratKey.includes('18')) return Number(rate18ct) || 0;
        }

        return rateLookup[metalKey] || 0;
    };

    const sumDetailsWeight = (details: DetailItem | DetailItem[] | undefined | null): number => {
        if (!details) return 0;
        if (Array.isArray(details)) {
            return details.reduce((acc, current) => acc + (Number(current?.weight) || 0), 0);
        }
        return Number((details as DetailItem).weight) || 0;
    };

    const primaryInvoiceSubTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + (Number(item.peritemTotal || item.itemTotal) || 0), 0);
    }, [cart]);

    const uniqueRatesToShow = useMemo(() => {
        return cart.filter((item, index, self) =>
            index === self.findIndex((t) => (t.carat || t.metal) === (item.carat || item.metal))
        );
    }, [cart]);

    // Explicitly typed to yield ProcessedCartItem array
    const processedCartItems = useMemo((): ProcessedCartItem[] => {
        return cart.map((item) => {
            const netW = Number(item.netWeight) || 0;
            const wasteW = item.wastageGram
                ? Number(item.wastageGram)
                : (netW * (Number(item.wastagePercent) || 0)) / 100;

            const grossMetalWeight = netW + wasteW;
            const stonePrice = Number(item.stonesTotal || item.stonePrice) || 0;
            const absoluteMetalPrice = (Number(item.peritemTotal || item.itemTotal) || 0) - stonePrice;

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

    // Explicitly typed to yield arrays of ProcessedCartItem chunks
    const cartPages = useMemo((): ProcessedCartItem[][] => {
        const chunks: ProcessedCartItem[][] = [];
        for (let i = 0; i < processedCartItems.length; i += 2) {
            chunks.push(processedCartItems.slice(i, i + 2));
        }
        return chunks;
    }, [processedCartItems]);

    useEffect(() => {
        console.log("=================== PRINT INVOICE INCOMING DATA DETECTOR ===================");
        console.log("Customer Profile Metadata object:", customer);
        console.log("Active Target Items Collection Matrix Array (cart):", cart);
        console.log("Combined Deductions Applied (discount):", discount);
        console.log("Trade-In Valuations Asset Balance (exchangeValue):", exchangeValue);
        console.log("Upfront Client Deposits Tracked (advance):", advance);
        console.log("Net Final Due Invoice Total (finalTotal):", finalTotal);
        console.log("============================================================================");
    }, [customer, cart, discount, exchangeValue, advance, finalTotal]);

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
            <style dangerouslySetInnerHTML={{
                __html: `
                    @media print { 
                        @page { 
                            size: A4; 
                            margin: 15mm 10mm 25mm 10mm; 
                        } 
                        body { visibility: hidden; background: white; }
                        .print-container { 
                            visibility: visible; 
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .print-page {
                            page-break-after: always;
                            break-after: page;
                            position: relative;
                        }
                        tr { page-break-inside: avoid !important; break-inside: avoid !important; }
                        .print-footer-fixed {
                            position: fixed;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            background: white;
                            page-break-after: avoid;
                        }
                    }
                `
            }} />

            <div className="print-container absolute top-0 left-0 w-[190mm] font-sans text-[11px] text-zinc-800 leading-relaxed antialiased select-none">

                {/* --- BACKGROUND WATERMARK LAYER --- */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none z-0 overflow-hidden">
                    <p className="text-[50px] font-black tracking-widest text-zinc-900 uppercase transform -rotate-35 whitespace-nowrap">
                        Hamidullah Jewellery
                    </p>
                </div>

                <div className="relative z-10 w-full flex flex-col space-y-4 pb-[40mm]">

                    <div className="flex justify-between items-start w-full">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Sale Invoice</h1>
                            <div className="mt-2 flex flex-col items-start">
                                <div className="h-10 w-44 bg-zinc-900 border border-zinc-950 flex items-baseline justify-between px-1.5 pt-0.5 overflow-hidden"
                                    style={{ backgroundImage: 'repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 7px, #fff 7px, #fff 8px)' }}>
                                </div>
                                <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-700 mt-1 pl-4">* 0 2 0 0 0 0 6 3 2 8 *</span>
                            </div>
                        </div>
                        <div className="text-right pt-2">
                            <p className="text-[12px] font-medium"><span className="font-bold text-zinc-900">Date:</span> {formattedDate}</p>
                        </div>
                    </div>

                    {/* --- DETAILS OVERVIEW CONTROLLERS --- */}
                    <div className="w-full flex items-stretch justify-between gap-4">
                        <div className="w-[68mm] border border-zinc-800 rounded-sm overflow-hidden bg-white shadow-sm flex flex-col">
                            <div className="bg-zinc-200/80 px-2 py-0.5 border-b border-zinc-800">
                                <p className="font-extrabold text-zinc-900 text-[9.5px] uppercase tracking-wider">Bill To</p>
                            </div>
                            <div className="p-2 space-y-0.5 text-zinc-900 font-medium flex-1 justify-center flex flex-col">
                                <p className="font-black text-xs tracking-tight text-zinc-950 leading-tight">{customer.name || 'Walk-in Customer'}</p>
                                <p className="text-[10px]">Contact #: {customer.phone || 'N/A'}</p>
                                <p className="text-[10px]">Seller: <span className="font-semibold">{customer.seller || 'N/A'}</span></p>
                                <p className="text-[10px] text-zinc-500">Pakistan</p>
                            </div>
                        </div>

                        <div className="w-[85mm] border border-zinc-800 rounded-sm overflow-hidden bg-white shadow-sm flex flex-col">
                            <div className="bg-zinc-200/80 px-2 py-0.5 border-b border-zinc-800 flex justify-between items-center">
                                <p className="font-extrabold text-zinc-900 text-[9.5px] uppercase tracking-wider">Live Invoice Metal Rates Lookup</p>
                                <span className="inline-block w-1 h-1 bg-emerald-500 rounded-full"></span>
                            </div>

                            <div className="p-2 flex-1 flex flex-col justify-center space-y-1">
                                {uniqueRatesToShow.map((item, idx) => {
                                    const computedRate = getItemRate(item);
                                    return (
                                        <div key={idx} className="flex items-center justify-between border-b border-zinc-100 pb-0.5 last:border-0 last:pb-0 w-full">
                                            <div className="flex items-baseline space-x-1 w-[32mm]">
                                                <span className="font-bold text-zinc-900 text-[10px] tracking-tight">
                                                    {item.carat || item.metal || 'Item'}
                                                </span>
                                                <span className="text-[8.5px] font-medium text-zinc-400 lowercase tracking-tight">
                                                    ({item.metal || 'Gold'})
                                                </span>
                                            </div>
                                            <div className="flex-1 text-right">
                                                <span className="text-[10px] font-bold text-zinc-700 font-mono tracking-tight">
                                                    {computedRate > 0 ? `Rs ${formatCurrency(computedRate)}` : '—'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="w-full border-b border-zinc-800 pb-0.5 flex items-baseline mt-1">
                        <span className="font-bold text-zinc-900 text-[11px] uppercase tracking-wider mr-1.5">Memo</span>
                        <div className="flex-1 text-[11px] font-semibold text-zinc-800 pl-4 italic tracking-wide">
                            {cart.map((item) => `${item.carat || item.metal || '21K'} - ${item.categoryName || 'Jewellery Item'}`).join(', ')}
                        </div>
                    </div>

                    {cartPages.map((pageItems, pageIdx) => {
                        const isLastPage = pageIdx === cartPages.length - 1;

                        return (
                            <div key={pageIdx} className="print-page flex flex-col space-y-4 w-full">

                                <div className="w-full border border-zinc-800 rounded-sm overflow-hidden bg-transparent mt-1">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-zinc-300 text-zinc-900 font-bold border-b border-zinc-800 text-[11px]">
                                                <th className="py-1.5 px-2 w-12 text-center">S No.</th>
                                                <th className="py-1.5 px-3 w-32">Item Code</th>
                                                <th className="py-1.5 px-3 flex-1">Description</th>
                                                <th className="py-1.5 px-2 text-center">Purity</th>
                                                <th className="py-1.5 px-2 w-24 text-center">Weight (gm)</th>
                                                <th className="py-1.5 px-2 w-24 text-center">Wastage (gm)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pageItems.map((item, index) => {
                                                const structuralSerialIndex = (pageIdx * 2) + index + 1;

                                                return (
                                                    <React.Fragment key={item.id || index}>
                                                        <tr className="bg-zinc-100 opacity-70 border-b border-zinc-100 font-medium text-zinc-900 align-top">
                                                            <td className="py-2 px-2 text-center font-bold">
                                                                {String(structuralSerialIndex).padStart(2, '0')}
                                                            </td>
                                                            <td className="py-2 px-3 font-mono tracking-wider">
                                                                {item.itemCode || 'N/A'}
                                                            </td>
                                                            <td className="py-2 px-3 font-semibold uppercase">
                                                                {item.categoryName || 'Jewellery Piece'}
                                                            </td>
                                                            <td className="py-2 px-2 text-center font-bold">
                                                                {item.carat || item.metal || '—'}
                                                            </td>
                                                            <td className="py-2 px-2 text-center font-semibold">
                                                                {item.netW.toFixed(3)}
                                                            </td>
                                                            <td className="py-2 px-2 text-right font-semibold">
                                                                {item.wasteW.toFixed(3)}
                                                            </td>
                                                        </tr>

                                                        <tr className="border-b border-zinc-800 text-[10px]">
                                                            <td colSpan={2} className="py-3 px-3 bg-zinc-100 border border-zinc-800">
                                                                {item.imageUrl && (
                                                                    <div className="w-28 h-20 border border-zinc-300 rounded-sm overflow-hidden p-0.5">
                                                                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="Invoice Item Thumbnail View" />
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td colSpan={4} className="p-0">
                                                                <div className="w-full flex flex-col font-medium text-zinc-900 pt-2">
                                                                    <div className="flex border opacity-70 border-zinc-100 w-full items-center bg-zinc-100">
                                                                        <div className="py-1 px-3 font-bold text-zinc-950 w-32">Gold / Metal (gm)</div>
                                                                        <div className="py-1 px-3 text-right w-20">
                                                                            {item.grossMetalWeight.toFixed(3)}
                                                                        </div>
                                                                        <div className="py-1 px-3 text-center w-28">{item.making}</div>
                                                                        <div className="py-1 px-3 text-zinc-600 flex-1 whitespace-nowrap">per gm with making</div>
                                                                        <div className="py-1 px-2 text-right font-bold w-25">
                                                                            {formatCurrency(item.absoluteMetalPrice)}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex border opacity-70 border-zinc-100 w-full bg-zinc-100">
                                                                        <div className="py-1 px-3 font-bold text-zinc-950 w-36">Stones weight & price</div>
                                                                        <div className="py-1 px-3 w-24 text-zinc-600">
                                                                            {item.structuralAccentsWeight > 0 ? `${item.structuralAccentsWeight.toFixed(3)} ct.` : '—'}
                                                                        </div>
                                                                        <div className="py-1 px-3 w-32 text-right text-zinc-600">Rs</div>
                                                                        <div className="py-1 px-3 flex-1"></div>
                                                                        <div className="py-1 px-2 text-right font-bold w-28">
                                                                            {formatCurrency(item.stonePrice)}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex font-bold w-full text-zinc-950">
                                                                        <div className="py-1.5 px-3 flex-1 text-right ">Item Sub Total (Rs)</div>
                                                                        <div className="py-1.5 px-2 text-right w-28 text-[12px] font-extrabold">
                                                                            {formatCurrency(Number(item.peritemTotal || item.itemTotal))}
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

                                {isLastPage && (
                                    <div className="w-full flex justify-end page-break-inside-avoid">
                                        <div className="w-[85mm] flex flex-col font-bold text-zinc-900 text-right">
                                            <div className="flex justify-between py-1 border-b border-zinc-300">
                                                <span className="text-zinc-700 font-medium">Total Amount (Rs)</span>
                                                <span className="text-sm font-black">{formatCurrency(primaryInvoiceSubTotal)}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-zinc-300">
                                                <span className="text-zinc-700 font-medium">Received Price of Gold (Rs)</span>
                                                <span className="text-sm font-bold">{formatCurrency(exchangeValue)}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-zinc-800">
                                                <span className="text-zinc-700 font-medium">Total Cash Received (Rs)</span>
                                                <span className="text-sm font-bold">
                                                    {formatCurrency((advance || 0) + (finalTotal > 0 ? 0 : finalTotal))}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1.5 border-b-[3px] border-double border-zinc-900 mt-0.5">
                                                <span className="text-zinc-950 font-extrabold text-[12px] uppercase tracking-tight">Net Balance (Rs)</span>
                                                <span className="text-base font-black tracking-tight">
                                                    {formatCurrency(finalTotal < 0 ? 0 : finalTotal)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* --- REPEATING PRINT FOOTER --- */}
                    <div className="print-footer-fixed w-full pt-4 flex flex-col space-y-1.5 text-zinc-700 border-t border-zinc-300 font-medium text-[10.5px]">
                        <p><span className="font-extrabold text-zinc-900 italic">Item(s) Exchange Policy:</span> Item(s) will be exchanged on net weight of gold.</p>
                        <p><span className="font-extrabold text-zinc-900 italic">Item(s) Return Policy:</span> 10, 15 & 25% will be deducted on net weight of 22K, 21K & 18K gold respectively.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};