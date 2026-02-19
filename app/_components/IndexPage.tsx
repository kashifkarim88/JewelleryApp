"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Diamond, Sparkles } from 'lucide-react';

export default function IndexPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center relative px-6 py-12 bg-white selection:bg-amber-100">

            {/* Soft Light Background Accents */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-50/60 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/50 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 text-center max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-50 to-white border border-amber-100 shadow-sm"
                >
                    <Diamond className="text-amber-500" size={28} strokeWidth={1.5} />
                </motion.div>

                <div className="space-y-2">
                    <motion.div
                        initial={{ opacity: 0, letterSpacing: "0.1em" }}
                        animate={{ opacity: 1, letterSpacing: "0.4em" }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="flex items-center justify-center gap-2 text-amber-600 font-bold text-[10px] uppercase mb-2"
                    >
                        <Sparkles size={12} /> Exquisite Artistry
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight"
                    >
                        HAMMID ULLAH <br />
                        <span className="font-light italic text-slate-500">JEWELLERY</span>
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="mt-6 border-t border-slate-100 pt-6"
                >
                    <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-md mx-auto">
                        Crafting timeless elegance and bespoke brilliance for over three decades.
                        Your legacy, beautifully set in gold.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "40px" }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="h-[2px] bg-amber-200 mx-auto mt-8"
                />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-12 text-[9px] font-bold text-slate-300 uppercase tracking-[0.6em]"
            >
                Premium Standards Only
            </motion.div>
        </div>
    );
}