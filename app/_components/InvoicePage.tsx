"use client"
import React, { useState } from 'react';
import { Loader2, Search, RefreshCcw, Package, Sparkles, X } from 'lucide-react';
import { useBilling } from '../hooks/useBilling';
import { useGoldStore } from '../hooks/useGoldStore'; // Adjust path based on your folder structure
import { FullInput } from './_billing/BillingComponents';
import { SectionHeader } from './_billing/SectionHeader';
import { CartItemCard } from './_billing/CartItemCard';
import { BillingSummary } from './_billing/BillingSummary';
import { PrintInvoice } from './PrintInvoice';

function InvoicePage() {
    const {
        customer, setCustomer,
        discount, itemDiscountsSum, extraDiscount, setExtraDiscount,
        exchangeValue, setExchangeValue,
        advance, setAdvance,
        itemInput, setItemInput, isFetching, cart, setCart,
        updateItemDetail, removeItem, calculateItemPrice, calculateAddons,
        finalTotal, clearSession, updateNestedDetail
    } = useBilling();

    // Consume the persistent rate store directly to solve the missing variable errors
    const { rate21ct, rate24ct, ratePalladium, setRatePalladium } = useGoldStore();

    const [editId, setEditId] = useState<string | null>(null);
    const [printData, setPrintData] = useState<{ items: any[], isSingle: boolean } | null>(null);

    // Dialog state handlers for live Palladium interceptions
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingItem, setPendingItem] = useState<any>(null);
    const [tempRate, setTempRate] = useState('');

    // Local loading override for the custom search fetch sequence
    const [localFetching, setLocalFetching] = useState(false);
    const showLoader = isFetching || localFetching;

    // Intercept search submit action to monitor Palladium updates
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = itemInput.trim().toUpperCase();
        if (!query) return;

        setLocalFetching(true);

        try {
            const res = await fetch(`/api/stocks?itemCode=${query}`);
            const data = await res.json();

            if (res.ok) {
                // If it is Palladium and there is no active rate saved on disk yet:
                if (data.metal?.toLowerCase() === 'palladium' && !ratePalladium) {
                    setPendingItem(data);
                    setTempRate('');
                    setIsModalOpen(true);
                    return;
                }

                // Standard item injection fallback
                if (!cart.some(i => i.itemCode === data.itemCode)) {
                    setCart(prev => [{
                        ...data,
                        discount: 0,
                        advance: 0,
                        stoneDetails: data.stoneDetails || [],
                        diamondDetails: data.diamondDetails || []
                    }, ...prev]);
                }
                setItemInput("");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLocalFetching(false);
        }
    };

    const confirmPalladiumRate = () => {
        if (!tempRate) return;

        // 1. Permanently commit the rate to storage for 24 hours
        setRatePalladium(tempRate);

        // 2. Add the item that triggered the interception to the active cart
        if (pendingItem && !cart.some(i => i.itemCode === pendingItem.itemCode)) {
            setCart(prev => [{
                ...pendingItem,
                discount: 0,
                advance: 0,
                stoneDetails: pendingItem.stoneDetails || [],
                diamondDetails: pendingItem.diamondDetails || []
            }, ...prev]);
        }

        // 3. Reset state parameters
        setIsModalOpen(false);
        setPendingItem(null);
        setItemInput("");
    };

    const handlePrint = (items: any[], isSingle: boolean) => {
        setPrintData({ items, isSingle });
        setTimeout(() => {
            window.print();
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
            <PrintInvoice
                customer={customer}
                goldRate={Number(rate24ct) || 0} // Fallback mapping variable for legacy calculation sheets
                cart={printData?.items || cart}
                discount={printData?.isSingle ? 0 : discount}
                exchangeValue={exchangeValue}
                advance={advance}
                finalTotal={finalTotal}
            />

            <div className="print:hidden min-h-screen bg-[#F8FAFC] p-4 lg:p-8 text-slate-900 antialiased">
                <div className="max-w-[1600px] mx-auto">

                    {/* Extracted props: SectionHeader manages internal layout from context hook */}
                    <SectionHeader />

                    <div className="flex flex-col lg:flex-row gap-6 items-start mt-8">

                        {/* LEFT COLUMN: Main panel stream */}
                        <div className="flex-[3] w-full space-y-6">

                            {/* Customer & Search Bar */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <div className="bg-white grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
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
                                    <FullInput
                                        label="Seller Name"
                                        placeholder="Seller name"
                                        value={customer.seller}
                                        onChange={(v) => setCustomer({ ...customer, seller: v })}
                                    />
                                </div>
                                <form onSubmit={handleAddProduct} className="flex flex-col mt-3">
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
                                            disabled={showLoader}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {showLoader ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Cart Item Grid Matrix */}
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
                                                onNestedUpdate={updateNestedDetail}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Summary Actions Panel */}
                        <div className="w-full lg:w-80 sticky top-8 flex-shrink-0">
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

            {/* INTERACTIVE PALLADIUM VALUE PROMPT DIALOGUE */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-100 shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                                <Sparkles size={18} />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                                Rate Required
                            </h3>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            You just scanned a Palladium item (<span className="font-bold text-slate-700">{pendingItem?.itemCode}</span>). Please specify the active market evaluation per carat below.
                        </p>

                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center mb-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-4">Rate / Ct</span>
                            <div className="flex items-center gap-1 border-l pl-4 flex-1">
                                <span className="text-amber-600 font-bold text-xs">Rs.</span>
                                <input
                                    type="number"
                                    autoFocus
                                    placeholder="Enter valuation rate"
                                    value={tempRate}
                                    onChange={(e) => setTempRate(e.target.value)}
                                    className="bg-transparent font-bold text-slate-800 outline-none w-full text-sm"
                                />
                            </div>
                        </div>

                        <button
                            onClick={confirmPalladiumRate}
                            disabled={!tempRate}
                            className="w-full py-2.5 bg-slate-900 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold tracking-widest uppercase shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800"
                        >
                            Confirm & Add To Cart
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default InvoicePage;