"use client"
import React, { useState } from 'react';
import { Loader2, Search, Printer } from 'lucide-react';
import { useBilling, CartItem } from '../hooks/useBilling';
import { FullInput } from './_billing/BillingComponents';
import { PrintInvoice } from './PrintInvoice';

// Internal Components
import { SectionHeader } from './_billing/SectionHeader';
import { CartItemCard } from './_billing/CartItemCard';
import { BillingSummary } from './_billing/BillingSummary';

export default function BillingPage() {
    const {
        customer, setCustomer, goldRate, setGoldRate,
        discount, setDiscount,
        exchangeValue, setExchangeValue,
        itemInput, setItemInput, isFetching, cart, fetchItem,
        updateItemDetail, removeItem, calculateItemPrice, calculateAddons,
        subTotal, finalTotal,
        clearSession // <--- 1. Pull this from your updated useBilling hook
    } = useBilling();

    const [editId, setEditId] = useState<string | null>(null);
    const [printData, setPrintData] = useState<{
        items: CartItem[];
        isSingle: boolean;
    } | null>(null);

    // 2. Modified handlePrint to handle session clearing
    const handlePrint = (items: CartItem[], isSingle: boolean) => {
        setPrintData({ items, isSingle });

        setTimeout(() => {
            window.print();

            // Logic: If it was a Full Invoice (not single item), ask to clear
            if (!isSingle && items.length > 0) {
                // We use a slight delay so the confirm box doesn't block the print stream
                setTimeout(() => {
                    const confirmClear = window.confirm(
                        "Invoice generated. Would you like to clear the current bill and start fresh?"
                    );
                    if (confirmClear) {
                        clearSession();
                    }
                }, 500);
            }
        }, 150);
    };

    return (
        <>
            <PrintInvoice
                customer={customer}
                goldRate={goldRate}
                cart={printData?.items || cart}
                discount={printData?.isSingle ? 0 : discount}
            />

            <div className="print:hidden min-h-screen bg-[#F8FAFC] p-4 lg:p-6 text-slate-900 antialiased">
                <div className="max-w-350 mx-auto">
                    <SectionHeader goldRate={goldRate} setGoldRate={setGoldRate} />

                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <div className="flex-1 w-full space-y-6">
                            {/* Customer & Search Bar */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                                <FullInput
                                    label="Customer Name"
                                    value={customer.name}
                                    onChange={(v) => setCustomer({ ...customer, name: v })}
                                    placeholder="Name"
                                />
                                <FullInput
                                    label="Phone"
                                    value={customer.phone}
                                    onChange={(v) => setCustomer({ ...customer, phone: v })}
                                    placeholder="Contact"
                                />
                                <form onSubmit={fetchItem} className="flex flex-col">
                                    <label className="text-[9px] font-black uppercase text-slate-400 mb-1.5 block">
                                        Stock Search
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full py-2 px-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none uppercase"
                                            placeholder="ITEM CODE"
                                            value={itemInput}
                                            onChange={(e) => setItemInput(e.target.value)}
                                        />
                                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            {isFetching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Dynamic Cart Items List */}
                            <div className="space-y-4">
                                {cart.length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl opacity-40">
                                        <p className="text-[10px] font-black uppercase tracking-widest">No items in bill</p>
                                    </div>
                                ) : (
                                    cart.map((item, i) => (
                                        <CartItemCard
                                            key={item.id}
                                            item={item}
                                            index={i}
                                            // This ensures only the item matching editId is "Open"
                                            isOpen={editId === item.id}
                                            onToggle={() => setEditId(editId === item.id ? null : item.id)}
                                            onUpdate={updateItemDetail}
                                            onRemove={removeItem}
                                            onPrint={() => handlePrint([item], true)}
                                            itemTotal={calculateItemPrice(item)}
                                            stonesTotal={calculateAddons(item)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        <BillingSummary
                            discount={discount}
                            setDiscount={setDiscount}
                            exchangeValue={exchangeValue}
                            setExchangeValue={setExchangeValue}
                            finalTotal={finalTotal}
                            onPrintFull={() => handlePrint(cart, false)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}