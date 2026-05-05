"use client"
import { useMemo } from 'react';
import { Tag, Printer, ReceiptText, Wallet, CheckCircle2 } from 'lucide-react';
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

    // 1. CALCULATE SUM DIRECTLY FROM CART 
    const currentItemAdvancesSum = useMemo(() => {
        return cart.reduce((sum: number, item: any) => sum + (Number(item.advance) || 0), 0);
    }, [cart]);

    // 2. COMBINE WITH GLOBAL ADVANCE
    const combinedTotalAdvance = currentItemAdvancesSum + Number(advance || 0);

    // 3. RE-CALCULATE GROSS TOTAL
    const grossTotal = Number(finalTotal) + Number(discount || 0) + Number(exchangeValue || 0) + combinedTotalAdvance;

    return (
        <div className="w-full lg:w-80 sticky top-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">

                {/* SUBTLE HEADER WITH ITEM COUNT */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ReceiptText size={16} className="text-slate-400" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Bill Details</h2>
                    </div>
                    {/* RESTORED ITEM COUNT */}
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-lg border border-indigo-100/50">
                        {cart.length} {cart.length === 1 ? 'ITEM' : 'ITEMS'}
                    </span>
                </div>

                <div className="p-6 space-y-5">
                    {/* TOTAL CALCULATIONS */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-tight px-1">
                            <span>Gross Total</span>
                            <span>Rs. {Math.round(grossTotal).toLocaleString()}</span>
                        </div>

                        {/* DISCOUNTS SECTION */}
                        {(itemDiscountsSum > 0 || extraDiscount > 0) && (
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                                <p className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                                    <Tag size={10} className="text-rose-400" /> Savings
                                </p>
                                <div className="space-y-1">
                                    {cart.map((item: any, idx: number) => Number(item.discount) > 0 && (
                                        <div key={idx} className="flex justify-between text-[10px] text-slate-500">
                                            <span className="font-medium">{item.itemCode}</span>
                                            <span className="text-rose-500">- {Number(item.discount).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {extraDiscount > 0 && (
                                        <div className="flex justify-between text-[10px] text-rose-700 font-bold border-t border-rose-100 pt-1">
                                            <span>Extra Disc</span>
                                            <span>- {extraDiscount.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ADVANCE SECTION (Itemized Features) */}
                        {combinedTotalAdvance > 0 && (
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                                <p className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                                    <Wallet size={10} className="text-emerald-400" /> Advance Payments
                                </p>
                                <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                    {/* Itemized Advances */}
                                    {cart.map((item: any, idx: number) => Number(item.advance) > 0 && (
                                        <div key={idx} className="flex justify-between text-[10px] text-slate-500">
                                            <span className="font-medium">{item.itemCode}</span>
                                            <span>- {Number(item.advance).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {/* Global Cash Advance */}
                                    {Number(advance) > 0 && (
                                        <div className="flex justify-between text-[10px] text-slate-500 italic">
                                            <span>Global Cash</span>
                                            <span>- {Number(advance).toLocaleString()}</span>
                                        </div>
                                    )}
                                    {/* Sub-total for Advances */}
                                    <div className="flex justify-between text-[10px] text-emerald-700 font-bold border-t border-emerald-100 pt-1 mt-1">
                                        <span>Total Received</span>
                                        <span>Rs. {combinedTotalAdvance.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MANUAL INPUTS */}
                    <div className="space-y-4 pt-2">
                        <FullInput
                            label="Extra Discount"
                            value={extraDiscount === 0 ? '' : extraDiscount}
                            isNumber
                            placeholder="Enter amount..."
                            onChange={(v: any) => setExtraDiscount(Number(v) || 0)}
                        />
                        <FullInput
                            label="Manual Advance"
                            value={advance === 0 ? '' : advance}
                            isNumber
                            placeholder="Enter amount..."
                            onChange={(v: any) => setAdvance(Number(v) || 0)}
                        />
                    </div>

                    {/* NET PAYABLE - MINIMALIST DESIGN */}
                    <div className="mt-6 p-5 bg-indigo-50/40 rounded-2xl border border-indigo-100/50 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Net Balance Due</span>
                        <div className="text-2xl font-black text-indigo-900 tracking-tight">
                            Rs. {Math.round(finalTotal).toLocaleString()}
                        </div>
                    </div>

                    {/* PRINT BUTTON - AT THE BOTTOM */}
                    <div className="pt-2">
                        <button
                            onClick={onPrintFull}
                            disabled={cart.length === 0}
                            className="w-full flex items-center justify-center gap-3 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-slate-200 disabled:opacity-30 disabled:shadow-none"
                        >
                            <Printer size={16} />
                            Generate & Print Invoice
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <CheckCircle2 size={10} className="text-emerald-400" />
                        Ready to process
                    </div>
                </div>
            </div>
        </div>
    );
};