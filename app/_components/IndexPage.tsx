"use client"
import React from 'react';
import { Gem, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export default function IndexPage() {
    return (
        /**
         * CALCULATION:
         * 100vh (Full Screen) 
         * - 64px (MainHeader) 
         * - 64px (The p-8 padding from your HomePage main tag: 32px top + 32px bottom)
         * Total subtraction: 128px
         */
        <div className="h-[calc(100vh-138px)] w-full bg-white overflow-hidden flex flex-col items-center justify-between font-sans text-slate-900 relative">

            {/* 1. TOP BUFFER */}
            <div className="h-4" />

            {/* 2. MAIN BRANDING */}
            <div className="flex flex-col items-center text-center px-4 animate-in fade-in duration-1000">

                {/* Diamond Icon */}
                <div className="mb-4 relative">
                    <div className="absolute -inset-4 bg-amber-50 rounded-full blur-xl animate-pulse" />
                    <Gem size={42} className="text-amber-600 relative" strokeWidth={1.2} />
                </div>

                {/* Brand Name */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase text-slate-800 leading-none">
                        Hamidullah
                    </h1>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase text-amber-700">
                        Jewellery
                    </h2>
                </div>

                {/* Attractive Tagline */}
                <div className="mt-6 max-w-[260px] md:max-w-md mx-auto">
                    <div className="h-[1px] w-8 bg-slate-200 mx-auto mb-4" />
                    <p className="text-sm md:text-lg text-slate-400 font-serif italic tracking-wide leading-relaxed">
                        "Crafting the brilliance of your most precious moments."
                    </p>
                </div>
            </div>

            {/* 3. COMPACT FOOTER */}
            <footer className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pb-2">

                {/* Socials */}
                <div className="flex gap-6 text-slate-300">
                    <Instagram size={18} className="hover:text-amber-600 transition-colors cursor-pointer" />
                    <Phone size={18} className="hover:text-amber-600 transition-colors cursor-pointer" />
                    <Mail size={18} className="hover:text-amber-600 transition-colors cursor-pointer" />
                </div>

                {/* Location & Copyright */}
                <div className="flex flex-col items-center md:items-end">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        <MapPin size={10} className="text-amber-600" />
                        Peshawar
                    </div>
                    <p className="text-[8px] text-slate-300 uppercase tracking-widest mt-1">
                        © 2026 Hamidullah Jewelery
                    </p>
                </div>
            </footer>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none select-none">
                <Gem size={120} />
            </div>
        </div>
    );
}