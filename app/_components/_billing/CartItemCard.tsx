"use client"
import React from 'react';
import {
    Box, Check, Trash2, User, Printer, Sparkles,
    Gem, CircleDot, ChevronDown, Package, Tag
} from 'lucide-react';
import { FullInput } from './BillingComponents';
import { CollapsibleSection } from './CollapsibleSection';

export const CartItemCard = ({
    item,
    index,
    isOpen,
    onToggle,
    onUpdate,
    onRemove,
    onPrint,
    itemTotal,
    stonesTotal
}: any) => {

    // Logic for Weight Calculations
    const wastageGrams = (Number(item.netWeight || 0) * Number(item.wastagePercent || 0)) / 100;

    // Logic for Section Visibility
    const hasDiamonds = item.diamondDetails && (item.diamondDetails.name || item.diamondDetails.price || item.diamondDetails.weight || item.diamondDetails.rate);
    const hasStones = item.stoneDetails && (item.stoneDetails.name || item.stoneDetails.price || item.stoneDetails.weight);
    const hasBeads = item.beadDetails && (item.beadDetails.price || item.beadDetails.weight);

    return (
        <div className="w-full transition-all duration-300">
            {!isOpen ? (
                /* --- COMPACT VIEW --- */
                <div
                    onClick={onToggle}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} className="object-cover h-full w-full" alt="" />
                            ) : (
                                <Package size={20} className="text-slate-300" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-600 rounded uppercase tracking-wider border border-slate-200">
                                    {item.categoryName}
                                </span>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                    {item.itemCode}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] text-slate-400 font-bold uppercase">
                                    {item.metal} {item.carat} • <span className="text-slate-600">{item.netWeight}g</span>
                                </p>
                                {Number(item.discount || 0) > 0 && (
                                    <span className="text-[9px] font-black text-red-500 bg-red-50 px-1.5 rounded flex items-center gap-1">
                                        <Tag size={8} /> -Rs.{Number(item.discount).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Final Price</p>
                            <p className="text-lg font-black text-slate-900 tracking-tighter">
                                Rs. {Math.round(itemTotal).toLocaleString()}
                            </p>
                        </div>
                        <ChevronDown size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                </div>
            ) : (
                /* --- FULL DETAIL VIEW --- */
                <div className="relative bg-white rounded-4xl border-2 border-indigo-500 shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">

                    {/* STICKY MOBILE CONTEXT HEADER */}
                    <div className="md:hidden sticky top-0 z-50 bg-indigo-600/95 backdrop-blur-md text-white px-5 py-3 flex items-center justify-between shadow-xl rounded-t-[30px]">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-70">Editing Item</span>
                                <span className="text-xs font-black uppercase tracking-tight">{item.itemCode}</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggle(); }}
                            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                        >
                            <Check size={18} />
                        </button>
                    </div>

                    {/* LEFT SIDEBAR (Desktop) / TOP IMAGE (Mobile) */}
                    <div className="w-full md:w-64 bg-slate-50/50 p-5 border-r border-slate-100 rounded-l-4xl">
                        <button
                            onClick={onToggle}
                            className="hidden md:flex w-full py-2.5 mb-1 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border items-center justify-center gap-2 bg-green-600 border-green-700 text-white shadow-lg shadow-green-100"
                        >
                            <Check size={12} /> Save & Close
                        </button>

                        <div className="w-full aspect-square bg-white rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden mb-4 shadow-inner mt-4 md:mt-0">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} className="w-full h-full object-cover" alt="jewelry" />
                            ) : (
                                <Box size={24} className="opacity-10" />
                            )}
                        </div>

                        {/* Collapsible Detail Sections */}
                        <div className="space-y-2">
                            {hasDiamonds && (
                                <CollapsibleSection icon={Sparkles} title="Diamonds" color="cyan">
                                    <div className="space-y-3 mt-1">
                                        <FullInput label="Diamond Name" value={item.diamondDetails?.name || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'name', v)} />
                                        <div className="grid grid-cols-3 gap-2">
                                            <FullInput label="Cuts" value={item.diamondDetails?.cut || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'cut', v)} />
                                            <FullInput label="Clarity" value={item.diamondDetails?.clarity || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'clarity', v)} />
                                            <FullInput label="Color" value={item.diamondDetails?.color || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'color', v)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <FullInput label="Weight (ct)" value={item.diamondDetails?.weight || ''} isNumber onChange={(v) => onUpdate(index, 'diamondDetails', 'weight', v)} />
                                            <FullInput label="Rate" value={item.diamondDetails?.rate || ''} isNumber onChange={(v) => onUpdate(index, 'diamondDetails', 'rate', v)} />
                                            <div className="col-span-2">
                                                <FullInput label="Total Price" value={item.diamondDetails?.price || ''} isNumber onChange={(v) => onUpdate(index, 'diamondDetails', 'price', v)} />
                                            </div>
                                        </div>
                                    </div>
                                </CollapsibleSection>
                            )}

                            {hasStones && (
                                <CollapsibleSection icon={Gem} title="Stones" color="blue">
                                    <div className="space-y-3 mt-1">
                                        <FullInput label="Stone Name" value={item.stoneDetails?.name || ''} onChange={(v) => onUpdate(index, 'stoneDetails', 'name', v)} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <FullInput label="Weight" value={item.stoneDetails?.weight || ''} isNumber onChange={(v) => onUpdate(index, 'stoneDetails', 'weight', v)} />
                                            <FullInput label="Total Price" value={item.stoneDetails?.price || ''} isNumber onChange={(v) => onUpdate(index, 'stoneDetails', 'price', v)} />
                                        </div>
                                    </div>
                                </CollapsibleSection>
                            )}

                            {hasBeads && (
                                <CollapsibleSection icon={CircleDot} title="Beads" color="purple">
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <FullInput label="Weight" value={item.beadDetails?.weight} isNumber onChange={(v) => onUpdate(index, 'beadDetails', 'weight', v)} />
                                        <FullInput label="Price" value={item.beadDetails?.price} isNumber onChange={(v) => onUpdate(index, 'beadDetails', 'price', v)} />
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Item-Specific Discount Section
                            <CollapsibleSection icon={Tag} title="Item Discount" color="purple">
                                <div className="p-1">
                                    <FullInput
                                        label="Discount (Rs.)"
                                        value={item.discount || ''}
                                        isNumber
                                        placeholder="0"
                                        onChange={(v) => onUpdate(index, 'discount', '', v)}
                                    />
                                    <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase">Amount deducted from this item's total</p>
                                </div>
                            </CollapsibleSection> */}
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                            className="w-full mt-4 text-[9px] font-black text-red-400 hover:text-red-500 uppercase flex items-center justify-center gap-1.5 transition-colors"
                        >
                            <Trash2 size={12} /> Remove Item
                        </button>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 p-6 flex flex-col justify-between bg-white rounded-r-4xl">
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <div className="hidden md:block">
                                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">
                                        {item.itemCode}
                                    </h3>
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded border border-blue-100 uppercase tracking-widest">
                                        {item.categoryName}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center justify-center py-3 px-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-slate-200 w-full md:w-auto">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Item Total</p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] font-black text-indigo-400">Rs.</span>
                                        <p className="text-2xl font-black text-white tracking-tighter">
                                            {Math.round(itemTotal).toLocaleString()}
                                        </p>
                                    </div>
                                    {Number(item.discount || 0) > 0 && (
                                        <div className="mt-1 px-2 py-0.5 bg-red-500/20 rounded-md border border-red-500/30">
                                            <p className="text-[7px] font-black text-red-400 uppercase tracking-tighter italic">Discount Applied</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                <div className="space-y-6">
                                    <FullInput label="Net Weight (G)" value={item.netWeight} isNumber onChange={(v) => onUpdate(index, 'netWeight', '', v)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FullInput label="Wastage (%)" value={item.wastagePercent} isNumber onChange={(v) => onUpdate(index, 'wastagePercent', '', v)} />
                                        <FullInput label="Wastage (G)" disabled value={wastageGrams.toFixed(3)} isNumber onChange={() => { }} />
                                    </div>
                                    <FullInput label="Purity" value={item.carat} onChange={(v) => onUpdate(index, 'carat', '', v)} />
                                </div>

                                <div className="space-y-6">
                                    <FullInput label="Labour Charges" value={item.making} isNumber onChange={(v) => onUpdate(index, 'making', '', v)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FullInput label="Stones Total" disabled value={stonesTotal} isNumber onChange={() => { }} />
                                        <FullInput label="Discount (Rs.)" value={item.discount || ''} isNumber placeholder="0" onChange={(v) => onUpdate(index, 'discount', '', v)} />
                                    </div>
                                    <FullInput label="Worker" value={item.workerName} onChange={(v) => onUpdate(index, 'workerName', '', v)} />
                                </div>
                            </div>
                        </div>

                        {/* FOOTER ACTIONS */}
                        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-200">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Master Craftsman</p>
                                    <p className="text-xs font-black text-slate-700">{item.workerName || 'Factory Unit'}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); onPrint(); }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
                            >
                                <Printer size={14} /> Print This Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};