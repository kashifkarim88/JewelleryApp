"use client"
import React from 'react';
import {
    Search, Printer, Loader2, Gem, CircleDot,
    Sparkles, Receipt, ShoppingCart, Trash2, CreditCard
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

    const handlePrint = () => {
        if (cart.length === 0) return alert("Cart is empty");
        window.print();
    };

    return (
        <>
            <PrintInvoice customer={customer} goldRate={goldRate} cart={cart} discount={discount} />

            <div className="print:hidden min-h-screen bg-[#FDFDFD] p-4 lg:p-8 text-slate-900 antialiased">
                <div className="max-w-[1500px] mx-auto">

                    {/* 1. TOP HEADER */}
                    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Sales Billing</h1>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Inventory Management System</p>
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

                        {/* 2. LEFT COLUMN: SEARCH & ITEMS */}
                        <div className="flex-1 w-full space-y-6">

                            {/* SEARCH BOX */}
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

                            {/* ITEM LIST */}
                            <div className="space-y-6">
                                {cart.length === 0 ? (
                                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl py-20 flex flex-col items-center text-slate-400">
                                        <ShoppingCart size={32} className="mb-2 opacity-20" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">No items added</p>
                                    </div>
                                ) : (
                                    cart.map((item, i) => (
                                        <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden border-l-4 border-l-blue-500 flex flex-col md:flex-row">

                                            {/* Item Sidebar Specs */}
                                            <div className="w-full md:w-72 bg-slate-50/50 p-6 border-b md:border-b-0 md:border-r border-slate-100">
                                                <h3 className="text-lg font-black text-slate-800 uppercase leading-tight">{item.categoryName}</h3>
                                                <p className="text-[10px] font-bold text-blue-600 tracking-[0.2em] mb-6">{item.itemCode}</p>
                                                <div className="space-y-4">
                                                    <ReadOnlyStat label="Net Weight" value={item.netWeight} unit="g" />
                                                    <ReadOnlyStat label="Purity" value={item.carat} />
                                                    <ReadOnlyStat label="Labour" value={item.making?.toLocaleString()} unit="Rs" />
                                                </div>
                                                <button onClick={() => removeItem(i)} className="mt-8 flex items-center gap-2 text-[10px] font-black text-red-400 hover:text-red-600 uppercase transition-colors">
                                                    <Trash2 size={12} /> Remove
                                                </button>
                                            </div>

                                            {/* Item Details (VERTICAL DATA SETS) */}
                                            <div className="flex-1 p-6 space-y-6">
                                                {item.diamondDetails && (
                                                    <DetailBox icon={Sparkles} title="Diamonds" color="cyan">
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                            <FullInput label="Name" value={item.diamondDetails.name} onChange={(v) => updateItemDetail(i, 'diamondDetails', 'name', v)} />
                                                            <FullInput label="Cut" value={item.diamondDetails.cut} onChange={(v) => updateItemDetail(i, 'diamondDetails', 'cut', v)} />
                                                            <FullInput label="Color" value={item.diamondDetails.color} onChange={(v) => updateItemDetail(i, 'diamondDetails', 'color', v)} />
                                                            <FullInput label="Clarity" value={item.diamondDetails.clarity} onChange={(v) => updateItemDetail(i, 'diamondDetails', 'clarity', v)} />
                                                            <FullInput label="Weight (ct)" value={item.diamondDetails.weight} isNumber onChange={(v) => updateItemDetail(i, 'diamondDetails', 'weight', v)} />
                                                            <FullInput label="Rate" value={item.diamondDetails.rate} isNumber onChange={(v) => updateItemDetail(i, 'diamondDetails', 'rate', v)} />
                                                            <div className="col-span-full pt-2 border-t border-cyan-100">
                                                                <FullInput label="Price (Rs)" value={item.diamondDetails.price} isNumber onChange={(v) => updateItemDetail(i, 'diamondDetails', 'price', v)} />
                                                            </div>
                                                        </div>
                                                    </DetailBox>
                                                )}

                                                {item.stoneDetails && (
                                                    <DetailBox icon={Gem} title="Stones" color="blue">
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                            <FullInput label="Stone Name" value={item.stoneDetails.name} onChange={(v) => updateItemDetail(i, 'stoneDetails', 'name', v)} />
                                                            <FullInput label="Weight (ct)" value={item.stoneDetails.weight} isNumber onChange={(v) => updateItemDetail(i, 'stoneDetails', 'weight', v)} />
                                                            <FullInput label="Price (Rs)" value={item.stoneDetails.price} isNumber onChange={(v) => updateItemDetail(i, 'stoneDetails', 'price', v)} />
                                                        </div>
                                                    </DetailBox>
                                                )}

                                                {item.beadDetails && (
                                                    <DetailBox icon={CircleDot} title="Beads" color="purple">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FullInput label="Weight (g)" value={item.beadDetails.weight} isNumber onChange={(v) => updateItemDetail(i, 'beadDetails', 'weight', v)} />
                                                            <FullInput label="Price (Rs)" value={item.beadDetails.price} isNumber onChange={(v) => updateItemDetail(i, 'beadDetails', 'price', v)} />
                                                        </div>
                                                    </DetailBox>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* 3. RIGHT COLUMN: SUMMARY CARD */}
                        <div className="w-full lg:w-[380px] lg:sticky lg:top-8">
                            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/40">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Order Summary</h2>
                                    <CreditCard size={16} className="text-slate-300" />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-slate-500">
                                        <span className="text-[11px] font-bold uppercase tracking-tight">Gross Total</span>
                                        <span className="text-base font-bold italic text-slate-700">Rs. {subTotal.toLocaleString()}</span>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold uppercase text-slate-400 tracking-tight mb-2 block">Discount</label>
                                        <div className="relative">
                                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-all" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">PKR</span>
                                        </div>
                                    </div>

                                    <div className="py-8 bg-slate-50/50 rounded-2xl flex flex-col items-center border border-slate-100">
                                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">Net Payable</p>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter">Rs. {finalTotal.toLocaleString()}</p>
                                    </div>

                                    <button onClick={handlePrint} className="w-full bg-slate-900 hover:bg-black text-white h-16 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95">
                                        Print Invoice <Printer size={18} />
                                    </button>

                                    <p className="text-[9px] text-center text-slate-400 font-medium italic">
                                        Values updated automatically based on current rates
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}