"use client"
import React, { useState } from 'react';
import { Loader2, Search, RefreshCcw, Package } from 'lucide-react'; // Added RefreshCcw for clear session
import { useBilling } from '../hooks/useBilling';
import { FullInput } from './_billing/BillingComponents';
import { SectionHeader } from './_billing/SectionHeader';
import { CartItemCard } from './_billing/CartItemCard';
import { BillingSummary } from './_billing/BillingSummary';
import { PrintInvoice } from './PrintInvoice';

function InvoicePage() {
    const {
        customer, setCustomer, goldRate, setGoldRate,
        discount, itemDiscountsSum, extraDiscount, setExtraDiscount,
        exchangeValue, setExchangeValue,
        advance,
        setAdvance,
        totalAdvance, // ADD THIS: This is the combined sum (Global + Items)
        itemInput, setItemInput, isFetching, cart, fetchItem,
        updateItemDetail, removeItem, calculateItemPrice, calculateAddons,
        finalTotal, clearSession
    } = useBilling();

    const [editId, setEditId] = useState<string | null>(null);
    const [printData, setPrintData] = useState<{ items: any[], isSingle: boolean } | null>(null);

    // Modernized Print Handler
    const handlePrint = (items: any[], isSingle: boolean) => {
        setPrintData({ items, isSingle });

        // Use a slight delay to ensure the PrintInvoice component renders the latest data before the print dialog opens
        setTimeout(() => {
            window.print();

            // Logic for clearing session only after a Full Invoice Print
            if (!isSingle && items.length > 0) {
                setTimeout(() => {
                    if (window.confirm("Invoice generated successfully. Would you like to clear the current bill?")) {
                        clearSession();
                    }
                }, 500);
            }
        }, 200);
    };

    return (
        <>
            {/* Hidden from UI, only visible to the printer */}
            <PrintInvoice
                customer={customer}
                goldRate={goldRate}
                cart={printData?.items || cart}
                discount={printData?.isSingle ? 0 : discount}
                // Pass advanced values to the invoice
                exchangeValue={exchangeValue}
                advance={advance}
                finalTotal={finalTotal}
            />

            <div className="print:hidden min-h-screen bg-[#F8FAFC] p-4 lg:p-8 text-slate-900 antialiased">
                <div className="max-w-350 mx-auto">

                    {/* Header with Gold Rate Control */}
                    <SectionHeader goldRate={goldRate} setGoldRate={setGoldRate} />

                    <div className="flex flex-col lg:flex-row gap-8 items-start mt-8">

                        {/* LEFT COLUMN: Customer Info & Items */}
                        <div className="flex-1 w-full space-y-6">

                            {/* Customer & Search Bar */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                <FullInput
                                    label="Customer Name"
                                    placeholder="Enter Name"
                                    value={customer.name}
                                    onChange={(v) => setCustomer({ ...customer, name: v })}
                                />
                                <FullInput
                                    label="Phone Number"
                                    placeholder="03xx-xxxxxxx"
                                    value={customer.phone}
                                    onChange={(v) => setCustomer({ ...customer, phone: v })}
                                />
                                <form onSubmit={fetchItem} className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Stock Search</label>
                                    <div className="relative group">
                                        <input
                                            className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none uppercase transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                            placeholder="SCAN OR TYPE CODE..."
                                            value={itemInput}
                                            onChange={(e) => setItemInput(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isFetching}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {isFetching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Cart List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Items In Cart ({cart.length})</h2>
                                    {cart.length > 0 && (
                                        <button
                                            onClick={() => { if (confirm("Clear everything?")) clearSession(); }}
                                            className="text-[9px] font-black uppercase text-red-400 hover:text-red-500 flex items-center gap-1.5 transition-colors"
                                        >
                                            <RefreshCcw size={10} /> Clear All
                                        </button>
                                    )}
                                </div>

                                {cart.length === 0 ? (
                                    <div className="h-72 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white/50">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                            <Package size={24} className="text-slate-300" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {cart.map((item, i) => (
                                            <CartItemCard
                                                key={item.id}
                                                item={item}
                                                index={i}
                                                isOpen={editId === item.id}
                                                onToggle={() => setEditId(editId === item.id ? null : item.id)}
                                                onUpdate={updateItemDetail}
                                                onRemove={removeItem}
                                                onPrint={() => handlePrint([item], true)}
                                                itemTotal={calculateItemPrice(item)}
                                                stonesTotal={calculateAddons(item)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Summary & Advanced Billing */}
                        <div className="w-full lg:w-100 sticky top-8">
                            <BillingSummary
                                cart={cart}
                                discount={discount}
                                itemDiscountsSum={itemDiscountsSum}
                                extraDiscount={extraDiscount}
                                setExtraDiscount={setExtraDiscount}
                                exchangeValue={exchangeValue}
                                setExchangeValue={setExchangeValue}
                                advance={advance}
                                setAdvance={setAdvance}
                                finalTotal={finalTotal}
                                onPrintFull={() => handlePrint(cart, false)}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default InvoicePage;