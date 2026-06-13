"use client"
import React, { memo } from 'react';
import {
    Box, Trash2, Printer, Sparkles,
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
    onNestedUpdate,
    onRemove,
    onPrint,
    itemTotal,
    stonesTotal
}: any) => {

    const wastageGrams = (Number(item.netWeight || 0) * Number(item.wastagePercent || 0)) / 100;

    return (
        <div className="w-full transition-all duration-500 ease-in-out mb-4">
            {!isOpen ? (
                /* --- COMPACT VIEW --- */
                <div
                    onClick={onToggle}
                    className="group bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between cursor-pointer hover:border-indigo-500 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 overflow-hidden">
                            {item.imageUrl ?
                                <img src={item.imageUrl} className="w-full h-full object-cover" alt="thumb" /> :
                                <Package size={18} className="text-slate-400 group-hover:text-indigo-500" />
                            }
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{item.itemCode}</h3>
                            <p className="text-[10px] text-slate-500 uppercase font-medium">
                                {item.categoryName} — {item.metal} {item.carat}
                            </p>
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
                                <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest mt-1">
                                    {item.metal} {item.carat} {item.categoryName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => onRemove(index)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                                <Trash2 size={18} />
                            </button>
                            <button onClick={onToggle} className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full transition-all">
                                <ChevronUp size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* LEFT SIDEBAR - The scrolling happens here globally */}
                        <div className="w-full lg:w-80 bg-slate-50/50 p-5 border-r border-slate-100 flex flex-col gap-4">

                            {/* ITEM IMAGE */}
                            <div className="w-full aspect-square bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group relative shrink-0">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt="Product"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
                                        <Box size={48} className="text-slate-200 mb-2" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">No Image Available</span>
                                    </div>
                                )}
                            </div>

                            {/* DIAMONDS SECTION - Dynamic Height */}
                            {item.diamondDetails?.length > 0 && (
                                <div>
                                    <CollapsibleSection icon={Sparkles} title="Diamonds" color="cyan">
                                        <div className="p-4 space-y-6">
                                            {item.diamondDetails.map((diamond: any, dIdx: number) => (
                                                <div key={dIdx} className="space-y-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[9px] font-black text-cyan-600 uppercase tracking-widest">{diamond.name || 'Diamond'}</p>
                                                        <span className="text-[8px] bg-cyan-50 text-cyan-700 px-2 py-1 rounded-md font-black border border-cyan-100">QTY: {diamond.dquantity || 1}</span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <FullInput label="Cut" value={diamond.cut} onChange={(v) => onNestedUpdate(index, 'diamondDetails', dIdx, 'cut', v)} />
                                                        <FullInput label="Clarity" value={diamond.clarity} onChange={(v) => onNestedUpdate(index, 'diamondDetails', dIdx, 'clarity', v)} />
                                                        <FullInput label="Color" value={diamond.color} onChange={(v) => onNestedUpdate(index, 'diamondDetails', dIdx, 'color', v)} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <FullInput label="Rate /ct" value={diamond.rate} isNumber onChange={(v) => onNestedUpdate(index, 'diamondDetails', dIdx, 'rate', v)} />
                                                        <FullInput label="Wt (ct)" value={diamond.weight} isNumber onChange={(v) => onNestedUpdate(index, 'diamondDetails', dIdx, 'weight', v)} />
                                                    </div>
                                                    <FullInput label="Total Price" value={diamond.price} isNumber onChange={(v) => onNestedUpdate(index, 'diamondDetails', dIdx, 'price', v)} />
                                                </div>
                                            ))}
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}

                            {/* COLOR STONES SECTION - Dynamic Height */}
                            {item.stoneDetails?.length > 0 && (
                                <div>
                                    <CollapsibleSection icon={Gem} title="Color Stones" color="blue">
                                        <div className="p-4 space-y-6">
                                            {item.stoneDetails.map((stone: any, sIdx: number) => (
                                                <div key={sIdx} className="space-y-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{stone.name}</p>
                                                        <span className="text-[8px] bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-black border border-blue-100">QTY: {stone.squantity || 1}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <FullInput label="Weight" value={stone.weight} isNumber onChange={(v) => onNestedUpdate(index, 'stoneDetails', sIdx, 'weight', v)} />
                                                        <FullInput label="Price" value={stone.price} isNumber onChange={(v) => onNestedUpdate(index, 'stoneDetails', sIdx, 'price', v)} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}

                            {/* BEADS & PEARLS */}
                            {item.beadDetails && (
                                <div>
                                    <CollapsibleSection icon={CircleDot} title="Beads & Pearls" color="purple">
                                        <div className="p-4 space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <FullInput label="Weight" value={item.beadDetails?.weight} isNumber onChange={(v) => onUpdate(index, 'beadDetails', 'weight', v)} />
                                                <FullInput label="Price" value={item.beadDetails?.price} isNumber onChange={(v) => onUpdate(index, 'beadDetails', 'price', v)} />
                                            </div>
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}
                        </div>

                        {/* RIGHT MAIN PANEL */}
                        <div className="flex-1 p-6 flex flex-col bg-white overflow-hidden justify-between ">

                            {/* Strict Vertical Column Flow - Spaced dynamically to fill available height */}
                            <div className="flex-1 flex flex-col my-2 space-y-1">
                                {/* 1. Net Weight */}
                                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Scale size={16} />
                                        </div>
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">Net Weight (G)</span>
                                    </div>
                                    <div className="w-36">
                                        <FullInput
                                            label=""
                                            value={item.netWeight}
                                            isNumber
                                            onChange={(v) => onUpdate(index, 'netWeight', '', v)}
                                        />
                                    </div>
                                </div>

                                {/* 2. Wastage % */}
                                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Percent size={16} />
                                        </div>
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">Wastage (%)</span>
                                    </div>
                                    <div className="w-36">
                                        <FullInput
                                            label=""
                                            value={item.wastagePercent}
                                            isNumber
                                            onChange={(v) => onUpdate(index, 'wastagePercent', '', v)}
                                        />
                                    </div>
                                </div>

                                {/* 3. Wastage Grams (Calculated Output) */}
                                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 border border-dashed border-slate-200/60">
                                    <div className="flex items-center gap-3 pl-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Wastage Grams</span>
                                    </div>
                                    <div className="w-36 opacity-65">
                                        <FullInput
                                            label=""
                                            value={wastageGrams.toFixed(3)}
                                            disabled
                                            onChange={() => { }}
                                        />
                                    </div>
                                </div>

                                {/* 4. Stone Price (Calculated Output) */}
                                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 border border-dashed border-slate-200/60">
                                    <div className="flex items-center gap-3 pl-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Stone Price</span>
                                    </div>
                                    <div className="w-36 opacity-65">
                                        <FullInput
                                            label=""
                                            value={stonesTotal}
                                            disabled
                                            onChange={() => { }}
                                        />
                                    </div>
                                </div>

                                {/* 5. Labour / Making */}
                                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <Banknote size={16} />
                                        </div>
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">Labour / Making</span>
                                    </div>
                                    <div className="w-36">
                                        <FullInput
                                            label=""
                                            value={item.making}
                                            isNumber
                                            onChange={(v) => onUpdate(index, 'making', '', v)}
                                        />
                                    </div>
                                </div>

                                {/* 6. Advance */}
                                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 font-black text-xs">
                                            A
                                        </div>
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">Advance (Rs)</span>
                                    </div>
                                    <div className="w-36">
                                        <FullInput
                                            label=""
                                            value={item.advance || ''}
                                            isNumber
                                            onChange={(v) => onUpdate(index, 'advance', '', v)}
                                        />
                                    </div>
                                </div>

                                {/* 7. Discount */}
                                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 font-black text-xs">
                                            D
                                        </div>
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">Discount (Rs)</span>
                                    </div>
                                    <div className="w-36">
                                        <FullInput
                                            label=""
                                            value={item.discount || ''}
                                            isNumber
                                            onChange={(v) => onUpdate(index, 'discount', '', v)}
                                        />
                                    </div>
                                </div>

                                {/* Worker Metadata Field */}
                                <div className="pt-2 border-t border-slate-100/80 mt-1">
                                    <FullInput
                                        icon={User}
                                        label="Worker Assignment"
                                        value={item.workerName}
                                        disabled={true}
                                        onChange={(v) => onUpdate(index, 'workerName', '', v)}
                                    />
                                </div>

                            </div>

                            {/* Modern Compact Billing Footer - Total Display and Print Button Included Here */}
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1.5">
                                        Item Total
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xs font-bold text-indigo-600">Rs.</span>
                                        <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                                            {Math.round(itemTotal).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={onPrint}
                                    type="button" // Ensures no form-submission side effects interfere with the function
                                    className="group flex items-center gap-2 px-5 py-3 bg-[#24304e] hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
                                >
                                    <Printer size={14} className="group-hover:rotate-6 transition-transform" />
                                    <span>Print Invoice</span>
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