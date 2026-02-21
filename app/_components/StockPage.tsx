"use client"
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Package, Hammer, Gem, Camera, X, ChevronDown, ChevronUp, Lock, Plus } from 'lucide-react';
import CatWorker from './CatWorker';

// --- Types ---
interface Category {
    name: string;
    abbr: string;
    stcode: string;
}

interface FormValues {
    worker: string; making: string; netWeight: string; WastageGram: string; wastage: string;
    sName: string; sWgt: string; sPrice: string;
    bWgt: string; bPrice: string;
    dName: string; dWgt: string; dColor: string; dCut: string; dClarity: string; dRate: string; dPrice: string;
}

const CATEGORIES: Category[] = [
    { name: "Ring", abbr: "RG", stcode: "RG-001" },
    { name: "Necklace", abbr: "NK", stcode: "NK-001" },
    { name: "Bracelet", abbr: "BR", stcode: "BR-001" },
    { name: "Earrings", abbr: "ER", stcode: "ER-001" },
    { name: "Bangle", abbr: "BG", stcode: "BG-001" },
];

const METALS = ["Gold", "Palladium", "Platinum", "Silver"];
const GOLD_CARATS = ["24K", "22K", "21K", "18K", "14K"];

export default function StockPage() {
    // --- UI States ---
    const [selectedMetal, setSelectedMetal] = useState("Gold");
    const [selectedCarat, setSelectedCarat] = useState("21K");
    const [catSearch, setCatSearch] = useState("");
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [prodDescription, setProdDescription] = useState("");
    const [prodCode, setProdCode] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // --- Section Toggle States ---
    const [showStone, setShowStone] = useState(false);
    const [showBeads, setShowBeads] = useState(false);
    const [showDiamond, setShowDiamond] = useState(false);

    // --- Form Values ---
    const [vals, setVals] = useState<FormValues>({
        worker: "", making: "", netWeight: "", WastageGram: "", wastage: "",
        sName: "", sWgt: "", sPrice: "",
        bWgt: "", bPrice: "",
        dName: "", dWgt: "", dColor: "", dCut: "", dClarity: "", dRate: "", dPrice: ""
    });

    // --- Refs for Auto-Jump ---
    const catRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Header section refs
    const WastageGramRef = useRef<HTMLInputElement>(null);
    const wastageRef = useRef<HTMLInputElement>(null);
    const makingRef = useRef<HTMLInputElement>(null);

    // Stone section refs
    const sWgtRef = useRef<HTMLInputElement>(null);
    const sPriceRef = useRef<HTMLInputElement>(null);

    // Beads section refs
    const bPriceRef = useRef<HTMLInputElement>(null);

    // Diamond section refs
    const dWgtRef = useRef<HTMLInputElement>(null);
    const dColorRef = useRef<HTMLInputElement>(null);

    // --- Validation Logic ---
    const isStoneDirty = useMemo(() => !!(vals.sName || vals.sWgt || vals.sPrice), [vals.sName, vals.sWgt, vals.sPrice]);
    const isBeadsDirty = useMemo(() => !!(vals.bWgt || vals.bPrice), [vals.bWgt, vals.bPrice]);
    const isDiamondDirty = useMemo(() => !!(vals.dName || vals.dWgt || vals.dColor || vals.dCut || vals.dClarity || vals.dRate || vals.dPrice), [vals]);

    // --- Effects & Handlers ---
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (catRef.current && !catRef.current.contains(event.target as Node)) setIsCatOpen(false);
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) setIsModalOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (catSearch.trim() === "") {
            setProdCode("");
        }
    }, [catSearch]);

    const uniqueCategories = useMemo(() => {
        const seen = new Set();
        return CATEGORIES.filter(item => {
            const duplicate = seen.has(item.name);
            seen.add(item.name);
            return !duplicate;
        });
    }, []);

    const handleCategorySelect = (cat: Category) => {
        setCatSearch(cat.name);
        setIsCatOpen(false);
        const existingCodes = CATEGORIES.filter(c => c.stcode.startsWith(`${cat.abbr}-`)).map(c => parseInt(c.stcode.split('-')[1], 10));
        const maxNum = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
        setProdCode(`${cat.abbr}-${(maxNum + 1).toString().padStart(3, '0')}`);
    };

    const checkJump = (value: string, nextRef: React.RefObject<HTMLInputElement | null>) => {
        if (/\.\d{3}$/.test(value)) nextRef.current?.focus();
    };

    const noSpinnerStyle = `
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
    `;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-8 p-4 md:p-8 text-slate-900 antialiased font-sans">
            <style>{noSpinnerStyle}</style>

            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-y-6 gap-x-4">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 truncate">
                            Inventory Entry
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:justify-end">
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                            {selectedMetal === "Gold" && (
                                <div className="flex items-center gap-1 bg-amber-50/80 backdrop-blur-sm p-1.5 rounded-2xl border border-amber-100 shadow-sm shrink-0">
                                    {GOLD_CARATS.map((carat) => (
                                        <button
                                            key={carat}
                                            onClick={() => setSelectedCarat(carat)}
                                            className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 ${selectedCarat === carat
                                                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                                                : 'text-amber-700 hover:bg-amber-100'
                                                }`}
                                        >
                                            {carat}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                                {METALS.map((metal) => (
                                    <label key={metal} className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            className="hidden"
                                            name="metal"
                                            checked={selectedMetal === metal}
                                            onChange={() => setSelectedMetal(metal)}
                                        />
                                        <span className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${selectedMetal === metal
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                            }`}>
                                            {metal}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 group sm:order-last"
                        >
                            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                                <Plus size={18} strokeWidth={3} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">worker/category</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="order-2 lg:order-1 lg:col-span-8 space-y-6 bg-white rounded-3xl border border-slate-200 p-5 md:p-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative" ref={catRef}>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Category Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="text" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl outline-none text-sm font-medium transition-all" placeholder="Search..." value={catSearch} onFocus={() => setIsCatOpen(true)} onChange={(e) => setCatSearch(e.target.value)} />
                                    {isCatOpen && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2">
                                            {uniqueCategories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase())).map(cat => (
                                                <div key={cat.abbr} onMouseDown={() => handleCategorySelect(cat)} className="px-4 py-3 hover:bg-blue-50 rounded-xl cursor-pointer text-sm font-semibold flex justify-between items-center group">
                                                    {cat.name}
                                                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded group-hover:bg-blue-100 text-slate-500 font-bold uppercase">{cat.abbr}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Stock Code</label>
                                    <input type="text" readOnly className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-mono font-bold outline-none transition-all ${prodCode ? 'bg-blue-50/50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`} value={prodCode || "---"} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Description</label>
                                    <input type="text" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl outline-none text-sm font-medium transition-all" placeholder="Details..." value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4 border-t border-slate-50">
                            {[
                                { label: 'Worker', key: 'worker', type: 'text', placeholder: 'Name' },
                                { label: 'Net Wgt', key: 'netWeight', type: 'number', placeholder: '0.000' },
                                { label: 'Wastage/Gram', key: 'WastageGram', type: 'number', placeholder: '0.000', ref: WastageGramRef },
                                { label: 'Wastage %', key: 'wastage', type: 'number', placeholder: '0.000', ref: wastageRef },
                                { label: 'Making', key: 'making', type: 'number', placeholder: '0', ref: makingRef },
                            ].map((field) => (
                                <div key={field.key} className={field.key === 'worker' ? 'col-span-2 sm:col-span-1' : ''}>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">{field.label}</label>
                                    <input
                                        ref={field.ref as any}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm focus:bg-white focus:border-blue-500 transition-all font-medium"
                                        value={vals[field.key as keyof FormValues]}
                                        onChange={(e) => {
                                            setVals({ ...vals, [field.key]: e.target.value });
                                            if (field.label === 'Net Wgt') checkJump(e.target.value, WastageGramRef);
                                            if (field.label === 'Wastage/Gram') checkJump(e.target.value, wastageRef);
                                            if (field.label === 'Wastage %') checkJump(e.target.value, makingRef);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6">
                            <SectionWrapper title="Stone Details" icon={Gem} show={showStone} setShow={setShowStone} isDirty={isStoneDirty}>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <InputBlock label="Stone Name" value={vals.sName} onChange={(v: string) => setVals({ ...vals, sName: v })} placeholder="Ruby, etc." />
                                    <InputBlock
                                        label="Weight (Carat)"
                                        value={vals.sWgt}
                                        onChange={(v: string) => {
                                            setVals({ ...vals, sWgt: v });
                                            checkJump(v, sPriceRef);
                                        }}
                                        placeholder="0.000"
                                        type="number"
                                        inputRef={sWgtRef}
                                    />
                                    <InputBlock
                                        label="Price"
                                        value={vals.sPrice}
                                        onChange={(v: string) => setVals({ ...vals, sPrice: v })}
                                        placeholder="0"
                                        type="number"
                                        inputRef={sPriceRef}
                                    />
                                </div>
                            </SectionWrapper>

                            <SectionWrapper title="Beads Details" icon={Package} show={showBeads} setShow={setShowBeads} isDirty={isBeadsDirty}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputBlock
                                        label="Bead Weight"
                                        value={vals.bWgt}
                                        onChange={(v: string) => {
                                            setVals({ ...vals, bWgt: v });
                                            checkJump(v, bPriceRef);
                                        }}
                                        placeholder="0.000"
                                        type="number"
                                    />
                                    <InputBlock
                                        label="Price"
                                        value={vals.bPrice}
                                        onChange={(v: string) => setVals({ ...vals, bPrice: v })}
                                        placeholder="0"
                                        type="number"
                                        inputRef={bPriceRef}
                                    />
                                </div>
                            </SectionWrapper>

                            <SectionWrapper title="Diamond Details" icon={Hammer} show={showDiamond} setShow={setShowDiamond} isDirty={isDiamondDirty}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="col-span-2">
                                        <InputBlock label="Diamond Name" value={vals.dName} onChange={(v: string) => setVals({ ...vals, dName: v })} placeholder="e.g. Round Brilliant" />
                                    </div>
                                    <InputBlock
                                        label="Weight"
                                        value={vals.dWgt}
                                        onChange={(v: string) => {
                                            setVals({ ...vals, dWgt: v });
                                            checkJump(v, dColorRef);
                                        }}
                                        placeholder="0.000"
                                        type="number"
                                        inputRef={dWgtRef}
                                    />
                                    <InputBlock
                                        label="Color"
                                        value={vals.dColor}
                                        onChange={(v: string) => setVals({ ...vals, dColor: v })}
                                        placeholder="D-F"
                                        inputRef={dColorRef}
                                    />
                                    <InputBlock label="Cut" value={vals.dCut} onChange={(v: string) => setVals({ ...vals, dCut: v })} placeholder="Ex" />
                                    <InputBlock label="Clarity" value={vals.dClarity} onChange={(v: string) => setVals({ ...vals, dClarity: v })} placeholder="VVS1" />
                                    <InputBlock label="Rate" value={vals.dRate} onChange={(v: string) => setVals({ ...vals, dRate: v })} placeholder="0" type="number" />
                                    <InputBlock label="Price" value={vals.dPrice} onChange={(v: string) => setVals({ ...vals, dPrice: v })} placeholder="0" type="number" />
                                </div>
                            </SectionWrapper>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 lg:col-span-4 lg:sticky lg:top-8">
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                            <div className="aspect-square w-full relative rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 overflow-hidden flex flex-col items-center justify-center group hover:border-blue-300 transition-all mb-6">
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                        <button onClick={() => setImagePreview(null)} className="absolute top-3 right-3 p-2 bg-white/90 rounded-xl shadow-md text-red-500 hover:bg-red-50 transition-colors"><X size={18} /></button>
                                    </>
                                ) : (
                                    <button type="button" onClick={() => (document.getElementById('file-upload') as HTMLInputElement).click()} className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-blue-500 transition-colors">
                                        <div className="p-4 bg-white rounded-full shadow-sm"><Camera size={32} strokeWidth={1.5} /></div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Upload Image</span>
                                    </button>
                                )}
                                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setImagePreview(reader.result as string);
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </div>
                            <button className="hidden lg:block w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-100 active:scale-[0.98]">Update Inventory</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-50">
                <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform">Update Inventory</button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" />
                    <div ref={modalRef} className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors z-10"><X size={20} /></button>
                        <CatWorker />
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Helper Components ---

interface InputBlockProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    type?: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}

function InputBlock({ label, value, onChange, placeholder, type = "text", inputRef }: InputBlockProps) {
    return (
        <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1 tracking-widest">{label}</label>
            <input
                ref={inputRef as any}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-medium focus:bg-white focus:border-blue-500 transition-all appearance-none"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

interface SectionWrapperProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    show: boolean;
    setShow: (show: boolean) => void;
    isDirty: boolean;
}

function SectionWrapper({ title, icon: Icon, children, show, setShow, isDirty }: SectionWrapperProps) {
    const handleToggle = () => { if (!isDirty) setShow(!show); };
    const activeShow = isDirty || show;
    return (
        <div className={`rounded-2xl border transition-all duration-300 ${activeShow ? 'border-blue-100 bg-blue-50/10' : 'border-slate-100 bg-white'}`}>
            <button type="button" onClick={handleToggle} className={`w-full flex items-center justify-between p-4 text-left ${isDirty ? 'cursor-default' : 'cursor-pointer'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeShow ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-400'}`}><Icon size={16} /></div>
                    <div className="flex flex-col">
                        <span className={`text-sm font-bold ${activeShow ? 'text-blue-900' : 'text-slate-600'}`}>{title}</span>
                        {isDirty && <span className="text-[9px] text-blue-500 font-bold uppercase tracking-tighter">Locked</span>}
                    </div>
                </div>
                {isDirty ? <Lock size={16} className="text-blue-500" /> : (activeShow ? <ChevronUp size={18} className="text-blue-400" /> : <ChevronDown size={18} className="text-slate-300" />)}
            </button>
            {activeShow && <div className="p-4 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">{children}</div>}
        </div>
    );
}