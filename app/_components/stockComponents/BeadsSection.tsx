import React from 'react';
import { CircleDashed } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import InputBlock from './InputBlock';

export default function BeadsSection({
    vals,
    setVals,
    refs,
    checkJump,
    showBeads,
    setShowBeads,
    isBeadsDirty
}: any) {
    return (
        <SectionWrapper
            title="Beads Details"
            icon={CircleDashed}
            show={showBeads}
            setShow={setShowBeads}
            isDirty={isBeadsDirty}
            headerBg="bg-gradient-to-r from-blue-50/70 to-white hover:from-blue-100/60"
            iconBg="bg-blue-100/70"
            iconColor="text-blue-600"
        >
            <div className="w-full text-slate-900 space-y-4 max-w-5xl mx-auto relative">

                {/* --- Form Control Card (Premium Rose Quartz Pink Tints) --- */}
                <div className="p-5 bg-white border border-pink-100/60 shadow-sm rounded-2xl space-y-5 relative z-30">

                    {/* --- Row 1: Beads Input Fields Grid --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                        {/* Weight Field */}
                        <InputBlock
                            label="Beads Weight (g)"
                            value={vals.beadsWgt}
                            onChange={(v) => {
                                setVals({ ...vals, beadsWgt: v });
                                checkJump(v, refs.beadsQtyRef);
                            }}
                            placeholder="0.000"
                            type="number"
                            inputRef={refs.beadsWgtRef}
                        />

                        {/* Quantity Field */}
                        <InputBlock
                            label="Beads Quantity"
                            value={vals.beadsQty}
                            onChange={(v) => {
                                setVals({ ...vals, beadsQty: v });
                                checkJump(v, refs.beadsPriceRef);
                            }}
                            placeholder="0"
                            type="number"
                            inputRef={refs.beadsQtyRef}
                        />

                        {/* Price Field */}
                        <InputBlock
                            label="Price"
                            value={vals.beadsPrice}
                            onChange={(v) => setVals({ ...vals, beadsPrice: v })}
                            placeholder="0"
                            type="number"
                            inputRef={refs.beadsPriceRef}
                        />
                    </div>

                    {/* --- Row 2: Summary Info Ledger Block --- */}
                    {(vals.beadsWgt > 0 || vals.beadsPrice > 0) && (
                        <div className="p-4 bg-gradient-to-r from-pink-50/40 to-transparent rounded-xl border border-pink-100/40 transition-all">
                            <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                                Current Beads Summary
                            </p>
                            <div className="flex flex-wrap gap-y-2 justify-between items-center mt-2">
                                <span className="text-sm text-slate-600 font-medium">
                                    Total Beads Weight:{" "}
                                    <span className="inline-flex items-center px-2.5 py-0.5 ml-1 rounded-full bg-pink-50/50 border border-pink-100/30 text-rose-600 font-semibold text-xs">
                                        {vals.beadsWgt || 0} g
                                    </span>
                                </span>
                                <span className="text-sm text-slate-600 font-medium">
                                    Total Cost:{" "}
                                    <span className="text-[16px] font-bold text-slate-900 ml-1">
                                        ${Number(vals.beadsPrice || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SectionWrapper>
    );
}