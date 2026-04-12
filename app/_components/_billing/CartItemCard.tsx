"use client"
import React from 'react';
import { Box, Check, Edit3, Trash2, User, Printer, Sparkles, Gem, CircleDot } from 'lucide-react';
import { FullInput } from './BillingComponents';
import { CollapsibleSection } from './CollapsibleSection';

export const CartItemCard = ({
    item,
    index,
    isEditing,
    onToggleEdit,
    onUpdate,
    onRemove,
    onPrint,
    itemTotal,
    stonesTotal
}: any) => {
    const wastageGrams = (Number(item.netWeight || 0) * Number(item.wastagePercent || 0)) / 100;

    // Checks if sections have any data to determine if they should be visible
    const hasDiamonds = item.diamondDetails && (item.diamondDetails.name || item.diamondDetails.price || item.diamondDetails.weight || item.diamondDetails.rate);
    const hasStones = item.stoneDetails && (item.stoneDetails.name || item.stoneDetails.price || item.stoneDetails.weight);
    const hasBeads = item.beadDetails && (item.beadDetails.price || item.beadDetails.weight);

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all">
            <div className="w-full md:w-64 bg-slate-50/50 p-5 border-r border-slate-100">
                <button
                    onClick={onToggleEdit}
                    className={`w-full py-2.5 mb-1 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${isEditing ? "bg-green-600 border-green-700 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    {isEditing ? <><Check size={12} /> Save Changes</> : <><Edit3 size={12} /> Edit Details</>}
                </button>

                <div className="w-full aspect-square bg-white rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden mb-4 shadow-inner">
                    {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" alt="jewelry" /> : <Box size={24} className="opacity-10" />}
                </div>

                <div className="space-y-2">
                    {/* DIAMOND SECTION - ALL INPUTS RESTORED */}
                    {/* DIAMOND SECTION - MAPPED TO YOUR DATA OBJECT */}
                    {hasDiamonds && (
                        <CollapsibleSection icon={Sparkles} title="Diamonds" color="cyan">
                            <div className="space-y-3 mt-1">
                                {/* Name: "Round Brilliant" */}
                                <FullInput
                                    label="Diamond Name"
                                    disabled={!isEditing}
                                    value={item.diamondDetails?.name || ''}
                                    onChange={(v) => onUpdate(index, 'diamondDetails', 'name', v)}
                                />

                                {/* 4Cs / Grading Specs */}
                                <div className="grid grid-cols-3 gap-2">
                                    <FullInput
                                        label="Cuts"
                                        disabled={!isEditing}
                                        value={item.diamondDetails?.cut || ''} // CHANGED FROM 'cuts' TO 'cut'
                                        onChange={(v) => onUpdate(index, 'diamondDetails', 'cut', v)}
                                    />
                                    <FullInput
                                        label="Clarity"
                                        disabled={!isEditing}
                                        value={item.diamondDetails?.clarity || ''} // "VVS1"
                                        onChange={(v) => onUpdate(index, 'diamondDetails', 'clarity', v)}
                                    />
                                    <FullInput
                                        label="Color"
                                        disabled={!isEditing}
                                        value={item.diamondDetails?.color || ''} // "E"
                                        onChange={(v) => onUpdate(index, 'diamondDetails', 'color', v)}
                                    />
                                </div>

                                {/* Pricing & Weight */}
                                <div className="grid grid-cols-2 gap-2">
                                    <FullInput
                                        label="Weight (ct)"
                                        disabled={!isEditing}
                                        value={item.diamondDetails?.weight || ''} // 39
                                        isNumber
                                        onChange={(v) => onUpdate(index, 'diamondDetails', 'weight', v)}
                                    />
                                    <FullInput
                                        label="Rate"
                                        disabled={!isEditing}
                                        value={item.diamondDetails?.rate || ''} // 700000
                                        isNumber
                                        onChange={(v) => onUpdate(index, 'diamondDetails', 'rate', v)}
                                    />
                                    <div className="col-span-2">
                                        <FullInput
                                            label="Total Diamond Price"
                                            disabled={!isEditing}
                                            value={item.diamondDetails?.price || ''} // 2500000
                                            isNumber
                                            onChange={(v) => onUpdate(index, 'diamondDetails', 'price', v)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>
                    )}

                    {/* STONE SECTION - MAPPED TO YOUR DATA OBJECT */}
                    {hasStones && (
                        <CollapsibleSection icon={Gem} title="Stones" color="blue">
                            <div className="space-y-3 mt-1">
                                {/* Name: e.g., "Ruby" */}
                                <FullInput
                                    label="Stone Name"
                                    disabled={!isEditing}
                                    value={item.stoneDetails?.name || ''}
                                    onChange={(v) => onUpdate(index, 'stoneDetails', 'name', v)}
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <FullInput
                                        label="Weight"
                                        disabled={!isEditing}
                                        value={item.stoneDetails?.weight || ''} // e.g., 17.992
                                        isNumber
                                        onChange={(v) => onUpdate(index, 'stoneDetails', 'weight', v)}
                                    />
                                    <FullInput
                                        label="Total Price"
                                        disabled={!isEditing}
                                        value={item.stoneDetails?.price || ''} // e.g., 20000
                                        isNumber
                                        onChange={(v) => onUpdate(index, 'stoneDetails', 'price', v)}
                                    />
                                </div>
                            </div>
                        </CollapsibleSection>
                    )}

                    {hasBeads && (
                        <CollapsibleSection icon={CircleDot} title="Beads" color="purple">
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <FullInput label="Weight" disabled={!isEditing} value={item.beadDetails?.weight} isNumber onChange={(v) => onUpdate(index, 'beadDetails', 'weight', v)} />
                                <FullInput label="Price" disabled={!isEditing} value={item.beadDetails?.price} isNumber onChange={(v) => onUpdate(index, 'beadDetails', 'price', v)} />
                            </div>
                        </CollapsibleSection>
                    )}
                </div>

                <button onClick={() => onRemove(index)} className="w-full mt-4 text-[9px] font-black text-red-400 hover:text-red-500 uppercase flex items-center justify-center gap-1.5">
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

                        <div className="flex flex-col items-center justify-center py-3 px-6 bg-slate-50 border border-slate-200 rounded-2xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Item Total</p>
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] font-black text-indigo-500">Rs.</span>
                                <p className="text-2xl font-black text-slate-900 tracking-tighter">
                                    {Math.round(itemTotal).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        <div className="space-y-6">
                            <FullInput label="Net Weight (G)" disabled={!isEditing} value={item.netWeight} isNumber onChange={(v) => onUpdate(index, 'netWeight', '', v)} />
                            <div className="grid grid-cols-2 gap-4">
                                <FullInput label="Wastage (%)" disabled={!isEditing} value={item.wastagePercent} isNumber onChange={(v) => onUpdate(index, 'wastagePercent', '', v)} />
                                <FullInput label="Wastage (G)" disabled value={wastageGrams.toFixed(3)} isNumber onChange={() => { }} />
                            </div>
                            <FullInput label="Purity" disabled={!isEditing} value={item.carat} onChange={(v) => onUpdate(index, 'carat', '', v)} />
                        </div>
                        <div className="space-y-6">
                            <FullInput label="Labour Charges" disabled={!isEditing} value={item.making} isNumber onChange={(v) => onUpdate(index, 'making', '', v)} />
                            <FullInput label="Stones Total" disabled value={stonesTotal} isNumber onChange={() => { }} />
                            <FullInput label="Worker" disabled={!isEditing} value={item.workerName} onChange={(v) => onUpdate(index, 'workerName', '', v)} />
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
                    <button onClick={onPrint} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">
                        <Printer size={14} /> Print This Item
                    </button>
                </div>
            </div>
        </div>
    );
};