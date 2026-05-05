import React from 'react';
import { Plus } from 'lucide-react';

interface InputBlockProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    onAction?: () => void;
}

const InputBlock = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    inputRef,
    onAction
}: InputBlockProps) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-0.5 ml-1">
                {label}
            </label>
            <div className="relative flex items-center">
                <input
                    ref={inputRef}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm text-slate-700 ${onAction ? 'pr-10' : ''}`}
                />
                {onAction && (
                    <button
                        type="button"
                        onClick={onAction}
                        className="absolute right-2 p-1.5 bg-gray-100 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
                    >
                        <Plus size={18} strokeWidth={3} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputBlock;