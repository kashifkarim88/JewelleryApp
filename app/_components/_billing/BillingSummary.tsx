"use client"
import React, { useMemo } from 'react'; // Added useMemo for efficiency
import { Tag, Printer, ReceiptText, Plus, Landmark, Wallet, ArrowDownCircle } from 'lucide-react';
import { FullInput } from './BillingComponents';

export const BillingSummary = ({
    cart,
    discount,
    itemDiscountsSum,
    extraDiscount,
    setExtraDiscount,
    exchangeValue,
    setExchangeValue,
    advance, // Global Cash Advance State
    setAdvance,
    finalTotal,
    onPrintFull
}: any) => {

    // 1. CALCULATE SUM DIRECTLY FROM CART (Fixes the "not showing" issue)
    const currentItemAdvancesSum = useMemo(() => {
        return cart.reduce((sum: number, item: any) => sum + (Number(item.advance) || 0), 0);
    }, [cart]);

    // 2. COMBINE WITH GLOBAL ADVANCE
    const combinedTotalAdvance = currentItemAdvancesSum + Number(advance || 0);

    // 3. RE-CALCULATE GROSS TOTAL
    const grossTotal = Number(finalTotal) + Number(discount || 0) + Number(exchangeValue || 0) + combinedTotalAdvance;

    return (
        <div className="w-full lg:w-80 sticky top-6">
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-slate-900 px-5 py-4 flex items-center gap-2 text-white">
                    <ReceiptText size={16} className="text-indigo-400" />
                    <h2 className="text-[11px] font-black uppercase tracking-widest">Bill Summary</h2>
                </div>

                <div className="p-5 space-y-5">
                    {/* GROSS SUBTOTAL */}
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Gross Subtotal</span>
                        <span className="text-sm font-black text-slate-700 tracking-tighter">
                            Rs. {Math.round(grossTotal).toLocaleString()}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {/* 1. DISCOUNT BREAKDOWN */}
                        {(itemDiscountsSum > 0 || extraDiscount > 0) && (
                            <div className="bg-red-50/50 rounded-xl p-3 border border-red-100/50 space-y-2">
                                <p className="text-[9px] font-black text-red-600 uppercase flex items-center gap-1">
                                    <Tag size={10} /> Discounts
                                </p>
                                <div className="max-h-24 overflow-y-auto space-y-1 custom-scrollbar">
                                    {cart.map((item: any, idx: number) => Number(item.discount) > 0 && (
                                        <div key={idx} className="flex justify-between text-[10px]">
                                            <span className="text-slate-500 uppercase">{item.itemCode}</span>
                                            <span className="text-red-600 font-bold">- {Number(item.discount).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {extraDiscount > 0 && (
                                        <div className="flex justify-between text-[9px] font-black italic text-red-700 border-t border-red-100 pt-1">
                                            <span>EXTRA DISC</span>
                                            <span>- {Number(extraDiscount).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 2. ADVANCE BREAKDOWN (FIXED CONDITION) */}
                        {combinedTotalAdvance > 0 && (
                            <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50 space-y-2">
                                <p className="text-[9px] font-black text-emerald-600 uppercase flex items-center gap-1">
                                    <Wallet size={10} /> Advances (Itemized)
                                </p>

                                <div className="max-h-24 overflow-y-auto space-y-1 custom-scrollbar">
                                    {/* Map through cart directly */}
                                    {cart.map((item: any, idx: number) => Number(item.advance) > 0 && (
                                        <div key={idx} className="flex justify-between text-[10px]">
                                            <span className="text-slate-500 uppercase">{item.itemCode}</span>
                                            <span className="text-emerald-700 font-bold">- {Number(item.advance).toLocaleString()}</span>
                                        </div>
                                    ))}

                                    {Number(advance) > 0 && (
                                        <div className="flex justify-between text-[9px] font-black italic text-emerald-800 border-t border-emerald-100 pt-1">
                                            <span>GLOBAL CASH</span>
                                            <span>- {Number(advance).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-1 flex justify-between border-t border-emerald-200">
                                    <span className="text-[9px] font-black text-emerald-900 uppercase">Total Advance</span>
                                    <span className="text-[10px] font-black text-emerald-900">
                                        Rs. {combinedTotalAdvance.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* INPUTS FOR MANUAL OVERRIDES */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <FullInput
                            label="Extra Disc"
                            value={extraDiscount === 0 ? '' : extraDiscount}
                            isNumber
                            onChange={(v: any) => setExtraDiscount(Number(v) || 0)}
                        />
                        <FullInput
                            label="Exchange"
                            value={exchangeValue === 0 ? '' : exchangeValue}
                            isNumber
                            onChange={(v: any) => setExchangeValue(Number(v) || 0)}
                        />
                    </div>
                    <FullInput
                        label="Global Advance Adjustment"
                        value={advance === 0 ? '' : advance}
                        isNumber
                        placeholder="0"
                        onChange={(v: any) => setAdvance(Number(v) || 0)}
                    />

                    {/* FINAL CALCULATION DISPLAY */}
                    <div className="pt-5 border-t-2 border-dashed border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-left">
                                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Net Payable</p>
                                <p className="text-2xl font-black text-indigo-600 tracking-tighter">
                                    Rs. {Math.round(finalTotal).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={onPrintFull}
                                disabled={cart.length === 0}
                                className="h-12 w-12 bg-slate-900 hover:bg-black text-white rounded-2xl flex items-center justify-center transition-all active:scale-90"
                            >
                                <Printer size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};