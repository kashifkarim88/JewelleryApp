"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useGoldStore } from '@/app/hooks/useGoldStore';
import { Gem, Coins, ShieldCheck, Edit2 } from 'lucide-react';

export const SectionHeader = () => {
    // Pull the active states and sync mutators directly from Zustand
    const { rate21ct, rate24ct, ratePalladium, setRate21ct, setRate24ct, setRatePalladium } = useGoldStore();

    // Prevent Next.js hydration mismatch anomalies
    const [isMounted, setIsMounted] = useState(false);

    // Tracks which field is active: '24ct' | '21ct' | 'palladium' | null
    const [activeEdit, setActiveEdit] = useState<string | null>(null);

    // Dynamic local input buffer states
    const [val24, setVal24] = useState('');
    const [val21, setVal21] = useState('');
    const [valPl, setValPl] = useState('');

    useEffect(() => {
        setIsMounted(true);
        if (rate24ct) setVal24(rate24ct);
        if (rate21ct) setVal21(rate21ct);
        if (ratePalladium) setValPl(ratePalladium);
    }, [rate24ct, rate21ct, ratePalladium]);

    if (!isMounted) return null;

    // Save and close helpers
    const handleBlur = (field: string) => {
        if (field === '24ct') setRate24ct(val24);
        if (field === '21ct') setRate21ct(val21);
        if (field === 'palladium') setRatePalladium(valPl);
        setActiveEdit(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
        if (e.key === 'Enter') handleBlur(field);
        if (e.key === 'Escape') {
            // Revert changes on escape trigger
            setVal24(rate24ct || '');
            setVal21(rate21ct || '');
            setValPl(ratePalladium || '');
            setActiveEdit(null);
        }
    };

    return (
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 select-none">
            {/* BRANDING SECTION */}
            <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                    Billing Dashboard
                </h1>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Hamidullah Jewellery
                </p>
            </div>

            {/* DYNAMIC LIVE MARKET BADGES CONTAINER */}
            <div className="flex flex-wrap items-center gap-3">

                {/* 24ct Rate Badge */}
                {rate24ct && (
                    <div
                        onClick={() => setActiveEdit('24ct')}
                        className="bg-slate-900 border border-slate-950 px-4 py-2 rounded-xl flex items-center shadow-sm cursor-pointer hover:border-amber-500/50 transition-all group"
                    >
                        <div className="flex flex-col mr-4">
                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest leading-none">
                                24ct Pure Gold
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 border-l border-slate-800 pl-4 min-w-[90px]">
                            <Gem size={11} className="text-amber-500" />
                            <span className="text-white font-black text-xs tracking-tight mr-1">Rs.</span>
                            {activeEdit === '24ct' ? (
                                <input
                                    type="number"
                                    autoFocus
                                    className="bg-transparent font-black text-white text-xs tracking-tight outline-none w-16 border-b border-dashed border-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={val24}
                                    onChange={(e) => setVal24(e.target.value)}
                                    onBlur={() => handleBlur('24ct')}
                                    onKeyDown={(e) => handleKeyDown(e, '24ct')}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <span className="font-black text-white text-xs tracking-tight flex items-center gap-1">
                                    {Number(rate24ct).toLocaleString()}
                                    <Edit2 size={10} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* 21ct Rate Badge */}
                {rate21ct && (
                    <div
                        onClick={() => setActiveEdit('21ct')}
                        className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center shadow-sm cursor-pointer hover:border-indigo-500/50 transition-all group"
                    >
                        <div className="flex flex-col mr-4">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                21ct Gold Rate
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 border-l border-slate-100 pl-4 min-w-[90px]">
                            <Coins size={11} className="text-amber-600" />
                            <span className="text-slate-800 font-black text-xs tracking-tight mr-1">Rs.</span>
                            {activeEdit === '21ct' ? (
                                <input
                                    type="number"
                                    autoFocus
                                    className="bg-transparent font-black text-slate-800 text-xs tracking-tight outline-none w-16 border-b border-dashed border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={val21}
                                    onChange={(e) => setVal21(e.target.value)}
                                    onBlur={() => handleBlur('21ct')}
                                    onKeyDown={(e) => handleKeyDown(e, '21ct')}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <span className="font-black text-slate-800 text-xs tracking-tight flex items-center gap-1">
                                    {Number(rate21ct).toLocaleString()}
                                    <Edit2 size={10} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Palladium Rate Badge */}
                {ratePalladium && (
                    <div
                        onClick={() => setActiveEdit('palladium')}
                        className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center shadow-sm cursor-pointer hover:border-slate-400 transition-all group"
                    >
                        <div className="flex flex-col mr-4">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                Palladium / Ct
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4 min-w-[90px]">
                            <ShieldCheck size={11} className="text-slate-400" />
                            <span className="text-slate-700 font-black text-xs tracking-tight mr-1">Rs.</span>
                            {activeEdit === 'palladium' ? (
                                <input
                                    type="number"
                                    autoFocus
                                    className="bg-transparent font-black text-slate-700 text-xs tracking-tight outline-none w-16 border-b border-dashed border-slate-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={valPl}
                                    onChange={(e) => setValPl(e.target.value)}
                                    onBlur={() => handleBlur('palladium')}
                                    onKeyDown={(e) => handleKeyDown(e, 'palladium')}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <span className="font-black text-slate-700 text-xs tracking-tight flex items-center gap-1">
                                    {Number(ratePalladium).toLocaleString()}
                                    <Edit2 size={10} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                                </span>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </header>
    );
};