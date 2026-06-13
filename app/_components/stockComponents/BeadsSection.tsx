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
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                {/* Summary Info (Optional but helpful for UI neatness) */}
                {(vals.beadsWgt > 0 || vals.beadsPrice > 0) && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Current Beads Summary</p>
                        <div className="flex justify-between mt-1">
                            <span className="text-sm text-slate-700">Total Beads Weight: <span className="font-bold">{vals.beadsWgt || 0} g</span></span>
                            <span className="text-sm text-slate-700">Total Cost: <span className="font-bold">{Number(vals.beadsPrice || 0).toLocaleString()}</span></span>
                        </div>
                    </div>
                )}
            </div>
        </SectionWrapper>
    );
}