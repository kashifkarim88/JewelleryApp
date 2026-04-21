"use client"
import React, { memo } from 'react';
import {
    Box, Check, Trash2, Printer, Sparkles,
    Gem, CircleDot, ChevronDown, ChevronUp, Package, Banknote,
    User, Scale, Percent
} from 'lucide-react';
import { FullInput } from './BillingComponents';
import { CollapsibleSection } from './CollapsibleSection';

export const CartItemCard = memo(({
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

    const wastageGrams = (Number(item.netWeight || 0) * Number(item.wastagePercent || 0)) / 100;

    // Helper to check if a section should be visible
    const hasData = (details: any) => {
        if (!details) return false;
        return !!(
            details.name ||
            (details.weight && Number(details.weight) > 0) ||
            (details.price && Number(details.price) > 0) ||
            (details.rate && Number(details.rate) > 0) ||
            details.cut ||
            details.clarity ||
            details.color
        );
    };

    return (
        <div className="w-full transition-all duration-500 ease-in-out mb-4">
            {!isOpen ? (
                /* --- COMPACT VIEW --- */
                <div
                    onClick={onToggle}
                    className="group bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between cursor-pointer hover:border-indigo-500 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50">
                            {item.imageUrl ?
                                <img src={item.imageUrl} className="w-full h-full object-cover rounded-lg" alt="thumb" /> :
                                <Package size={18} className="text-slate-400 group-hover:text-indigo-500" />
                            }
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{item.itemCode}</h3>
                            <p className="text-[10px] text-slate-500 uppercase font-medium">{item.categoryName} — {item.carat}  •  {item.netWeight}g</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm font-black text-indigo-600">Rs. {Math.round(itemTotal).toLocaleString()}</p>
                        </div>
                        <ChevronDown size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                </div>
            ) : (
                /* --- EXPANDED VIEW --- */
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                    {/* HEADER */}
                    <div className="bg-[#24304e] px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-600 p-2 rounded-lg text-white">
                                <Package size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white uppercase leading-none">{item.itemCode || "NEW ITEM"}</h3>
                                <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest mt-1">{item.categoryName} — {item.carat}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => onRemove(index)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                                <Trash2 size={18} />
                            </button>
                            <button
                                onClick={onToggle}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <ChevronUp size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* LEFT SIDEBAR */}
                        <div className="w-full lg:w-72 bg-slate-50/50 p-5 border-r border-slate-100 flex flex-col gap-3">
                            <div className="aspect-square bg-white rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden mb-2">
                                {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" alt="item" /> : <Box size={40} className="text-slate-100" />}
                            </div>

                            {/* DIAMONDS SECTION */}
                            {hasData(item.diamondDetails) && (
                                <CollapsibleSection icon={Sparkles} title="Diamonds" color="cyan">
                                    <div className="space-y-2 p-1 pt-2">
                                        <FullInput label="Stone Name" value={item.diamondDetails?.name || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'name', v)} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <FullInput label="Cut" value={item.diamondDetails?.cut || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'cut', v)} />
                                            <FullInput label="Clarity" value={item.diamondDetails?.clarity || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'clarity', v)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <FullInput label="Color" value={item.diamondDetails?.color || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'color', v)} />
                                            <FullInput label="Wt (ct)" value={item.diamondDetails?.weight || ''} isNumber onChange={(v) => onUpdate(index, 'diamondDetails', 'weight', v)} />
                                        </div>
                                        {/* Added Rate Field for Diamonds */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <FullInput label="Rate /ct" value={item.diamondDetails?.rate || ''} isNumber onChange={(v) => onUpdate(index, 'diamondDetails', 'rate', v)} />
                                            <FullInput label="Total Price" value={item.diamondDetails?.price || ''} isNumber onChange={(v) => onUpdate(index, 'diamondDetails', 'price', v)} />
                                        </div>
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* COLOR STONES */}
                            {hasData(item.stoneDetails) && (
                                <CollapsibleSection icon={Gem} title="Color Stones" color="blue">
                                    <div className="space-y-2 p-1 pt-2">
                                        <FullInput label="Stone Name" value={item.stoneDetails?.name || ''} onChange={(v) => onUpdate(index, 'stoneDetails', 'name', v)} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <FullInput label="Weight" value={item.stoneDetails?.weight || ''} isNumber onChange={(v) => onUpdate(index, 'stoneDetails', 'weight', v)} />
                                            <FullInput label="Rate /g" value={item.stoneDetails?.rate || ''} isNumber onChange={(v) => onUpdate(index, 'stoneDetails', 'rate', v)} />
                                        </div>
                                        <FullInput label="Price" value={item.stoneDetails?.price || ''} isNumber onChange={(v) => onUpdate(index, 'stoneDetails', 'price', v)} />
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* BEADS & PEARLS */}
                            {hasData(item.beadDetails) && (
                                <CollapsibleSection icon={CircleDot} title="Beads & Pearls" color="purple">
                                    <div className="space-y-2 p-1 pt-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <FullInput label="Weight" value={item.beadDetails?.weight || ''} isNumber onChange={(v) => onUpdate(index, 'beadDetails', 'weight', v)} />
                                            <FullInput label="Rate" value={item.beadDetails?.rate || ''} isNumber onChange={(v) => onUpdate(index, 'beadDetails', 'rate', v)} />
                                        </div>
                                        <FullInput label="Price" value={item.beadDetails?.price || ''} isNumber onChange={(v) => onUpdate(index, 'beadDetails', 'price', v)} />
                                    </div>
                                </CollapsibleSection>
                            )}
                        </div>

                        {/* RIGHT MAIN PANEL */}
                        <div className="flex-1 p-6 flex flex-col">
                            <div className="flex justify-end items-start mb-8 w-full px-2">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total Valuation</p>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm font-black text-indigo-600">Rs.</span>
                                        <span className="text-xl font-black text-slate-900 tracking-tighter">
                                            {Math.round(itemTotal).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-24 h-px bg-linear-to-l from-indigo-200 to-transparent mt-2"></div>
                                </div>
                            </div>

                            {/* DATA GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6 mb-8">
                                <FullInput icon={Scale} label="Net Weight (G)" value={item.netWeight} isNumber onChange={(v) => onUpdate(index, 'netWeight', '', v)} />
                                <FullInput icon={Percent} label="Wastage (%)" value={item.wastagePercent} isNumber onChange={(v) => onUpdate(index, 'wastagePercent', '', v)} />
                                <div className="opacity-70"><FullInput label="Wastage Grams" value={wastageGrams.toFixed(3)} disabled onChange={() => { }} /></div>

                                <FullInput icon={Banknote} label="Labour / Making" value={item.making} isNumber onChange={(v) => onUpdate(index, 'making', '', v)} />
                                <div className="opacity-70"><FullInput label="Stone Cost" value={stonesTotal} disabled onChange={() => { }} /></div>
                                <FullInput icon={User} label="Worker Name" value={item.workerName} onChange={(v) => onUpdate(index, 'workerName', '', v)} />

                                <div className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                    <FullInput label="Discount (Rs)" value={item.discount || ''} isNumber onChange={(v) => onUpdate(index, 'discount', '', v)} />
                                </div>
                                <div className="p-2 bg-blue-50/50 rounded-xl border border-blue-100">
                                    <FullInput label="Advance (Rs)" value={item.advance || ''} isNumber onChange={(v) => onUpdate(index, 'advance', '', v)} />
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                    Cart Entry #{index + 1}
                                </div>
                                <button
                                    onClick={onPrint}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white border border-blue-200 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-sm active:scale-95"
                                >
                                    <Printer size={14} className="text-white" /> Print {item.itemCode} Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

CartItemCard.displayName = 'CartItemCard';