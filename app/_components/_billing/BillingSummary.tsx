"use client"
import React from 'react';
import { Tag, Printer, RefreshCw } from 'lucide-react';
import { FullInput } from './BillingComponents';

interface SummaryProps {
    discount: number;
    setDiscount: (val: number) => void;
    exchangeValue: number; // New Prop
    setExchangeValue: (val: number) => void; // New Prop
    finalTotal: number;
    onPrintFull: () => void;
}

export const BillingSummary = ({
    discount,
    setDiscount,
    exchangeValue,
    setExchangeValue,
    finalTotal,
    onPrintFull
}: SummaryProps) => {

    // subTotal = total of items before any deductions
    const subTotal = finalTotal + Number(discount || 0) + Number(exchangeValue || 0);

    return (
        <div className="w-full lg:w-72 sticky top-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bill Summary</h2>
                </div>

                <div className="p-4 space-y-3">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Subtotal</span>
                        <span className="text-xs font-bold text-slate-700">Rs. {subTotal.toLocaleString()}</span>
                    </div>

                    {/* Exchange Value Input */}
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                            Exchange
                        </span>
                        <div className="w-24">
                            <FullInput
                                label=""
                                value={exchangeValue === 0 ? '' : exchangeValue}
                                isNumber
                                onChange={(v) => setExchangeValue(v)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Cash Discount Input */}
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Discount</span>
                        <div className="w-24">
                            <FullInput
                                label=""
                                value={discount === 0 ? '' : discount}
                                isNumber
                                onChange={(v) => setDiscount(v)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Final Grand Total */}
                    <div className="flex justify-between items-center py-1">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Net Payable</span>
                        <span className="text-lg font-black text-slate-900 tracking-tighter">
                            Rs. {Math.round(finalTotal).toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={onPrintFull}
                        disabled={finalTotal <= 0 && exchangeValue <= 0}
                        className="w-full py-2 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        <Printer size={12} />
                        Print Full Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};