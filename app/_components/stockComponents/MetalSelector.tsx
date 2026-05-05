import React from 'react';

interface MetalSelectorProps {
    selectedMetal: string;
    setSelectedMetal: (metal: string) => void;
    selectedCarat: string;
    setSelectedCarat: (carat: string) => void;
    vals: any;
    setVals: (vals: any) => void;
    metalConfig: any;
}

const METALS = ["Gold", "Palladium", "Platinum", "Silver"];
const GOLD_CARATS = ["24K", "22K", "21K", "20K", "18K", "14K"];

export const MetalSelector = ({
    selectedMetal, setSelectedMetal, selectedCarat, setSelectedCarat, vals, setVals, metalConfig
}: MetalSelectorProps) => {
    return (
        <div className="flex p-2 items-center gap-3 overflow-x-auto scrollbar-hide">
            {selectedMetal === "Gold" && (
                <div className={`flex items-center gap-1 backdrop-blur-sm p-1.5 rounded-2xl border shadow-sm shrink-0 ${metalConfig.Gold.caratContainer}`}>
                    {GOLD_CARATS.map((carat) => (
                        <button
                            key={carat}
                            onClick={() => setSelectedCarat(carat)}
                            className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all ${selectedCarat === carat ? metalConfig.Gold.caratActive : metalConfig.Gold.caratInactive}`}
                        >
                            {carat}
                        </button>
                    ))}
                </div>
            )}

            {selectedMetal === "Palladium" && (
                <div className="flex items-center gap-2 bg-cyan-50/80 backdrop-blur-sm px-3 py-1.5 rounded-2xl border border-cyan-100 shadow-sm shrink-0">
                    <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider">Purity %:</span>
                    <input
                        type="number"
                        className="w-16 bg-white border border-cyan-200 rounded-lg px-2 py-1 text-xs font-bold text-cyan-800 outline-none focus:border-cyan-500"
                        value={vals.palladiumPercentage || "33"}
                        onChange={(e) => setVals({ ...vals, palladiumPercentage: e.target.value })}
                    />
                </div>
            )}

            <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                {METALS.map((metal) => (
                    <label key={metal} className="flex items-center cursor-pointer">
                        <input type="radio" className="hidden" name="metal" checked={selectedMetal === metal} onChange={() => setSelectedMetal(metal)} />
                        <span className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase border-2 transition-all duration-300 ${selectedMetal === metal ? metalConfig[metal].bg : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                            {metal}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};