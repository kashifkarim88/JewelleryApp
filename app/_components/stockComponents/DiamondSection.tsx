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
        <SectionWrapper title="Diamond Details" icon={Hammer} show={showDiamond} setShow={setShowDiamond} isDirty={isDiamondDirty}>
            <div className="w-full text-slate-900 space-y-5">

                {/* --- Row 1: Diamond Selection Filters --- */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start relative z-40">

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
                                // 🚩 FIXED: Shows list instantly on input focus or click
                                onFocus={() => setIsOpen(true)}
                                placeholder="name"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(!isOpen);
                                }}
                                className="absolute right-10 bottom-3 flex items-center text-slate-400 hover:text-slate-600 z-10"
                            >
                                {fetchingOptions ? <Loader2 size={13} className="animate-spin" /> : <ChevronDown size={14} />}
                            </button>
                        </div>

                        <button
                            onClick={() => setActiveModal('diamond')} type="button"
                            className="absolute bg-slate-100 p-1 rounded-full right-3 bottom-2.5 text-slate-400 hover:text-blue-600 transition-colors z-10"
                        >
                            <Plus size={16} />
                        </button>

                        {/* Dropdown Options List */}
                        {isOpen && (
                            <div className="absolute left-0 right-0 z-[100] mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl max-h-48 overflow-y-auto divide-y divide-slate-50 min-w-[220px]">
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((opt) => (
                                        <button
                                            key={opt.id} type="button"
                                            className="w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                                            onClick={() => {
                                                setVals((prev: any) => ({ ...prev, dName: opt.name }));
                                                setIsOpen(false);
                                            }}
                                        >
                                            <span className="truncate text-slate-700 font-medium">{opt.name}</span>
                                            {(vals.dName || '').toLowerCase() === opt.name.toLowerCase() && <Check size={14} className="text-blue-600 shrink-0" />}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-3 text-xs text-slate-400 italic bg-slate-50/50">
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

                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <InputBlock label="Total Price" value={vals.dPrice} type="number" inputRef={refs.dPriceRef} onChange={(v: string) => setVals((prev: any) => ({ ...prev, dPrice: v }))} placeholder="0" />
                        </div>
                        <button
                            onClick={handleAddDiamond} type="button"
                            className="h-10.5 w-10.5 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all active:scale-95 shadow-md shadow-blue-200/50"
                        >
                            <Plus size={22} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* --- Row 3: Items Added Table Ledger --- */}
                {diamondList && diamondList.length > 0 && (
                    <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm relative z-10">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3">Diamond Name</th>
                                        <th className="px-4 py-3 text-center">4Cs Info</th>
                                        <th className="px-4 py-3 text-center">Measurement</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                        <th className="px-4 py-3 w-12 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {diamondList.map((item: DiamondItem) => (
                                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{item.name || 'Unnamed Diamond'}</td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <span className="inline-flex gap-1 text-slate-500 text-xs">
                                                    <b className="text-slate-700">{item.cut || '-'}</b>•<b>{item.clarity || '-'}</b>•<b>{item.color || '-'}</b>
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-slate-600 text-xs whitespace-nowrap">
                                                {Number(item.weight || 0)}ct @ {Number(item.rate || 0).toLocaleString()}{item.qty ? ` x ${item.qty}` : ''}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                                                {Number(item.price || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleRemoveDiamond(item.id)} type="button"
                                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                >
                                                    <Trash2 size={16} />
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