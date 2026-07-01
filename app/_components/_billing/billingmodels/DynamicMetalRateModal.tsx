"use client"
import { Sparkles, X } from "lucide-react";

interface DynamicMetalRateModalProps {
    isOpen: boolean;
    tempRate: string;
    pendingItem: any;
    rateLabel: string;
    setTempRate: (value: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}

const DynamicMetalRateModal = ({
    isOpen,
    tempRate,
    pendingItem,
    rateLabel = '',
    setTempRate,
    onClose,
    onConfirm,
}: DynamicMetalRateModalProps) => {
    if (!isOpen) return null;

    // Safe extraction variable using optional fallback to prevent .toLowerCase() crash flags
    const normalizedLabel = (rateLabel || '').toLowerCase();

    // Helper to check if the current target is an alternative metal vs standard gold carat
    const isPerGramMetal = ['silver', 'platinum'].includes(normalizedLabel);
    const isPalladium = normalizedLabel === 'palladium';

    // Set layout badge copy dynamically
    const rateBadgeText = isPalladium ? "Rate / Ct" : isPerGramMetal ? "Rate / Gram" : "Rate / Tola";

    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-100 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={16} />
                </button>

                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                        <Sparkles size={18} />
                    </div>

                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                        {rateLabel || 'Metal'} Rate Required
                    </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    You just scanned a <span className="font-bold text-slate-700">{rateLabel || 'new'}</span> item (
                    <span className="font-bold text-slate-700">
                        {pendingItem?.itemCode}
                    </span>
                    ). Please specify the active market evaluation rate below.
                </p>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-4 min-w-[70px]">
                        {rateBadgeText}
                    </span>

                    <div className="flex items-center gap-1 border-l pl-4 flex-1">
                        <span className="text-amber-600 font-bold text-xs">
                            Rs.
                        </span>

                        <input
                            type="number"
                            autoFocus
                            placeholder={`Enter rate`}
                            value={tempRate}
                            onChange={(e) => setTempRate(e.target.value)}
                            className="bg-transparent font-bold text-slate-800 outline-none w-full text-sm"
                        />
                    </div>
                </div>

                <button
                    onClick={onConfirm}
                    disabled={!tempRate}
                    className="w-full py-2.5 bg-slate-900 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold tracking-widest uppercase shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800"
                >
                    Add {rateLabel || 'Metal'} Rate
                </button>
            </div>
        </div>
    );
};

export default DynamicMetalRateModal;