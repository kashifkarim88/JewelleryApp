"use client"
import React, { useState } from 'react';
import { Search, Printer, Loader2, Gem, CircleDot, Sparkles, Trash2, Box, Edit3, Check, User, ChevronDown } from 'lucide-react';
import { useBilling, CartItem } from '../hooks/useBilling';
import { FullInput } from './_billing/BillingComponents';
import { PrintInvoice } from './PrintInvoice';

interface CollapsibleProps {
    icon: React.ElementType;
    title: string;
    color: 'cyan' | 'blue' | 'purple';
    children: React.ReactNode;
}

const CollapsibleSection = ({ icon: Icon, title, color, children }: CollapsibleProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const colorMap: Record<string, string> = {
        cyan: "text-cyan-600 bg-cyan-50 border-cyan-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        purple: "text-purple-600 bg-purple-50 border-purple-100"
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-2 transition-all">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-md border ${colorMap[color]}`}>
                        <Icon size={12} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">{title}</span>
                </div>
                <ChevronDown size={12} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-150 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="p-3 pt-0 border-t border-slate-50">{children}</div>
            </div>
        </div>
    );
};

export default function BillingPage() {
    const {
        customer, setCustomer, goldRate, setGoldRate, discount, setDiscount,
        itemInput, setItemInput, isFetching, cart, fetchItem,
        updateItemDetail, removeItem, calculateItemPrice, calculateAddons, subTotal, finalTotal
    } = useBilling();

    const [editId, setEditId] = useState<string | null>(null);

    const [printData, setPrintData] = useState<{
        items: CartItem[];
        isSingle: boolean;
    } | null>(null);

    const handlePrint = (items: CartItem[], isSingle: boolean) => {
        setPrintData({ items, isSingle });
        setTimeout(() => {
            window.print();
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

                    <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Billing Dashboard</h1>
                            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">Hamidullah Jewellery</p>
                        </div>
                        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center shadow-sm">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-4">Gold Rate</span>
                            <div className="flex items-center gap-1.5 border-l border-slate-100 pl-4">
                                <span className="text-amber-600 font-bold text-xs">Rs.</span>

                                <input
                                    type="number"
                                    className="bg-transparent font-black text-slate-800 outline-none w-24 text-sm"
                                    value={goldRate}
                                    onChange={(e) => setGoldRate(e.target.value === '' ? 0 : Number(e.target.value))}
                                    onFocus={(e) => { if (goldRate === 0) e.target.value = ''; }}
                                    onBlur={(e) => { if (e.target.value === '') setGoldRate(0); }}
                                />
                            </div>
                        </div>
                    </header>

                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <div className="flex-1 w-full space-y-6">
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

                            {cart.map((item, i) => {
                                const isEditing = editId === item.id;
                                const itemTotal = calculateItemPrice(item);
                                const stonesTotal = calculateAddons(item);

                                // Added Wastage Grams Calculation
                                const wastageGrams = (Number(item.netWeight || 0) * Number(item.wastagePercent || 0)) / 100;

                                const hasDiamonds = item.diamondDetails && (item.diamondDetails.name || item.diamondDetails.price || item.diamondDetails.weight);
                                const hasStones = item.stoneDetails && (item.stoneDetails.name || item.stoneDetails.price || item.stoneDetails.weight);
                                const hasBeads = item.beadDetails && (item.beadDetails.price || item.beadDetails.weight);

                                return (
                                    <div key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all">
                                        <div className="w-full md:w-64 bg-slate-50/50 p-5 border-r border-slate-100">
                                            <button onClick={() => setEditId(isEditing ? null : item.id)} className={`w-full py-2.5 mb-1 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${isEditing ? "bg-green-600 border-green-700 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                                                {isEditing ? <><Check size={12} /> Save Changes</> : <><Edit3 size={12} /> Edit Details</>}
                                            </button>
                                            <div className="w-full aspect-square bg-white rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden mb-4 shadow-inner">
                                                {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" alt="jewelry" /> : <Box size={24} className="opacity-10" />}
                                            </div>

                                            <div className="space-y-2">
                                                {hasDiamonds && (
                                                    <CollapsibleSection icon={Sparkles} title="Diamonds" color="cyan">
                                                        <div className="space-y-3 mt-1">
                                                            <FullInput label="Diamond Name" disabled={!isEditing} value={item.diamondDetails?.name || ''} onChange={(v) => updateItemDetail(i, 'diamondDetails', 'name', v)} />
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <FullInput label="Weight (ct)" disabled={!isEditing} value={item.diamondDetails?.weight} isNumber onChange={(v) => updateItemDetail(i, 'diamondDetails', 'weight', v)} />
                                                                <FullInput label="Rate" disabled={!isEditing} value={item.diamondDetails?.rate} isNumber onChange={(v) => updateItemDetail(i, 'diamondDetails', 'rate', v)} />
                                                                <FullInput label="Total Price" disabled={!isEditing} value={item.diamondDetails?.price} isNumber onChange={(v) => updateItemDetail(i, 'diamondDetails', 'price', v)} />
                                                            </div>
                                                        </div>
                                                    </CollapsibleSection>
                                                )}

                                                {hasStones && (
                                                    <CollapsibleSection icon={Gem} title="Stones" color="blue">
                                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                                            <FullInput label="Weight" disabled={!isEditing} value={item.stoneDetails?.weight} isNumber onChange={(v) => updateItemDetail(i, 'stoneDetails', 'weight', v)} />
                                                            <FullInput label="Price" disabled={!isEditing} value={item.stoneDetails?.price} isNumber onChange={(v) => updateItemDetail(i, 'stoneDetails', 'price', v)} />
                                                        </div>
                                                    </CollapsibleSection>
                                                )}

                                                {hasBeads && (
                                                    <CollapsibleSection icon={CircleDot} title="Beads" color="purple">
                                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                                            <FullInput label="Weight" disabled={!isEditing} value={item.beadDetails?.weight} isNumber onChange={(v) => updateItemDetail(i, 'beadDetails', 'weight', v)} />
                                                            <FullInput label="Price" disabled={!isEditing} value={item.beadDetails?.price} isNumber onChange={(v) => updateItemDetail(i, 'beadDetails', 'price', v)} />
                                                        </div>
                                                    </CollapsibleSection>
                                                )}
                                            </div>

                                            <button onClick={() => removeItem(i)} className="w-full mt-4 text-[9px] font-black text-red-400 hover:text-red-500 uppercase flex items-center justify-center gap-1.5">
                                                <Trash2 size={12} /> Remove Item
                                            </button>
                                        </div>

                                        <div className="flex-1 p-6 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-8">
                                                    <div>
                                                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">{item.categoryName}</h3>
                                                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded border border-blue-100 uppercase tracking-widest">{item.itemCode}</span>
                                                    </div>
                                                    <div className="group flex flex-col items-center justify-center py-3 px-6 bg-linear-to-b from-white to-slate-50 border border-slate-200 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-indigo-100 hover:border-indigo-200 hover:-translate-y-0.5 relative overflow-hidden">

                                                        {/* Subtle Animated Shimmer Beam */}
                                                        <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-indigo-50/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />

                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 relative z-10">
                                                            Item Total
                                                        </p>

                                                        <div className="flex items-center gap-1.5 relative z-10">
                                                            <span className="text-[10px] font-black text-indigo-500">Rs.</span>
                                                            <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none bg-linear-to-tr from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
                                                                {Math.round(itemTotal).toLocaleString()}
                                                            </p>
                                                        </div>

                                                        {/* Bottom Accent Glow */}
                                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-linear-to-r from-transparent via-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                                    <div className="space-y-6">
                                                        <FullInput label="Net Weight (G)" disabled={!isEditing} value={item.netWeight} isNumber onChange={(v) => updateItemDetail(i, 'netWeight', '', v)} />
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FullInput label="Wastage (%)" disabled={!isEditing} value={item.wastagePercent} isNumber onChange={(v) => updateItemDetail(i, 'wastagePercent', '', v)} />
                                                            {/* Added Wastage (G) Display */}
                                                            <FullInput label="Wastage (G)" disabled value={wastageGrams.toFixed(3)} isNumber onChange={() => { }} />
                                                        </div>
                                                        <FullInput label="Gold Purity" disabled={!isEditing} value={item.carat} onChange={(v) => updateItemDetail(i, 'carat', '', v)} />
                                                    </div>
                                                    <div className="space-y-6">
                                                        <FullInput label="Making / Labour Charges" disabled={!isEditing} value={item.making} isNumber onChange={(v) => updateItemDetail(i, 'making', '', v)} />
                                                        <FullInput label="Stones Total" disabled value={stonesTotal} isNumber onChange={() => { }} />
                                                        <FullInput label="Assigned Worker" disabled={!isEditing} value={item.workerName} onChange={(v) => updateItemDetail(i, 'workerName', '', v)} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-200">
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Master Craftsman</p>
                                                        <p className="text-xs font-black text-slate-700">{item.workerName || 'Factory'}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handlePrint([item], true)} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">
                                                    <Printer size={14} /> Print This Item
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* SUMMARY PANEL (Light Modern Theme) */}
                        <div className="w-full lg:w-80 lg:sticky lg:top-6">
                            <div className="bg-white rounded-4xl p-6 text-slate-900 border border-slate-200 shadow-xl shadow-slate-200/50">
                                <div className="flex items-center justify-center gap-2 mb-8">
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                    <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Bill Summary</h2>
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block text-center">Discount Amount</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xl font-black text-center text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                                value={discount}
                                                onChange={(e) => setDiscount(e.target.value === '' ? 0 : Number(e.target.value))}
                                                onFocus={(e) => { if (discount === 0) e.target.value = ''; }}
                                                onBlur={(e) => { if (e.target.value === '') setDiscount(0); }}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <span className="text-[10px] font-black text-slate-300">PKR</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-8 bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl flex flex-col items-center border border-slate-800 shadow-lg relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 pointer-events-none"></div>

                                        <p className="text-[9px] font-black uppercase text-indigo-300/80 mb-1 tracking-widest">Total Payable</p>
                                        <div className="flex items-start gap-1">
                                            <span className="text-white/40 text-[10px] font-bold mt-1.5">Rs.</span>
                                            <p className="text-3xl font-black text-white tracking-tight leading-none">
                                                {Math.round(finalTotal).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handlePrint(cart, false)}
                                        className="w-full bg-indigo-600 text-white h-14 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95 border-b-4 border-indigo-800"
                                    >
                                        Print Full Invoice <Printer size={16} />
                                    </button>

                                    <div className="pt-2">
                                        <p className="text-[8px] font-bold text-slate-300 uppercase text-center tracking-[0.2em]">
                                            Hamid Ullah Jewellery
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}