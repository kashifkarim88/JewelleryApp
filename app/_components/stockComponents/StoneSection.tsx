"use client";

import React from 'react';
import { Gem, Plus, Trash2 } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import InputBlock from './InputBlock';

export default function StoneSection({
    vals,
    setVals,
    refs,
    stoneList,
    stoneTypes = [], // 🚩 ADDED: Holds master list of stones pulled from database
    handleAddStone,
    handleRemoveStone,
    checkJump,
    showStone,
    setShowStone,
    isStoneDirty,
    setActiveModal
}: any) {
    return (
        <SectionWrapper
            title="Stone Details"
            icon={Gem}
            show={showStone}
            setShow={setShowStone}
            isDirty={isStoneDirty}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">

                    {/* 1. Stone Name (Modified to a Select Dropdown) */}
                    <div className="relative space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Stone Name
                            </label>
                        </div>
                        <div className="relative">
                            <select
                                value={vals.sName || ""}
                                onChange={(e) => setVals({ ...vals, sName: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-medium outline-none text-slate-800 transition-all focus:bg-white focus:border-blue-500 appearance-none"
                            >
                                <option value="" disabled className="text-slate-400">Select Stone...</option>
                                {stoneTypes.map((stone: any) => (
                                    <option key={stone.id || stone.name} value={stone.name}>
                                        {stone.name}
                                    </option>
                                ))}
                            </select>

                            {/* Inline Plus Button placement matches exact relative parameters */}
                            <button
                                onClick={() => setActiveModal('stone')}
                                className="absolute bg-gray-100 p-1 rounded-full right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors z-10"
                                type="button"
                                aria-label="Open stone modal"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
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

                    {/* 4. Price + Button */}
                    <div className="flex items-end gap-2">
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
                            className="h-[42px] w-[42px] flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all active:scale-95 shadow-md shadow-emerald-100 flex-shrink-0"
                        >
                            <Plus size={22} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Table Section (Preserved completely intact) */}
                {stoneList?.length > 0 && (
                    <div className="mt-4 overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Stone Name</th>
                                    <th className="px-4 py-3 text-center">Weight</th>
                                    <th className="px-4 py-3 text-center">Qty</th>
                                    <th className="px-4 py-3 text-right">Price</th>
                                    <th className="px-4 py-3 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stoneList.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors group">
                                        <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                                        <td className="px-4 py-3 text-center text-slate-600">{item.weight} ct</td>
                                        <td className="px-4 py-3 text-center text-slate-600">{item.qty} pcs</td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                                            {Number(item.price).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleRemoveStone(item.id)}
                                                className="p-1.5 text-slate-300 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </SectionWrapper>
    );
}