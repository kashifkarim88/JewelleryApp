"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Gem, Plus, Trash2, Check } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import InputBlock from './InputBlock';

interface StoneItem {
    id: string;
    name: string;
    weight?: string | number;
    qty?: string | number;
    price?: string | number;
}

export default function StoneSection({
    vals,
    setVals,
    refs,
    stoneList,
    stoneTypes = [], // Holds master list of stones pulled from database
    handleAddStone,
    handleRemoveStone,
    checkJump,
    showStone,
    setShowStone,
    isStoneDirty,
    setActiveModal
}: any) {
    // 🚩 FIXED: Internal state for handling the custom combobox dropdown cleanly
    const [isStoneOpen, setIsStoneOpen] = useState(false);
    const stoneDropdownRef = useRef<HTMLDivElement>(null);

    // Filter master list options based on user text entry
    const filteredStoneOptions = stoneTypes.filter((stone: any) =>
        stone?.name?.toLowerCase().includes((vals.sName || '').toLowerCase())
    );

    // Close the dropdown cleanly if clicking anywhere outside the component
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (stoneDropdownRef.current && !stoneDropdownRef.current.contains(event.target as Node)) {
                setIsStoneOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <SectionWrapper
            title="Stone Details"
            icon={Gem}
            show={showStone}
            setShow={setShowStone}
            isDirty={isStoneDirty}
            headerBg="bg-gradient-to-r from-pink-50/70 to-white hover:from-pink-100/60"
            iconBg="bg-pink-100/70"
            iconColor="text-pink-600"
        >
            <div className="w-full text-slate-900 space-y-6 max-w-5xl mx-auto relative">

                {/* --- Form Control Card (Premium Rose Quartz Pink Tints) --- */}
                <div className="p-5 bg-white border border-gray-50 shadow-sm rounded-2xl space-y-5 relative z-30">

                    {/* --- Row 1: Stone Input Fields Grid --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start relative z-50">

                        {/* Searchable Combobox Input Block */}
                        <div className="relative" ref={stoneDropdownRef}>
                            <div className="relative">
                                <InputBlock
                                    label="Stone Name"
                                    value={vals.sName || ''}
                                    onChange={(v: string) => {
                                        setVals((prev: any) => ({ ...prev, sName: v }));
                                        setIsStoneOpen(true);
                                    }}
                                    onFocus={() => setIsStoneOpen(true)}
                                    placeholder="e.g. Rubby"
                                />

                                {/* Refined Clean Floating Trigger Block */}
                                <div className="absolute right-3 bottom-2.5 flex items-center gap-1.5 z-10 bg-white pl-1.5 py-0.5 rounded-md">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsStoneOpen(!isStoneOpen);
                                        }}
                                        className="p-1 text-slate-400 hover:text-green-500 rounded transition-colors"
                                    >
                                    </button>
                                    <button
                                        onClick={() => setActiveModal('stone')}
                                        type="button"
                                        className="p-1 bg-pink-50 text-green-500 hover:text-green-600 hover:bg-green-100 rounded-md transition-all"
                                    >
                                        <Plus size={14} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>

                            {/* Dropdown Options Float Menu */}
                            {isStoneOpen && (
                                <div className="absolute left-0 right-0 top-full z-[9999] mt-2 bg-white border border-pink-100 shadow-2xl rounded-xl max-h-48 overflow-y-auto divide-y divide-slate-50 min-w-[240px]">
                                    {filteredStoneOptions.length > 0 ? (
                                        filteredStoneOptions.map((opt: any) => (
                                            <button
                                                key={opt.id || opt.name}
                                                type="button"
                                                className="w-full px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-pink-50/50 flex items-center justify-between transition-colors"
                                                onClick={() => {
                                                    setVals((prev: any) => ({ ...prev, sName: opt.name }));
                                                    setIsStoneOpen(false);
                                                }}
                                            >
                                                <span className="truncate text-slate-700 font-medium">{opt.name}</span>
                                                {(vals.sName || '').toLowerCase() === opt.name.toLowerCase() && (
                                                    <Check size={14} className="text-rose-500 shrink-0" />
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

                        {/* 2. Weight */}
                        <InputBlock
                            label="Weight (ct)"
                            value={vals.sWgt}
                            onChange={(v: string) => {
                                setVals({ ...vals, sWgt: v });
                                checkJump(v, refs.sQtyRef);
                            }}
                            placeholder="0.000"
                            type="number"
                            inputRef={refs.sWgtRef}
                        />

                        {/* 3. Quantity */}
                        <InputBlock
                            label="Quantity"
                            value={vals.sQty}
                            onChange={(v: string) => {
                                setVals({ ...vals, sQty: v });
                                checkJump(v, refs.sPriceRef);
                            }}
                            placeholder="0"
                            type="number"
                            inputRef={refs.sQtyRef}
                        />

                        {/* 4. Price + Action Button (Rose Gold Palette) */}
                        <div className="flex items-end gap-3">
                            <div className="flex-1">
                                <InputBlock
                                    label="Price"
                                    value={vals.sPrice}
                                    onChange={(v: string) => setVals({ ...vals, sPrice: v })}
                                    placeholder="0"
                                    type="number"
                                    inputRef={refs.sPriceRef}
                                />
                            </div>
                            <button
                                onClick={handleAddStone}
                                type="button"
                                className="h-10 w-12 flex items-center justify-center bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl transition-all active:scale-[0.97] shadow-sm hover:shadow-md hover:shadow-green-100 flex-shrink-0"
                            >
                                <Plus size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Row 2: Items Added Table Ledger --- */}
                {stoneList?.length > 0 && (
                    <div className="overflow-hidden border border-pink-100/60 rounded-2xl bg-white shadow-sm relative z-10">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-pink-50/20 border-b border-pink-100/40 text-slate-500 font-semibold text-[11px] tracking-wider uppercase">
                                    <tr>
                                        <th className="px-5 py-3.5">Stone Name</th>
                                        <th className="px-5 py-3.5 text-center">Weight Metric</th>
                                        <th className="px-5 py-3.5 text-center">Quantity</th>
                                        <th className="px-5 py-3.5 text-right">Price</th>
                                        <th className="px-5 py-3.5 w-14 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {stoneList.map((item: StoneItem) => (
                                        <tr key={item.id} className="hover:bg-pink-50/10 transition-colors group">
                                            <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">
                                                {item.name}
                                            </td>
                                            <td className="px-5 py-4 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-pink-50/40 border border-pink-100/30 text-rose-600 text-xs font-medium">
                                                    {item.weight} ct
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center text-slate-500 text-xs whitespace-nowrap font-medium">
                                                <span className="px-2 py-0.5 rounded bg-slate-100/80 text-slate-600 font-bold">
                                                    {item.qty} pcs
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right font-bold text-slate-900 whitespace-nowrap text-[15px]">
                                                ${Number(item.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    onClick={() => handleRemoveStone(item.id)}
                                                    type="button"
                                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 focus:opacity-100"
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