"use client";

import React, { useState, useTransition } from 'react';
import { Loader2, Search, RefreshCcw, Package, AlertCircle } from 'lucide-react';
import { useBilling, CartItem } from '../hooks/useBilling';
import { useGoldStore } from '../hooks/useGoldStore';
import { FullInput } from './_billing/BillingComponents';
import { SectionHeader } from './_billing/SectionHeader';
import { CartItemCard } from './_billing/CartItemCard';
import { BillingSummary } from './_billing/BillingSummary';
import { PrintInvoice } from './PrintInvoice';
import DynamicMetalRateModal from './_billing/billingmodels/DynamicMetalRateModal';

// --- Interfaces for API & State Management ---
interface StockItem {
    id: string;
    itemCode: string;
    metal?: string;
    carat?: string;
    stoneDetails?: any[];
    diamondDetails?: any[];
    categoryName?: string;
    netWeight?: string | number;
    wastagePercent?: string | number;
    making?: string | number;
    [key: string]: any;
}

interface RateTarget {
    key: '21ct' | '24ct' | '22ct' | '20ct' | '18ct' | '14ct' | 'palladium' | 'silver' | 'platinum';
    label: string;
}

interface PrintConfig {
    items: CartItem[];
    isSingle: boolean;
}

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

    const {
        rate21ct, rate24ct, rate22ct, rate20ct, rate18ct, rate14ct,
        ratePalladium, rateSilver, ratePlatinum, setRate21ct, setRate24ct,
        setRate22ct, setRate20ct, setRate18ct, setRate14ct,
        setRatePalladium, setRateSilver, setRatePlatinum
    } = useGoldStore();

    // --- State Operations ---
    const [editId, setEditId] = useState<string | null>(null);
    const [printData, setPrintData] = useState<PrintConfig | null>(null);
    const [isPending, startTransition] = useTransition();

    // Dynamic dialog configurations
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingItem, setPendingItem] = useState<StockItem | null>(null);
    const [tempRate, setTempRate] = useState('');
    const [rateTarget, setRateTarget] = useState<RateTarget | null>(null);

    // Error and inline UX warning tracking
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [localFetching, setLocalFetching] = useState(false);

    const showLoader = isFetching || localFetching || isPending;

    /**
     * Intercepts material metadata rulesets to verify required gold/metal market rates exist.
     * Fixes a critical labeling bug regarding 24ct mapping structures.
     */
    const checkAndInterceptRate = (data: StockItem): RateTarget | null => {
        const metal = data.metal?.trim().toLowerCase() || 'gold';
        const carat = data.carat?.trim().toLowerCase() || '';

        switch (metal) {
            case 'palladium':
                if (!ratePalladium) return { key: 'palladium', label: 'Palladium' };
                break;
            case 'silver':
                if (!rateSilver) return { key: 'silver', label: 'Silver' };
                break;
            case 'platinum':
                if (!ratePlatinum) return { key: 'platinum', label: 'Platinum' };
                break;
            default:
                if (metal === 'gold' || metal.includes('gold')) {
                    if (carat.includes('24') && !rate24ct) return { key: '24ct', label: '24ct Gold' };
                    if (carat.includes('22') && !rate22ct) return { key: '22ct', label: '22ct Gold' };
                    if (carat.includes('21') && !rate21ct) return { key: '21ct', label: '21ct Gold' };
                    if (carat.includes('20') && !rate20ct) return { key: '20ct', label: '20ct Gold' };
                    if (carat.includes('18') && !rate18ct) return { key: '18ct', label: '18ct Gold' };
                    if (carat.includes('14') && !rate14ct) return { key: '14ct', label: '14ct Gold' };
                }
                break;
        }
        return null;
    };

    /**
     * Inserts formatting configurations safely into state contexts inside concurrent steps.
     */
    const insertItemToCart = (itemData: StockItem) => {
        if (cart.some(i => i.itemCode === itemData.itemCode)) {
            setErrorMessage(`Item code "${itemData.itemCode}" is already in your cart.`);
            setItemInput("");
            return;
        }

        // Combine API data with mandatory CartItem defaults
        const formattedItem: CartItem = {
            ...itemData,
            id: itemData.id || `${itemData.itemCode}-${Date.now()}`,

            // 🌟 FIX: Provide explicit production fallbacks for optional strings 
            // to ensure they are never evaluated as 'undefined'
            metal: itemData.metal || 'Gold',
            carat: itemData.carat || '21ct',

            categoryName: itemData.categoryName || 'Unknown Category',
            netWeight: Number(itemData.netWeight) || 0,
            wastagePercent: Number(itemData.wastagePercent) || 0,
            making: Number(itemData.making) || 0,

            discount: 0,
            advance: 0,
            stoneDetails: itemData.stoneDetails || [],
            diamondDetails: itemData.diamondDetails || []
        };

        startTransition(() => {
            setCart([formattedItem, ...cart]);
        });
        setItemInput("");
    };

    /**
     * Async stock ingestion query loop tracking HTTP exception configurations natively.
     */
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = itemInput.trim().toUpperCase();
        if (!query) return;

        setLocalFetching(true);
        setErrorMessage(null);

        try {
            const res = await fetch(`/api/stocks?itemCode=${encodeURIComponent(query)}`);

            if (res.status === 404) {
                setErrorMessage(`Stock item matching code "${query}" could not be found.`);
                return;
            }
            if (!res.ok) {
                throw new Error(`Server returned unexpected error state status: ${res.status}`);
            }

            const data: StockItem = await res.json();

            if (!data || Object.keys(data).length === 0) {
                setErrorMessage(`Received invalid or corrupted stock object metadata records for "${query}".`);
                return;
            }

            const target = checkAndInterceptRate(data);
            if (target) {
                setPendingItem(data);
                setRateTarget(target);
                setTempRate('');
                setIsModalOpen(true);
                return;
            }

            insertItemToCart(data);
        } catch (err) {
            console.error('[STOCK_FETCH_EXCEPTION]:', err);
            setErrorMessage("Network error: Failed to fetch item. Please check your connection or contact IT support.");
        } finally {
            setLocalFetching(false);
        }
    };

    const confirmDynamicRate = () => {
        if (!tempRate || !rateTarget?.key) return;

        const dynamicRateValue = tempRate.trim();

        switch (rateTarget.key) {
            case '21ct': setRate21ct(dynamicRateValue); break;
            case '24ct': setRate24ct(dynamicRateValue); break;
            case '22ct': setRate22ct(dynamicRateValue); break;
            case '20ct': setRate20ct(dynamicRateValue); break;
            case '18ct': setRate18ct(dynamicRateValue); break;
            case '14ct': setRate14ct(dynamicRateValue); break;
            case 'palladium': setRatePalladium(dynamicRateValue); break;
            case 'silver': setRateSilver(dynamicRateValue); break;
            case 'platinum': setRatePlatinum(dynamicRateValue); break;
        }

        if (pendingItem) {
            insertItemToCart(pendingItem);
        }

        setIsModalOpen(false);
        setPendingItem(null);
        setRateTarget(null);
    };

    const handlePrint = (items: CartItem[], isSingle: boolean) => {
        setPrintData({ items, isSingle });
        setTimeout(() => {
            window.print();
            if (!isSingle && items.length > 0) {
                setTimeout(() => {
                    if (window.confirm("Invoice generated successfully. Would you like to clear the current bill session parameters?")) {
                        clearSession();
                        setErrorMessage(null);
                    }
                }, 500);
            }
        }, 200);
    };

    return (
        <>
            <PrintInvoice
                customer={customer}
                cart={(printData?.items || cart).map((item) => ({
                    ...item,
                    itemTotal: calculateItemPrice(item),
                    stonesTotal: calculateAddons(item)
                }))}
                discount={printData?.isSingle ? 0 : discount}
                exchangeValue={exchangeValue}
                advance={advance}
                finalTotal={finalTotal}
            />

            <div className="print:hidden min-h-screen bg-[#F8FAFC] p-4 lg:p-8 text-slate-900 antialiased">
                <div className="max-w-[1600px] mx-auto">
                    <SectionHeader />

                    <div className="flex flex-col lg:flex-row gap-6 items-start mt-8">
                        {/* LEFT COLUMN: Input Control Interface Panel Stream */}
                        <div className="flex-[3] w-full space-y-6">

                            {/* Customer Profile & Search Component Forms */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                    <FullInput
                                        label="Customer Name"
                                        placeholder="Enter Name"
                                        value={customer.name}
                                        onChange={(v) => setCustomer({ name: v })}
                                    />
                                    <FullInput
                                        label="Phone Number"
                                        placeholder="03xx-xxxxxxx"
                                        value={customer.phone}
                                        onChange={(v) => setCustomer({ phone: v })}
                                    />
                                    <FullInput
                                        label="Seller Name"
                                        placeholder="Seller name"
                                        value={customer.seller}
                                        onChange={(v) => setCustomer({ seller: v })}
                                    />
                                </div>

                                <form onSubmit={handleAddProduct} className="flex flex-col mt-4">
                                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">
                                        Stock Search
                                    </label>
                                    <div className="relative group">
                                        <input
                                            className={`w-full py-2.5 px-4 bg-slate-50 border ${errorMessage ? 'border-red-300 focus:border-red-500 focus:ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-50'} rounded-xl text-xs font-bold outline-none uppercase transition-all focus:bg-white focus:ring-4`}
                                            placeholder="SCAN OR TYPE CODE..."
                                            value={itemInput}
                                            disabled={showLoader}
                                            onChange={(e) => {
                                                setItemInput(e.target.value);
                                                if (errorMessage) setErrorMessage(null);
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={showLoader}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
                                        >
                                            {showLoader ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                        </button>
                                    </div>
                                </form>

                                {/* UX Alert Warning Prompt Area Container */}
                                {errorMessage && (
                                    <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 animate-fadeIn">
                                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 text-xs font-semibold leading-relaxed">
                                            {errorMessage}
                                        </div>
                                        <button
                                            onClick={() => setErrorMessage(null)}
                                            className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Cart Item Grid Matrix Layout Container */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        Items In Cart ({cart.length})
                                    </h2>
                                    {cart.length > 0 && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to drop all active item allocations?")) {
                                                    clearSession();
                                                    setErrorMessage(null);
                                                }
                                            }}
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
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            Cart is empty
                                        </p>
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

                        {/* RIGHT COLUMN: Total Summary Operations Controller Dock */}
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

            {/* DYNAMIC METALS RATE MODAL PORTAL */}
            {isModalOpen && rateTarget && (
                <DynamicMetalRateModal
                    isOpen={isModalOpen}
                    tempRate={tempRate}
                    pendingItem={pendingItem}
                    rateLabel={rateTarget.label}
                    setTempRate={setTempRate}
                    onClose={() => {
                        setIsModalOpen(false);
                        setPendingItem(null);
                        setRateTarget(null);
                    }}
                    onConfirm={confirmDynamicRate}
                />
            )}
        </>
    );
}

export default InvoicePage;