import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface SectionWrapperProps {
    title: string;
    icon: LucideIcon;
    show: boolean;
    setShow: (show: boolean) => void;
    isDirty?: boolean;
    children: React.ReactNode;
}

const SectionWrapper = ({
    title,
    icon: Icon,
    show,
    setShow,
    isDirty,
    children
}: SectionWrapperProps) => {
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200">
            <button
                onClick={() => setShow(!show)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                type="button"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Icon size={18} />
                    </div>
                    <span className="font-semibold text-slate-700">{title}</span>
                    {isDirty && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" title="Unsaved changes" />
                    )}
                </div>
                <div className="text-slate-400">
                    {show ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>

            {show && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/30">
                    {children}
                </div>
            )}
        </div>
    );
};

export default SectionWrapper;