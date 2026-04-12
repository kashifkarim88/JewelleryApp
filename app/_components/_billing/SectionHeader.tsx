import { Printer } from 'lucide-react';

interface HeaderProps {
    goldRate: number;
    setGoldRate: (val: number) => void;
}

export const SectionHeader = ({ goldRate, setGoldRate }: HeaderProps) => (
    <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Billing Dashboard</h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">Hamidullah Jewellery</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center shadow-sm">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-4">Gold Rate</span>
            <div className="flex items-center gap-1.5 border-l border-slate-100 pl-4">
                <span className="text-amber-600 font-bold text-xs">Rs.</span>
                <input
                    type="number"
                    className="bg-transparent font-black text-slate-800 outline-none w-24 text-sm"
                    // If goldRate is 0, show empty string so the placeholder appears
                    value={goldRate === 0 ? '' : goldRate}
                    placeholder="0"
                    onChange={(e) => {
                        const val = e.target.value;
                        setGoldRate(val === '' ? 0 : Number(val));
                    }}
                />
            </div>
        </div>
    </header>
);