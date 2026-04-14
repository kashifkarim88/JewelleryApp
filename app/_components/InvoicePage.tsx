"use client"
import React, { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
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
        advance, setAdvance, // <-- Added these two from useBilling
        itemInput, setItemInput, isFetching, cart, fetchItem,
        updateItemDetail, removeItem, calculateItemPrice, calculateAddons,
        finalTotal, clearSession
    } = useBilling();

    const [editId, setEditId] = useState<string | null>(null);
    const [printData, setPrintData] = useState<{ items: any[], isSingle: boolean } | null>(null);

    const handlePrint = (items: any[], isSingle: boolean) => {
        setPrintData({ items, isSingle });
        setTimeout(() => {
            window.print();
            if (!isSingle && items.length > 0) {
                setTimeout(() => {
                    if (window.confirm("Invoice generated. Clear current bill?")) {
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
                    <div className="flex flex-col lg:flex-row gap-6 items-start mt-6">
                        <div className="flex-1 w-full space-y-6">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                                <FullInput
                                    label="Customer Name"
                                    value={customer.name}
                                    onChange={(v) => setCustomer({ ...customer, name: v })}
                                />
                                <FullInput
                                    label="Phone"
                                    value={customer.phone}
                                    onChange={(v) => setCustomer({ ...customer, phone: v })}
                                />
                                <form onSubmit={fetchItem} className="flex flex-col">
                                    <label className="text-[9px] font-black uppercase text-slate-400 mb-1.5 block">Stock Search</label>
                                    <div className="relative">
                                        <input
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

                            <div className="space-y-4">
                                {cart.length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl opacity-40">
                                        <p className="text-[10px] font-black uppercase tracking-widest">No items added</p>
                                    </div>
                                ) : (
                                    cart.map((item, i) => (
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
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Updated BillingSummary with advance props */}
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
        </>
    );
}

export default InvoicePage;