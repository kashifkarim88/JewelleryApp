"use client"
import React, { useEffect, useState } from 'react';
import { Gem, Instagram, Phone, Mail, MapPin, ArrowUpRight, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGoldStore } from '../hooks/useGoldStore'; // Adjust path based on your folder structure

export default function IndexPage() {
    // 1. Consume the global state values and mutators from Zustand
    const { rate21ct, rate24ct, setRate21ct, setRate24ct } = useGoldStore();
    console.log("Current 21ct Rate:", rate21ct);
    console.log("Current 24ct Rate:", rate24ct);

    // 2. Prevent hydration mismatches (Next.js server vs client rendering)
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="h-[calc(100vh-138px)] w-full bg-[#fafafa] overflow-hidden flex flex-col justify-between font-sans text-slate-900 relative p-6 md:p-10 select-none">

            {/* BACKGROUND BLUR DECOR */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-amber-100/30 to-rose-50/20 rounded-full blur-[120px] pointer-events-none" />

            {/* 1. TOP HEADER: MINIMAL UTILITY BAR */}
            <header className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-700/80">
                        <Coins size={12} className="text-amber-600" />
                        <span>Live Valuation Desk</span>
                        <span>{rate21ct}</span>
                        <span>{rate24ct}</span>
                    </div>
                    <div className="flex flex-row gap-3">
                        <div className="relative group flex flex-col gap-1.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-amber-800 bg-amber-50 border border-amber-200/40 rounded-md px-1.5 py-0.5 w-fit shadow-2xs">
                                21ct Gold
                            </span>
                            <input
                                type="number"
                                placeholder="21ct Rate"
                                value={rate21ct}
                                onChange={(e) => setRate21ct(e.target.value)}
                                className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm px-4 py-2 rounded-xl text-xs font-medium focus:border-amber-500/50 focus:bg-white outline-none transition-all w-28 md:w-36 text-slate-700 placeholder-slate-400"
                            />
                        </div>
                        <div className="relative group flex flex-col gap-1.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-amber-800 bg-amber-50 border border-amber-200/40 rounded-md px-1.5 py-0.5 w-fit shadow-2xs">
                                24ct Gold
                            </span>
                            <input
                                type="number"
                                placeholder="24ct Rate"
                                value={rate24ct}
                                onChange={(e) => setRate24ct(e.target.value)}
                                className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm px-4 py-2 rounded-xl text-xs font-medium focus:border-amber-500/50 focus:bg-white outline-none transition-all w-28 md:w-36 text-slate-700 placeholder-slate-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-slate-400 text-[10px] tracking-[0.3em] uppercase font-medium">
                    <span>Est. 1998</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                    <span>Crafted Luxury</span>
                </div>
            </header>

            {/* 2. HERO HERO HERO BRANDING */}
            <main className="flex-1 flex flex-col items-center justify-center text-center z-10 my-auto">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <div className="mb-6 relative group cursor-pointer">
                        <div className="absolute -inset-4 bg-amber-200/20 rounded-full blur-xl group-hover:bg-amber-300/30 transition-all duration-700" />
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                            <Gem size={26} className="text-amber-700 transition-transform duration-700 group-hover:rotate-45" strokeWidth={1.2} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-5xl md:text-8xl font-extralight tracking-[0.18em] uppercase text-slate-800/90 font-serif leading-none">
                            Hamidullah
                        </h1>
                        <h2 className="text-lg md:text-2xl font-semibold tracking-[0.35em] uppercase text-amber-700/90 pt-1">
                            Jewellery
                        </h2>
                    </div>

                    <div className="mt-8 max-w-[280px] md:max-w-md mx-auto flex flex-col items-center">
                        <div className="h-8 w-[1px] bg-gradient-to-b from-amber-600/60 to-transparent mb-4" />

                        {/* Interactive UI display revealing state updating in real-time */}
                        {rate24ct && (
                            <p className="text-[10px] font-bold text-amber-600 tracking-[0.2em] mb-2 uppercase animate-fade-in">
                                Current Active Basis: {rate24ct} / ct
                            </p>
                        )}

                        <p className="text-xs md:text-sm text-slate-400 tracking-[0.18em] uppercase leading-relaxed font-sans font-light">
                            Crafting the brilliance of your most precious moments.
                        </p>
                    </div>
                </motion.div>
            </main>

            {/* 3. FOOTER */}
            <footer className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-end border-t border-slate-200/40 pt-4 z-10">
                <div className="flex gap-3 justify-center md:justify-start">
                    {[
                        { Icon: Instagram, href: "#" },
                        { Icon: Phone, href: "#" },
                        { Icon: Mail, href: "#" }
                    ].map(({ Icon, href }, index) => (
                        <a
                            key={index}
                            href={href}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200/50 flex items-center justify-center text-slate-500 hover:text-amber-700 hover:border-amber-200 hover:shadow-sm transition-all duration-300"
                        >
                            <Icon size={16} strokeWidth={1.5} />
                        </a>
                    ))}
                </div>

                <div className="flex justify-center">
                    <div className="px-5 py-2.5 bg-slate-900 text-white rounded-full flex items-center gap-3 shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-colors cursor-pointer group">
                        <MapPin size={13} className="text-amber-400" />
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">Peshawar, PK</span>
                        <div className="w-[1px] h-3 bg-slate-700" />
                        <ArrowUpRight size={13} className="text-slate-400 group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" />
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end text-[9px] tracking-[0.25em] uppercase font-medium text-slate-400 gap-1">
                    <span>© 2026 Hamidullah Group</span>
                    <span className="text-amber-700/60">All Rights Reserved</span>
                </div>
            </footer>

            <div className="absolute inset-0 opacity-[0.012] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/fabric-of-the-nation.png')]" />
        </div>
    );
}