"use client";

import React, { useEffect, useMemo } from "react";
import { useGoldStore } from "../hooks/useGoldStore";
import type { CartItem, ClientProfile } from "../utils/types";
import {
    calculatePageFinancialSummaries,
    paginateCartItems,
    processCartItems,
} from "../utils/invoiceCalculations";
import { formatCurrency } from "../utils/invoiceUtils";
import { InvoicePageHeader } from "./_billing/Invoice/InvoicePageHeader";
import { InvoiceItemsTable } from "./_billing/Invoice/InvoiceItemsTable";
import { InvoicePageSummary } from "./_billing/Invoice/InvoicePageSummary";

interface PrintInvoiceProps {
    customer: ClientProfile;
    cart: CartItem[];
    discount: number;
    exchangeValue: number;
    advance: number;
    finalTotal: number;
    billSerialNumber: string;
}

export const PrintInvoice = ({
    customer,
    cart,
    exchangeValue,
    advance,
    finalTotal,
    discount,
    billSerialNumber,
}: PrintInvoiceProps) => {
    const {
        rate21ct, rate24ct, rate22ct, rate20ct, rate18ct, rate14ct,
        ratePalladium, rateSilver, ratePlatinum,
    } = useGoldStore();

    const rateLookup = useMemo((): Record<string, number> => ({
        "24k": Number(rate24ct) || 0, "24ct": Number(rate24ct) || 0,
        "22k": Number(rate22ct) || 0, "22ct": Number(rate22ct) || 0,
        "21k": Number(rate21ct) || 0, "21ct": Number(rate21ct) || 0,
        "20k": Number(rate20ct) || 0, "20ct": Number(rate20ct) || 0,
        "18k": Number(rate18ct) || 0, "18ct": Number(rate18ct) || 0,
        "14k": Number(rate14ct) || 0, "14ct": Number(rate14ct) || 0,
        palladium: Number(ratePalladium) || 0,
        silver: Number(rateSilver) || 0,
        platinum: Number(ratePlatinum) || 0,
    }), [
        rate21ct, rate24ct, rate22ct, rate20ct, rate18ct, rate14ct,
        ratePalladium, rateSilver, ratePlatinum,
    ]);

    const getItemRate = (item: CartItem): number => {
        const caratKey = item.carat ? String(item.carat).toLowerCase().trim() : "";
        const metalKey = item.metal ? String(item.metal).toLowerCase().trim() : "";

        if (metalKey === "palladium" || caratKey === "palladium") return Number(ratePalladium) || 0;
        if (metalKey === "silver" || caratKey === "silver") return Number(rateSilver) || 0;
        if (metalKey === "platinum" || caratKey === "platinum") return Number(ratePlatinum) || 0;

        if (rateLookup[caratKey]) return rateLookup[caratKey];
        if (rateLookup[metalKey]) return rateLookup[metalKey];

        if (caratKey.includes("24")) return Number(rate24ct) || 0;
        if (caratKey.includes("22")) return Number(rate22ct) || 0;
        if (caratKey.includes("21")) return Number(rate21ct) || 0;
        if (caratKey.includes("20")) return Number(rate20ct) || 0;
        if (caratKey.includes("18")) return Number(rate18ct) || 0;
        if (caratKey.includes("14")) return Number(rate14ct) || 0;

        return 0;
    };

    const processedCartItems = useMemo(() => processCartItems(cart), [cart]);
    // Keep the existing two-items-per-page print behaviour.
    const cartPages = useMemo(
        () => paginateCartItems(processedCartItems, 2),
        [processedCartItems]
    );
    const pageFinancialSummaries = useMemo(
        () => calculatePageFinancialSummaries(cartPages, advance, discount),
        [cartPages, advance, discount]
    );

    useEffect(() => {
        console.log("PRINT INVOICE INCOMING DATA", {
            customer, cart, discount, exchangeValue, advance, finalTotal,
        });
    }, [customer, cart, discount, exchangeValue, advance, finalTotal]);

    const formattedDate = useMemo(
        () => new Date().toLocaleString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }),
        []
    );

    return (
        <div className="hidden print:block print:bg-white print:text-black">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
            @media print {
              @page { size: 20.1cm 26.4cm; margin: 0mm; }
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
                padding-top: 3.9cm;
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
                    {cartPages.map((pageItems, pageIdx) => (
                        <div
                            key={pageIdx}
                            className="print-page flex flex-col space-y-2 w-full min-h-0"
                        >
                            <InvoicePageHeader
                                customer={customer}
                                pageItems={pageItems}
                                billSerialNumber={billSerialNumber}
                                formattedDate={formattedDate}
                                getItemRate={getItemRate}
                                formatCurrency={formatCurrency}
                            />

                            <InvoiceItemsTable
                                pageItems={pageItems}
                                pageIdx={pageIdx}
                                formatCurrency={formatCurrency}
                            />

                            <InvoicePageSummary summary={pageFinancialSummaries[pageIdx]} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export type { CartItem, ClientProfile } from "../utils/types";
