"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Hammer, Plus, Trash2, Loader2, Check, ChevronDown } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import InputBlock from './InputBlock';

export interface DiamondItem {
    id: string;
    name: string;
    cut: string;
    clarity: string;
    color: string;
    weight: string | number;
    rate: string | number;
    qty: string | number;
    price: string | number;
}

interface DiamondSectionProps {
    vals: any;
    setVals: React.Dispatch<React.SetStateAction<any>>;
    refs: any;
    checkJump: (val: string, nextRef: React.RefObject<HTMLInputElement>) => void;
    diamondList: any[];
    handleAddDiamond: () => void;
    handleRemoveDiamond: (id: any) => void;
    setActiveModal: React.Dispatch<React.SetStateAction<any>>;
    showDiamond: boolean;
    setShowDiamond: React.Dispatch<React.SetStateAction<boolean>>;
    isDiamondDirty: boolean;
    diamondRefreshTrigger: number;
}

export default function DiamondSection({
    vals, setVals, refs, checkJump, diamondList, handleAddDiamond,
    handleRemoveDiamond, setActiveModal, showDiamond, setShowDiamond,
    isDiamondDirty, diamondRefreshTrigger
}: DiamondSectionProps) {

    const [options, setOptions] = useState<any[]>([]);
    const [fetchingOptions, setFetchingOptions] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const loadDropdownOptions = async () => {
        setFetchingOptions(true);
        try {
            const response = await fetch(`/api/diamond?t=${Date.now()}`, { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                setOptions(data || []);
            }
        } catch (err) {
            console.error("Error loading dropdown items:", err);
        } finally {
            setFetchingOptions(false);
        }
    };

    useEffect(() => { loadDropdownOptions(); }, []);
    useEffect(() => { if (diamondRefreshTrigger > 0) loadDropdownOptions(); }, [diamondRefreshTrigger]);
    useEffect(() => { loadDropdownOptions(); }, [diamondList?.length]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter((opt) =>
        (opt.name || '').toLowerCase().includes((vals.dName || '').toLowerCase())
    );

    const calculatePrice = (weight: string, rate: string, qty: string): string => {
        const w = parseFloat(weight) || 0;
        const r = parseFloat(rate) || 0;
        const q = parseFloat(qty);
        let rawPrice = w * r;
        if (!isNaN(q) && qty.trim() !== '') rawPrice = rawPrice * q;
        return rawPrice > 0 ? Math.round(rawPrice).toString() : '';
    };

    return (
        <SectionWrapper
            title="Diamond Details"
            icon={Hammer}
            show={showDiamond}
            setShow={setShowDiamond}
            isDirty={isDiamondDirty}
            headerBg="bg-gradient-to-r from-green-50/70 to-white hover:from-green-100/60"
            iconBg="bg-green-100/70"
            iconColor="text-green-600"
        >
            {/* Main Outer Container - High default layout safety */}
            <div className="w-full text-slate-900 space-y-6 max-w-5xl mx-auto relative">

                {/* --- Form Control Card --- */}
                {/* Notice: No overflow-hidden here so absolute menus drop safely over the layout */}
                <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-5 backdrop-blur-sm relative z-50">

                    {/* --- Row 1: Diamond Selection Filters --- */}
                    {/* Kept at z-50 layer hierarchy to cleanly float options above row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start relative z-50">

                        {/* Dropdown Input Column Block */}
                        <div className="relative" ref={dropdownRef}>
                            <div className="relative">
                                <InputBlock
                                    label="Diamond Name"
                                    value={vals.dName || ''}
                                    onChange={(v: string) => {
                                        setVals((prev: any) => ({ ...prev, dName: v }));
                                        setIsOpen(true);
                                    }}
                                    onFocus={() => setIsOpen(true)}
                                    placeholder="Select or enter name"
                                />

                                {/* Refined Clean Floating Trigger Block */}
                                <div className="absolute right-3 bottom-2.5 flex items-center gap-1.5 z-10 bg-white pl-1.5 py-0.5 rounded-md">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsOpen(!isOpen);
                                        }}
                                        className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                                    >
                                    </button>
                                    <button
                                        onClick={() => setActiveModal('diamond')}
                                        type="button"
                                        className="p-1 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                                    >
                                        <Plus size={14} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>

                            {/* Dropdown Options Float Drawer */}
                            {isOpen && (
                                <div className="absolute left-0 right-0 top-full z-[9999] mt-2 bg-white border border-slate-200/90 shadow-2xl rounded-xl max-h-52 overflow-y-auto divide-y divide-slate-100 min-w-[240px]">
                                    {filteredOptions.length > 0 ? (
                                        filteredOptions.map((opt: any) => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                                                onClick={() => {
                                                    setVals((prev: any) => ({ ...prev, dName: opt.name }));
                                                    setIsOpen(false);
                                                }}
                                            >
                                                <span className="truncate text-slate-700 font-medium">{opt.name}</span>
                                                {(vals.dName || '').toLowerCase() === opt.name.toLowerCase() && (
                                                    <Check size={14} className="text-blue-600 shrink-0" />
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-xs text-slate-400 italic bg-slate-50/50">
                                            No matches found. Click '+' to create a new record.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <InputBlock label="Cut" value={vals.dCut} onChange={(v: string) => setVals((prev: any) => ({ ...prev, dCut: v }))} placeholder="Excellent..." />
                        <InputBlock label="Clarity" value={vals.dClarity} onChange={(v: string) => setVals((prev: any) => ({ ...prev, dClarity: v }))} placeholder="VVS1..." />
                        <InputBlock label="Color" value={vals.dColor} onChange={(v: string) => setVals((prev: any) => ({ ...prev, dColor: v }))} placeholder="D, E, F..." />
                    </div>

                    {/* --- Row 2: Metrics fields --- */}
                    {/* Stacked lower at z-10 so dropdown selection naturally sweeps over it */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end relative z-10">
                        <InputBlock
                            label="Weight (ct)" value={vals.dWgt} type="number" inputRef={refs.dWgtRef} placeholder="0.000"
                            onChange={(v: string) => {
                                setVals((prev: any) => ({ ...prev, dWgt: v, dPrice: calculatePrice(v, prev.dRate, prev.dQty) }));
                                checkJump(v, refs.dRateRef);
                            }}
                        />
                        <InputBlock
                            label="Rate" value={vals.dRate} type="number" inputRef={refs.dRateRef} placeholder="0"
                            onChange={(v: string) => {
                                setVals((prev: any) => ({ ...prev, dRate: v, dPrice: calculatePrice(prev.dWgt, v, prev.dQty) }));
                                checkJump(v, refs.dQtyRef);
                            }}
                        />
                        <InputBlock
                            label="Quantity" value={vals.dQty} type="number" inputRef={refs.dQtyRef} placeholder="0"
                            onChange={(v: string) => {
                                setVals((prev: any) => ({ ...prev, dQty: v, dPrice: calculatePrice(prev.dWgt, prev.dRate, v) }));
                                checkJump(v, refs.dPriceRef);
                            }}
                        />

                        {/* Inline Dynamic Pricing Frame */}
                        <div className="flex items-end gap-3">
                            <div className="flex-1">
                                <InputBlock label="Total Price" value={vals.dPrice} type="number" inputRef={refs.dPriceRef} onChange={(v: string) => setVals((prev: any) => ({ ...prev, dPrice: v }))} placeholder="0" />
                            </div>
                            <button
                                onClick={handleAddDiamond}
                                type="button"
                                className="h-10 w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl transition-all active:scale-[0.97] shadow-sm hover:shadow-md hover:shadow-blue-100"
                            >
                                <Plus size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Row 3: Items Added Table Ledger --- */}
                {diamondList && diamondList.length > 0 && (
                    <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-sm relative z-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold text-[11px] tracking-wider uppercase">
                                    <tr>
                                        <th className="px-5 py-3.5">Diamond Name</th>
                                        <th className="px-5 py-3.5 text-center">4Cs Profile</th>
                                        <th className="px-5 py-3.5 text-center">Measurement Pricing</th>
                                        <th className="px-5 py-3.5 text-right">Total</th>
                                        <th className="px-5 py-3.5 w-14 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/80">
                                    {diamondList.map((item: DiamondItem) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">
                                                {item.name || 'Unnamed Diamond'}
                                            </td>
                                            <td className="px-5 py-4 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600 text-xs font-medium">
                                                    <span>{item.cut || '-'}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span>{item.clarity || '-'}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span>{item.color || '-'}</span>
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center text-slate-500 text-xs whitespace-nowrap font-medium">
                                                <span className="text-slate-700 font-semibold">{Number(item.weight || 0)}</span>ct
                                                <span className="text-slate-300 mx-1.5">@</span>
                                                <span className="text-slate-700">${Number(item.rate || 0).toLocaleString()}</span>
                                                {item.qty ? (
                                                    <>
                                                        <span className="text-slate-300 mx-1.5">×</span>
                                                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">{item.qty}</span>
                                                    </>
                                                ) : ''}
                                            </td>
                                            <td className="px-5 py-4 text-right font-bold text-slate-900 whitespace-nowrap text-[15px]">
                                                ${Number(item.price || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    onClick={() => handleRemoveDiamond(item.id)}
                                                    type="button"
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </SectionWrapper>
    );
}