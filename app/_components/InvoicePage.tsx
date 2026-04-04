"use client"
import React, { useState } from 'react';
import {
    Search, Printer, Loader2, Gem, CircleDot,
    Sparkles, ShoppingCart, Trash2, Box, Edit3, Check, User
} from 'lucide-react';
import { useBilling } from '../hooks/useBilling';
import { ReadOnlyStat, FullInput, DetailBox } from './_billing/BillingComponents';
import { PrintInvoice } from './PrintInvoice';

export default function BillingPage() {
    const {
        customer, setCustomer, goldRate, setGoldRate, discount, setDiscount,
        itemInput, setItemInput, isFetching, cart, fetchItem,
        updateItemDetail, removeItem, subTotal, finalTotal
    } = useBilling();

    const [editId, setEditId] = useState<string | null>(null);

    return (
        <>
            {/* 1. PRINT LAYER */}
            <PrintInvoice
                customer={customer}
                goldRate={goldRate}
                cart={cart}
                discount={discount}
            />

            {/* 2. DASHBOARD LAYER */}
            <div className="print:hidden min-h-screen bg-[#FDFDFD] p-4 lg:p-8 text-slate-900 antialiased">
                <div className="max-w-[1500px] mx-auto">

                    {/* HEADER */}
                    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Sales Billing</h1>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Modern Inventory System</p>
                        </div>
                        <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-2xl flex items-center gap-4 shadow-sm">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gold Rate (Tola)</span>
                            <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                                <span className="text-amber-600 font-bold text-xs">Rs.</span>
                                <input type="number" className="bg-transparent font-black text-slate-800 outline-none w-28 text-base" value={goldRate} onChange={(e) => setGoldRate(Number(e.target.value))} />
                            </div>
                        </div>
                    </header>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        <div className="flex-1 w-full space-y-6">
                            {/* SEARCH SECTION */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FullInput label="Customer Name" value={customer.name} onChange={(v) => setCustomer({ ...customer, name: v })} placeholder="Name" />
                                <FullInput label="Phone" value={customer.phone} onChange={(v) => setCustomer({ ...customer, phone: v })} placeholder="Contact" />
                                <form onSubmit={fetchItem}>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block ml-1">Stock Search</label>
                                    <div className="relative">
                                        <input type="text" className="w-full py-2.5 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500 transition-all uppercase" placeholder="Enter Code..." value={itemInput} onChange={(e) => setItemInput(e.target.value)} />
                                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            {isFetching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* CART ITEMS */}
                            <div className="space-y-6">
                                {cart.length === 0 ? (
                                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl py-20 flex flex-col items-center text-slate-400 uppercase font-black text-[10px] tracking-widest">
                                        <ShoppingCart size={32} className="mb-2 opacity-10" /> No Items in Cart
                                    </div>
                                ) : (
                                    cart.map((item, i) => {
                                        const isEditing = editId === item.id;
                                        return (
                                            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden border-l-4 border-l-blue-500 flex flex-col md:flex-row">

                                                {/* SIDEBAR: PHOTO & CORE STATS */}
                                                <div className="w-full md:w-72 bg-slate-50/50 p-6 border-b md:border-b-0 md:border-r border-slate-100">
                                                    <button
                                                        onClick={() => setEditId(isEditing ? null : item.id)}
                                                        className={`w-full mb-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2 shadow-sm ${isEditing ? "bg-green-600 border-green-700 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        {isEditing ? <><Check size={14} /> Save Changes</> : <><Edit3 size={14} /> Edit Details</>}
                                                    </button>

                                                    <div className="w-full aspect-square bg-slate-200 rounded-xl mb-4 flex items-center justify-center border border-slate-200 overflow-hidden">
                                                        {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <Box size={32} className="opacity-10" />}
                                                    </div>

                                                    <h3 className="text-lg font-black text-slate-800 uppercase leading-tight">{item.categoryName}</h3>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em]">{item.itemCode}</span>
                                                        {item.productCode && <span className="text-[10px] font-bold text-slate-300">/ {item.productCode}</span>}
                                                    </div>

                                                    <div className="space-y-2.5">
                                                        <ReadOnlyStat label="Net Weight" value={item.netWeight} unit="g" />
                                                        <ReadOnlyStat label="Wastage (%)" value={item.wastagePercent} unit="%" />
                                                        <ReadOnlyStat label="Wastage (g)" value={item.wastageGram} unit="g" />
                                                        <ReadOnlyStat label="Purity" value={item.carat} />
                                                        <ReadOnlyStat label="Labour" value={item.making?.toLocaleString()} unit="Rs" />
                                                    </div>

                                                    {/* WORKER DETAILS SECTION */}
                                                    <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                            <User size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] font-bold text-slate-400 uppercase">Crafted By</p>
                                                            <p className="text-[10px] font-black text-slate-700">{item.workerName || 'Not Assigned'}</p>
                                                        </div>
                                                    </div>

                                                    <button onClick={() => removeItem(i)} className="mt-8 flex items-center gap-2 text-[10px] font-black text-red-400 hover:text-red-600 uppercase transition-colors">
                                                        <Trash2 size={12} /> Remove Item
                                                    </button>
                                                </div>

                                                {/* DETAILS AREA */}
                                                <div className="flex-1 p-6 space-y-6">
                                                    {item.diamondDetails && (
                                                        <DetailBox icon={Sparkles} title="Diamonds" color="cyan">
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                                <FullInput disabled={!isEditing} label="Name" value={item.diamondDetails.name} onChange={(v) => updateItemDetail(i, 'diamondDetails', 'name', v)} />
                                                                <FullInput disabled={!isEditing} label="Cut" value={item.diamondDetails.cut} onChange={(v) => updateItemDetail(i, 'diamondDetails', 'cut', v)} />
                                                                <FullInput disabled={!isEditing} label="Color" value={item.diamondDetails.color} onChange={(v) => updateItemDetail(i, 'diamondDetails', 'color', v)} />
                                                                <FullInput disabled={!isEditing} label="Clarity" value={item.diamondDetails.clarity} onChange={(v) => updateItemDetail(i, 'diamondDetails', 'clarity', v)} />
                                                                <FullInput disabled={!isEditing} label="Weight (ct)" value={item.diamondDetails.weight} isNumber onChange={(v) => updateItemDetail(i, 'diamondDetails', 'weight', v)} />
                                                                <FullInput disabled={!isEditing} label="Price (Rs)" className="col-span-full md:col-span-1" value={item.diamondDetails.price} isNumber onChange={(v) => updateItemDetail(i, 'diamondDetails', 'price', v)} />
                                                            </div>
                                                        </DetailBox>
                                                    )}

                                                    {item.stoneDetails && (
                                                        <DetailBox icon={Gem} title="Stones" color="blue">
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                                <FullInput disabled={!isEditing} label="Stone Name" value={item.stoneDetails.name} onChange={(v) => updateItemDetail(i, 'stoneDetails', 'name', v)} />
                                                                <FullInput disabled={!isEditing} label="Weight (ct)" value={item.stoneDetails.weight} isNumber onChange={(v) => updateItemDetail(i, 'stoneDetails', 'weight', v)} />
                                                                <FullInput disabled={!isEditing} label="Price (Rs)" value={item.stoneDetails.price} isNumber onChange={(v) => updateItemDetail(i, 'stoneDetails', 'price', v)} />
                                                            </div>
                                                        </DetailBox>
                                                    )}

                                                    {item.beadDetails && (
                                                        <DetailBox icon={CircleDot} title="Beads" color="purple">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <FullInput disabled={!isEditing} label="Weight (g)" value={item.beadDetails.weight} isNumber onChange={(v) => updateItemDetail(i, 'beadDetails', 'weight', v)} />
                                                                <FullInput disabled={!isEditing} label="Price (Rs)" value={item.beadDetails.price} isNumber onChange={(v) => updateItemDetail(i, 'beadDetails', 'price', v)} />
                                                            </div>
                                                        </DetailBox>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* SUMMARY */}
                        <div className="w-full lg:w-[380px] lg:sticky lg:top-8">
                            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/40">
                                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 border-b pb-4">Summary</h2>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-slate-500">
                                        <span className="text-[11px] font-bold uppercase tracking-tight">Gross Total</span>
                                        <span className="font-bold text-slate-800 font-mono italic text-lg">Rs. {subTotal.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold uppercase text-slate-400 mb-2 block">Discount</label>
                                        <div className="relative">
                                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xl font-black text-slate-800 outline-none focus:border-blue-500" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">PKR</span>
                                        </div>
                                    </div>
                                    <div className="py-8 bg-slate-900 rounded-2xl flex flex-col items-center text-white">
                                        <p className="text-[10px] font-bold uppercase opacity-50 mb-1 tracking-widest">Net Payable</p>
                                        <p className="text-4xl font-black">Rs. {finalTotal.toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => window.print()} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95">
                                        Print Invoice <Printer size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}