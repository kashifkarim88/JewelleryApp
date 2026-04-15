"use client"
import React, { memo } from 'react';
import {
    Box, Check, Trash2, Printer, Sparkles,
    Gem, CircleDot, ChevronDown, Package, Banknote
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

    return (
        <div className="w-full transition-all duration-300">
            {!isOpen ? (
                /* --- COMPACT VIEW --- */
                <div
                    onClick={onToggle}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Package size={18} className="text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-800 uppercase">{item.itemCode}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{item.categoryName} • {item.netWeight}g</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase">Item Total</p>
                            <p className="text-md font-black text-slate-900">Rs. {Math.round(itemTotal).toLocaleString()}</p>
                        </div>
                        <ChevronDown size={16} className="text-slate-300 group-hover:text-indigo-500" />
                    </div>
                </div>
            ) : (
                /* --- CLEAN EXPANDED VIEW WITH ADDED DETAILS --- */
                <div className="bg-white rounded-[2.5rem] border-2 border-indigo-600 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                    {/* TOP STRIP */}
                    <div className="bg-slate-900 px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                                {item.categoryName}
                            </span>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{item.itemCode}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => onRemove(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                                <Trash2 size={18} />
                            </button>
                            <button onClick={onToggle} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                <Check size={14} /> Finish Editing
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* LEFT COLUMN: VISUALS & DETAILED ADD-ONS */}
                        <div className="w-full lg:w-72 bg-slate-50 p-6 border-r border-slate-100 space-y-4">
                            <div className="aspect-square bg-white rounded-3xl border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                                {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <Box size={40} className="text-slate-100" />}
                            </div>

                            <div className="space-y-2">
                                <CollapsibleSection icon={Sparkles} title="Diamonds" color="cyan">
                                    <div className="space-y-2 mt-2">
                                        <FullInput label="Name" value={item.diamondDetails?.name || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'name', v)} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <FullInput label="Cut" value={item.diamondDetails?.cut || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'cut', v)} />
                                            <FullInput label="Clarity" value={item.diamondDetails?.clarity || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'clarity', v)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <FullInput label="Color" value={item.diamondDetails?.color || ''} onChange={(v) => onUpdate(index, 'diamondDetails', 'color', v)} />
                                            <FullInput label="Wt (ct)" value={item.diamondDetails?.weight || ''} isNumber onChange={(v) => onUpdate(index, 'diamondDetails', 'weight', v)} />
                                        </div>
                                        <FullInput label="Total Price" value={item.diamondDetails?.price || ''} isNumber onChange={(v) => onUpdate(index, 'diamondDetails', 'price', v)} />
                                    </div>
                                </CollapsibleSection>

                                <CollapsibleSection icon={Gem} title="Stones" color="blue">
                                    <div className="space-y-2 mt-2">
                                        <FullInput label="Stone Name" value={item.stoneDetails?.name || ''} onChange={(v) => onUpdate(index, 'stoneDetails', 'name', v)} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <FullInput label="Weight" value={item.stoneDetails?.weight || ''} isNumber onChange={(v) => onUpdate(index, 'stoneDetails', 'weight', v)} />
                                            <FullInput label="Price" value={item.stoneDetails?.price || ''} isNumber onChange={(v) => onUpdate(index, 'stoneDetails', 'price', v)} />
                                        </div>
                                    </div>
                                </CollapsibleSection>

                                <CollapsibleSection icon={CircleDot} title="Beads" color="purple">
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <FullInput label="Weight" value={item.beadDetails?.weight || ''} isNumber onChange={(v) => onUpdate(index, 'beadDetails', 'weight', v)} />
                                        <FullInput label="Price" value={item.beadDetails?.price || ''} isNumber onChange={(v) => onUpdate(index, 'beadDetails', 'price', v)} />
                                    </div>
                                </CollapsibleSection>
                            </div>

                            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <div className="flex justify-between text-[10px] font-black text-indigo-900 uppercase">
                                    <span>Gross Wt:</span>
                                    <span>{(Number(item.netWeight) + wastageGrams).toFixed(3)}g</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: MAIN INPUTS (CLEAN GRID) */}
                        <div className="flex-1 p-8">
                            <div className="flex justify-between items-center mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Final Item Total</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">Rs. {Math.round(itemTotal).toLocaleString()}</p>
                                </div>
                                <button onClick={onPrint} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:bg-white transition-all">
                                    <Printer size={14} /> Label
                                </button>
                            </div>

                            {/* CORE INPUT GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Row 1 */}
                                <FullInput label="Net Weight (G)" value={item.netWeight} isNumber onChange={(v) => onUpdate(index, 'netWeight', '', v)} />
                                <FullInput label="Wastage (%)" value={item.wastagePercent} isNumber onChange={(v) => onUpdate(index, 'wastagePercent', '', v)} />
                                <div className="opacity-60">
                                    <FullInput label="Wastage (G)" value={wastageGrams.toFixed(3)} disabled onChange={() => { }} />
                                </div>

                                {/* Row 2 */}
                                <FullInput label="Purity/Carat" value={item.carat} onChange={(v) => onUpdate(index, 'carat', '', v)} />
                                <FullInput label="Labour (Making)" value={item.making} isNumber onChange={(v) => onUpdate(index, 'making', '', v)} />
                                <div className="opacity-60">
                                    <FullInput label="Stones Total" value={stonesTotal} disabled onChange={() => { }} />
                                </div>

                                {/* Row 3 - The Advance & Discount Section */}
                                <div className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                                    <FullInput
                                        label="Item Discount (Rs)"
                                        value={item.discount || ''}
                                        isNumber
                                        placeholder="0"
                                        onChange={(v) => onUpdate(index, 'discount', '', v)}
                                    />
                                </div>
                                <div className="bg-blue-50/50 p-2 rounded-xl border border-blue-100">
                                    <FullInput
                                        label="Item Advance (Rs)"
                                        icon={Banknote}
                                        value={item.advance || ''}
                                        isNumber
                                        placeholder="0"
                                        onChange={(v) => onUpdate(index, 'advance', '', v)}
                                    />
                                </div>
                                <FullInput label="Worker Name" value={item.workerName} onChange={(v) => onUpdate(index, 'workerName', '', v)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

CartItemCard.displayName = 'CartItemCard';