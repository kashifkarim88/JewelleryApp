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
    headerBg?: string;    // Custom background class for the header
    iconBg?: string;      // Custom background class for the icon container
    iconColor?: string;   // Custom text/stroke color class for the icon
}

const SectionWrapper = ({
    title,
    icon: Icon,
    show,
    setShow,
    isDirty,
    children,
    headerBg = 'bg-white hover:bg-slate-50', // Clean default fallback
    iconBg = 'bg-slate-100',
    iconColor = 'text-slate-600'
}: SectionWrapperProps) => {
    return (
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-200">
            <button
                onClick={() => setShow(!show)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${headerBg}`}
                type="button"
            >
                <div className="flex items-center gap-3">
                    {/* The dynamic gemstone-themed icon container */}

                    <div className={`p-2 rounded-xl transition-colors ${iconBg} ${iconColor}`}>
                        <Icon size={18} />
                    </div>

                    <span className="font-bold text-slate-800 tracking-wide text-[14px]">
                        {title}
                    </span>

                    {/* Synchronized indicator dot if section is dirty */}
                    {isDirty && (
                        <span className={`h-2 w-2 rounded-full animate-pulse ${iconColor}`} title="Unsaved changes" />
                    )}
                </div>
                <div className="text-slate-400 mr-1">
                    {show ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </button>

            {show && (
                <div className="p-5 border-t border-slate-100/80 bg-white">
                    {children}
                </div>
            )}
        </div>
    );
};

export default SectionWrapper;