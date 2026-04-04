import { LucideIcon } from 'lucide-react';
import React from 'react';

// 1. READ ONLY STAT: Used for Net Weight, Purity, etc.
export const ReadOnlyStat = ({
    label,
    value,
    unit = "",
    className = ""
}: {
    label: string,
    value: any,
    unit?: string,
    className?: string
}) => (
    <div className={`flex justify-between items-center border-b border-slate-100 pb-2 ${className}`}>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
        <span className="text-xs font-bold text-slate-700">
            {value || 0}
            <span className="text-[9px] text-slate-300 ml-0.5 font-medium">{unit}</span>
        </span>
    </div>
);

// 2. FULL INPUT: Added disabled prop
export const FullInput = ({
    label,
    value,
    onChange,
    isNumber = false,
    placeholder = "",
    className = "",
    disabled = false // Added
}: {
    label: string,
    value: any,
    onChange: (v: any) => void,
    isNumber?: boolean,
    placeholder?: string,
    className?: string,
    disabled?: boolean // Added
}) => (
    <div className={`space-y-1 ${className}`}>
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wide">
            {label}
        </label>
        <input
            type={isNumber ? "number" : "text"}
            placeholder={placeholder}
            disabled={disabled} // Added
            className={`w-full border rounded-lg px-3 py-2 text-xs font-bold outline-none transition-all 
                ${disabled
                    ? 'bg-slate-100 border-slate-100 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-400 placeholder:text-slate-300 placeholder:font-normal'
                }`}
            value={value || ''}
            onChange={(e) => {
                const val = e.target.value;
                onChange(isNumber ? (val === '' ? 0 : Number(val)) : val);
            }}
        />
    </div>
);

// 3. DETAIL BOX: Container for Diamond/Stone/Bead groups
export const DetailBox = ({
    children,
    icon: Icon,
    title,
    color,
    className = ""
}: {
    children: React.ReactNode,
    icon: LucideIcon,
    title: string,
    color: 'blue' | 'cyan' | 'purple',
    className?: string
}) => {
    const styles = {
        blue: 'bg-blue-50/20 border-blue-100 text-blue-600',
        cyan: 'bg-cyan-50/20 border-cyan-100 text-cyan-600',
        purple: 'bg-purple-50/20 border-purple-100 text-purple-600'
    };

    return (
        <div className={`p-5 rounded-xl border ${styles[color]} ${className}`}>
            <div className="flex items-center gap-2 mb-4 border-b border-current border-opacity-10 pb-2">
                <Icon size={14} className="opacity-70" />
                <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
            </div>
            <div className="text-slate-900">
                {children}
            </div>
        </div>
    );
};