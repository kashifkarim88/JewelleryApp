"use client"
import React from 'react';
import { Tag, Printer, ReceiptText, Plus, Landmark, Wallet } from 'lucide-react';
import { FullInput } from './BillingComponents';

export const BillingSummary = ({
    cart,
    discount,
    itemDiscountsSum,
    extraDiscount,
    setExtraDiscount,
    exchangeValue,
    setExchangeValue,
    advance,
    setAdvance,
    finalTotal,
    onPrintFull
}: any) => {

    // Calculate gross total before any deductions (Discounts + Exchange + Advance + Final)
    const grossTotal = Number(finalTotal) + Number(discount || 0) + Number(exchangeValue || 0) + Number(advance || 0);

    return (
        <div className="w-full lg:w-80 sticky top-6">
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 px-5 py-4 flex items-center gap-2 text-white">
                    <ReceiptText size={16} className="text-indigo-400" />
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-nowrap">Bill Summary</h2>
                </div>

                <div className="p-5 space-y-5">
                    {/* Gross Subtotal Display */}
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Gross Subtotal</span>
                        <span className="text-sm font-black text-slate-700 tracking-tighter">
                            Rs. {Math.round(grossTotal).toLocaleString()}
                        </span>
                    </div>

                    {/* Breakdown Box (Scrollable) */}
                    {(itemDiscountsSum > 0 || extraDiscount > 0) && (
                        <div className="bg-red-50/50 rounded-xl p-3 border border-red-100/50 space-y-2">
                            <p className="text-[9px] font-black text-red-600 uppercase flex items-center gap-1">
                                <Tag size={10} /> Discount Breakdown
                            </p>
                            <div className="max-h-24 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                                {cart.map((item: any, idx: number) => Number(item.discount) > 0 && (
                                    <div key={idx} className="flex justify-between text-[10px] items-center">
                                        <span className="text-slate-500 font-medium uppercase">{item.itemCode}</span>
                                        <span className="text-red-600 font-bold">- {Number(item.discount).toLocaleString()}</span>
                                    </div>
                                ))}
                                {extraDiscount > 0 && (
                                    <div className="flex justify-between text-[10px] font-black italic text-red-700 border-t border-red-100 pt-1 mt-1">
                                        <span>OTHERS</span>
                                        <span>- {Number(extraDiscount).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- ADJUSTMENT LAYOUT --- */}
                    <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <FullInput
                                    label="Extra Discount"
                                    value={extraDiscount === 0 ? '' : extraDiscount}
                                    isNumber
                                    placeholder="0"
                                    onChange={(v: any) => setExtraDiscount(Number(v) || 0)}
                                />
                                <Plus size={10} className="absolute right-2 top-8 text-indigo-400" />
                            </div>
                            <div className="relative">
                                <FullInput
                                    label="Exchange Value"
                                    value={exchangeValue === 0 ? '' : exchangeValue}
                                    isNumber
                                    placeholder="0"
                                    onChange={(v: any) => setExchangeValue(Number(v) || 0)}
                                />
                                <Landmark size={10} className="absolute right-2 top-8 text-blue-400" />
                            </div>
                        </div>

                        {/* ADVANCE PAYMENT INPUT */}
                        <div className="relative">
                            <FullInput
                                label="Advance Payment"
                                value={advance === 0 ? '' : advance}
                                isNumber
                                placeholder="0"
                                onChange={(v: any) => setAdvance(Number(v) || 0)}
                            />
                            <Wallet size={12} className="absolute right-3 top-8 text-emerald-500" />
                        </div>
                    </div>

                    {/* --- FINAL TOTALS SECTION --- */}
                    <div className="pt-5 border-t-2 border-dashed border-slate-100 space-y-4">
                        <div className="flex justify-between items-end">
                            {/* Left Side: Summary of Deductions */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">Savings:</p>
                                    <p className="text-[10px] font-black text-slate-900">Rs. {Math.round(discount).toLocaleString()}</p>
                                </div>
                                {advance > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Advance:</p>
                                        <p className="text-[10px] font-black text-slate-900">Rs. {Number(advance).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Net Payable/Balance */}
                            <div className="text-right">
                                <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-1">Net Balance</p>
                                <p className="text-xl font-black text-indigo-600 tracking-tighter leading-none">
                                    Rs. {Math.round(finalTotal).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onPrintFull}
                            disabled={cart.length === 0}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[18px] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Printer size={16} /> Generate Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};