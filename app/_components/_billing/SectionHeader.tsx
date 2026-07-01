"use client";

import React, { useEffect, useState } from 'react';
import { useGoldStore } from '@/app/hooks/useGoldStore';
import { Edit2, LucideIcon, Sparkles, Shield, Disc, Loader2 } from 'lucide-react';

interface MetalItem {
    id: string;
    shortLabel: string;
    icon: LucideIcon;
    isPremium: boolean;
    getGlobalRate: (store: any) => string;
    setGlobalRate: (store: any, val: string) => Promise<void> | void;
}

const METALS_CONFIG: MetalItem[] = [
    { id: '24ct', shortLabel: '24K', icon: Sparkles, isPremium: true, getGlobalRate: (s) => s.rate24ct, setGlobalRate: async (s, v) => await s.setRate24ct(v) },
    { id: '22ct', shortLabel: '22K', icon: Disc, isPremium: false, getGlobalRate: (s) => s.rate22ct, setGlobalRate: async (s, v) => await s.setRate22ct(v) },
    { id: '21ct', shortLabel: '21K', icon: Disc, isPremium: false, getGlobalRate: (s) => s.rate21ct, setGlobalRate: async (s, v) => await s.setRate21ct(v) },
    { id: '20ct', shortLabel: '20K', icon: Disc, isPremium: false, getGlobalRate: (s) => s.rate20ct, setGlobalRate: async (s, v) => await s.setRate20ct(v) },
    { id: '18ct', shortLabel: '18K', icon: Disc, isPremium: false, getGlobalRate: (s) => s.rate18ct, setGlobalRate: async (s, v) => await s.setRate18ct(v) },
    { id: '14ct', shortLabel: '14K', icon: Disc, isPremium: false, getGlobalRate: (s) => s.rate14ct, setGlobalRate: async (s, v) => await s.setRate14ct(v) },
    { id: 'palladium', shortLabel: 'PL', icon: Shield, isPremium: false, getGlobalRate: (s) => s.ratePalladium, setGlobalRate: async (s, v) => await s.setRatePalladium(v) },
];

export const SectionHeader = () => {
    const store = useGoldStore();
    const [isMounted, setIsMounted] = useState(false);
    const [activeEdit, setActiveEdit] = useState<string | null>(null);
    const [localValues, setLocalValues] = useState<Record<string, string>>({});
    const [syncingStates, setSyncingStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setIsMounted(true);
        const freshValues: Record<string, string> = {};
        METALS_CONFIG.forEach(metal => {
            freshValues[metal.id] = metal.getGlobalRate(store) || '';
        });
        setLocalValues(freshValues);
    }, [
        store.rate24ct, store.rate22ct, store.rate21ct,
        store.rate20ct, store.rate18ct, store.rate14ct, store.ratePalladium
    ]);

    if (!isMounted) return null;

    const handleCommitChange = async (metal: MetalItem) => {
        const rawValue = localValues[metal.id];
        const lastValidValue = metal.getGlobalRate(store) || '';

        const parsedValue = parseFloat(rawValue);
        if (isNaN(parsedValue) || parsedValue <= 0) {
            setLocalValues(prev => ({ ...prev, [metal.id]: lastValidValue }));
            setActiveEdit(null);
            return;
        }

        if (parsedValue === parseFloat(lastValidValue)) {
            setActiveEdit(null);
            return;
        }

        const cleanStringValue = parsedValue.toString();
        setActiveEdit(null);
        setSyncingStates(prev => ({ ...prev, [metal.id]: true }));

        try {
            await metal.setGlobalRate(store, cleanStringValue);
        } catch (error) {
            console.error(`Production Error Syncing ${metal.id}:`, error);
            alert(`Failed to save updated price for ${metal.shortLabel}. Reverting to previous rate.`);
            setLocalValues(prev => ({ ...prev, [metal.id]: lastValidValue }));
        } finally {
            setSyncingStates(prev => ({ ...prev, [metal.id]: false }));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, metal: MetalItem) => {
        if (e.key === 'Enter') {
            (e.currentTarget as HTMLElement).blur();
        }
        if (e.key === 'Escape') {
            setLocalValues(prev => ({ ...prev, [metal.id]: metal.getGlobalRate(store) || '' }));
            setActiveEdit(null);
        }
    };

    return (
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 select-none">
            {/* BRANDING SECTION */}
            <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">
                    Billing Dashboard
                </h1>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.15em] mt-0.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    Hamidullah Jewellery
                </p>
            </div>

            {/* COMPACT DASHBOARD STATUS GRID */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 max-w-4xl">
                {METALS_CONFIG.map((metal) => {
                    const globalRate = metal.getGlobalRate(store);

                    // FIXED: Changed number comparison '0' to string comparison '0' or "0"
                    if (!globalRate && globalRate !== '0') return null;

                    const Icon = metal.icon;
                    const isEditing = activeEdit === metal.id;
                    const isSyncing = syncingStates[metal.id];

                    return (
                        <div
                            key={metal.id}
                            onClick={() => !isSyncing && setActiveEdit(metal.id)}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all group ${isSyncing ? 'opacity-50 pointer-events-none cursor-not-allowed ' : 'cursor-pointer '
                                }${metal.isPremium
                                    ? 'bg-slate-900 border-slate-950 text-white hover:bg-slate-800'
                                    : 'bg-slate-50 border-slate-200/60 text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            {/* Shortened Label Block */}
                            <div className="flex items-center gap-1 font-bold text-[10px] tracking-wider uppercase opacity-80">
                                {isSyncing ? (
                                    <Loader2 size={10} className="animate-spin text-amber-500" />
                                ) : (
                                    <Icon size={10} className={metal.isPremium ? 'text-amber-400' : 'text-slate-400'} />
                                )}
                                <span>{metal.shortLabel}</span>
                            </div>

                            <span className="opacity-30 font-light">|</span>

                            {/* Safe Input Content Frame */}
                            <div className="flex items-center gap-0.5 font-bold min-w-[55px]">
                                <span className="text-[10px] opacity-70 mr-0.5">Rs.</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        autoFocus
                                        min="1"
                                        step="any"
                                        className={`bg-transparent font-bold text-xs outline-none w-14 border-b border-dashed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${metal.isPremium ? 'text-white border-amber-400' : 'text-slate-800 border-slate-500'
                                            }`}
                                        value={localValues[metal.id] ?? ''}
                                        onChange={(e) => setLocalValues(prev => ({ ...prev, [metal.id]: e.target.value }))}
                                        onBlur={() => handleCommitChange(metal)}
                                        onKeyDown={(e) => handleKeyDown(e, metal)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <span className="flex items-center gap-1">
                                        {Number(globalRate).toLocaleString()}
                                        {!isSyncing && (
                                            <Edit2 size={9} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </header>
    );
};