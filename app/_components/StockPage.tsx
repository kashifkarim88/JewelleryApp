"use client"
import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Search, Package, Hammer, Gem, Camera, X, ChevronDown, ChevronUp, Check, QrCode, AlertCircle } from 'lucide-react';

// --- Types ---
interface Product {
    id: number;
    name: string;
    code: string;
    category: string;
}

const CATEGORIES = ["Ring", "Necklace", "Bracelet", "Earrings", "Bangle"];

// Existing database products for validation
const PRODUCTS: Product[] = [
    { id: 1, name: "Baby Ring", code: "BR-001", category: "Ring" },
    { id: 2, name: "Engagement Ring", code: "ER-002", category: "Ring" },
    { id: 4, name: "Bridal Necklace", code: "BN-501", category: "Necklace" },
];

const UNITS = ["Grams (g)", "Carat (ct)", "Pieces (pcs)", "Tola"];

export default function StockPage() {
    const [catSearch, setCatSearch] = useState("");
    const [prodSearch, setProdSearch] = useState("");
    const [prodCode, setProdCode] = useState("");
    const [selectedCat, setSelectedCat] = useState<string | null>(null);
    const [selectedProd, setSelectedProd] = useState<Product | null>(null);
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isProdOpen, setIsProdOpen] = useState(false);
    const [showStone, setShowStone] = useState(false);
    const [showBeads, setShowBeads] = useState(false);
    const [showDiamond, setShowDiamond] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [vals, setVals] = useState({
        netWeight: "", wastage: "", worker: "",
        sWgt: "", sRate: "", bWgt: "", bRate: "", dWgt: "", dRate: ""
    });

    const catRef = useRef<HTMLDivElement>(null);
    const prodRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const netWgtRef = useRef<HTMLInputElement>(null);
    const wastageRef = useRef<HTMLInputElement>(null);
    const workerRef = useRef<HTMLInputElement>(null);
    const sWgtRef = useRef<HTMLInputElement>(null);
    const sRateRef = useRef<HTMLInputElement>(null);
    const bWgtRef = useRef<HTMLInputElement>(null);
    const bRateRef = useRef<HTMLInputElement>(null);
    const dWgtRef = useRef<HTMLInputElement>(null);
    const dRateRef = useRef<HTMLInputElement>(null);

    const checkJump = (value: string, nextRef: React.RefObject<HTMLInputElement | null>) => {
        if (/\.\d{2}$/.test(value)) {
            nextRef.current?.focus();
        }
    };

    // --- LOGIC: Handle Prefix Generation ---
    const generatePrefix = (name: string) => {
        return name
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word[0])
            .join('')
            .toUpperCase() + "-";
    };

    // --- LOGIC: Duplicate Code Detection ---
    const isCodeTaken = PRODUCTS.some(p => p.code.trim().toUpperCase() === prodCode.trim().toUpperCase());

    useEffect(() => {
        const handleEvents = (e: MouseEvent | KeyboardEvent) => {
            if (e instanceof MouseEvent) {
                if (!catRef.current?.contains(e.target as Node)) setIsCatOpen(false);
                if (!prodRef.current?.contains(e.target as Node)) setIsProdOpen(false);
            }
            if (e instanceof KeyboardEvent && e.key === 'Escape') {
                setIsCatOpen(false);
                setIsProdOpen(false);
            }
        };
        document.addEventListener("mousedown", handleEvents);
        return () => document.removeEventListener("mousedown", handleEvents);
    }, []);

    const calculateTotal = (wgt: string, rate: string) => (Number(wgt) * Number(rate)).toFixed(2);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 antialiased font-sans">
            <div className="max-w-6xl mx-auto relative">

                <header className="mb-8">
                    <h1 className='text-2xl font-bold tracking-tight'>Inventory Entry</h1>
                    <p className='text-slate-500 text-sm'>Add new unique pieces to your collection.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Category Selection */}
                            <div className="relative" ref={catRef}>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Category</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl outline-none text-sm font-medium transition-all"
                                        placeholder="Category..."
                                        value={catSearch}
                                        onFocus={() => setIsCatOpen(true)}
                                        onChange={(e) => {
                                            setCatSearch(e.target.value);
                                            setIsCatOpen(true);
                                            if (!e.target.value) { setSelectedCat(null); setProdSearch(""); }
                                        }}
                                    />
                                    {isCatOpen && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-48 overflow-y-auto p-2">
                                            {CATEGORIES.filter(c => c.toLowerCase().includes(catSearch.toLowerCase())).map(cat => (
                                                <div key={cat} onMouseDown={() => { setSelectedCat(cat); setCatSearch(cat); setIsCatOpen(false); }}
                                                    className="px-4 py-2.5 hover:bg-blue-50 rounded-xl cursor-pointer text-sm font-medium flex justify-between items-center transition-colors">
                                                    {cat} {selectedCat === cat && <Check size={14} className="text-blue-500" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Name Selection */}
                            <div className="relative" ref={prodRef}>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Product Name</label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        disabled={!selectedCat}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl outline-none text-sm font-medium disabled:opacity-50 transition-all"
                                        placeholder="Product Name"
                                        value={prodSearch}
                                        onFocus={() => setIsProdOpen(true)}
                                        onChange={(e) => {
                                            setProdSearch(e.target.value);
                                            setIsProdOpen(true);
                                            // Auto-update code prefix based on what user is typing
                                            setProdCode(generatePrefix(e.target.value));
                                        }}
                                    />
                                    {isProdOpen && selectedCat && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-48 overflow-y-auto p-2">
                                            {PRODUCTS
                                                .filter(p => p.category === selectedCat)
                                                .filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase()))
                                                .map(prod => (
                                                    <div key={prod.id} onMouseDown={() => {
                                                        setProdSearch(prod.name);
                                                        setProdCode(generatePrefix(prod.name)); // Set Prefix Only
                                                        setIsProdOpen(false);
                                                    }}
                                                        className="px-4 py-2.5 hover:bg-blue-50 rounded-xl cursor-pointer text-sm font-medium transition-colors">
                                                        {prod.name}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Code with Real-time Validation */}
                            <div className="relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Unique Product Code</label>
                                <div className="relative">
                                    <QrCode className={`absolute left-3 top-1/2 -translate-y-1/2 ${isCodeTaken ? 'text-red-500' : 'text-slate-400'}`} size={16} />
                                    <input
                                        type="text"
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl outline-none text-sm font-mono transition-all ${isCodeTaken
                                            ? 'border-red-500 bg-red-50 ring-2 ring-red-100'
                                            : 'border-slate-100 focus:border-blue-500 focus:bg-white'
                                            }`}
                                        placeholder="e.code BR-001"
                                        value={prodCode}
                                        onChange={(e) => setProdCode(e.target.value.toUpperCase())}
                                    />
                                </div>
                                {isCodeTaken && (
                                    <div className="absolute -bottom-5 left-1 flex items-center gap-1 text-red-600 text-[10px] font-bold uppercase animate-pulse">
                                        <AlertCircle size={12} /> Code Already Exists
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Numeric Fields */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Worker</label>
                                <input ref={workerRef} type="text" placeholder="Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:bg-white focus:border-blue-500" value={vals.worker} onChange={(e) => setVals({ ...vals, worker: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Unit</label>
                                <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm cursor-pointer focus:bg-white focus:border-blue-500">
                                    <option value="">Select</option>
                                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Net Wgt</label>
                                    <input ref={netWgtRef} type="text" placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-mono focus:bg-white focus:border-blue-500" value={vals.netWeight} onChange={(e) => { setVals({ ...vals, netWeight: e.target.value }); checkJump(e.target.value, wastageRef); }} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Wastage %</label>
                                    <input ref={wastageRef} type="text" placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-mono focus:bg-white focus:border-blue-500" value={vals.wastage} onChange={(e) => { setVals({ ...vals, wastage: e.target.value }); checkJump(e.target.value, workerRef); }} />
                                </div>
                            </div>
                        </div>

                        {/* Collapsible Details */}
                        <div className="space-y-3 pt-6 border-t border-slate-50">
                            {[
                                { label: 'Stone', icon: Gem, show: showStone, setShow: setShowStone, wgt: vals.sWgt, rate: vals.sRate, keyW: 'sWgt' as const, keyR: 'sRate' as const, wRef: sWgtRef, rRef: sRateRef },
                                { label: 'Beads', icon: Package, show: showBeads, setShow: setShowBeads, wgt: vals.bWgt, rate: vals.bRate, keyW: 'bWgt' as const, keyR: 'bRate' as const, wRef: bWgtRef, rRef: bRateRef },
                                { label: 'Diamond', icon: Hammer, show: showDiamond, setShow: setShowDiamond, wgt: vals.dWgt, rate: vals.dRate, keyW: 'dWgt' as const, keyR: 'dRate' as const, wRef: dWgtRef, rRef: dRateRef }
                            ].map((sec, i) => (
                                <div key={i} className={`rounded-2xl border transition-all ${sec.show ? 'border-blue-200 bg-blue-50/20 shadow-sm' : 'border-slate-100 bg-white'}`}>
                                    <button type="button" onClick={() => sec.setShow(!sec.show)} className="w-full flex items-center justify-between p-4 text-left focus:outline-none">
                                        <div className="flex items-center gap-3">
                                            <sec.icon size={16} className={sec.show ? 'text-blue-500' : 'text-slate-400'} />
                                            <span className={`text-sm font-bold ${sec.show ? 'text-blue-900' : 'text-slate-600'}`}>{sec.label} Details</span>
                                        </div>
                                        {sec.show ? <ChevronUp size={16} className="text-blue-400" /> : <ChevronDown size={16} className="text-slate-300" />}
                                    </button>
                                    {sec.show && (
                                        <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in duration-200">
                                            <div className="grid grid-cols-2 gap-2">
                                                <input ref={sec.wRef} className="p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" type="text" placeholder="Weight" value={sec.wgt} onChange={(e) => { setVals({ ...vals, [sec.keyW]: e.target.value }); checkJump(e.target.value, sec.rRef); }} />
                                                <input ref={sec.rRef} className="p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" type="text" placeholder="Rate" value={sec.rate} onChange={(e) => setVals({ ...vals, [sec.keyR]: e.target.value })} />
                                            </div>
                                            <div className="flex items-center justify-between px-4 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500">
                                                <span>TOTAL</span>
                                                <span className="text-blue-600 font-mono text-sm">${calculateTotal(sec.wgt, sec.rate)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 sticky top-8">
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                            <div className="aspect-square w-full relative rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 overflow-hidden flex flex-col items-center justify-center group hover:border-blue-300 transition-all mb-6">
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                        <button onClick={() => setImagePreview(null)} className="absolute top-3 right-3 p-2 bg-white/90 rounded-xl shadow-md text-red-500"><X size={16} /></button>
                                    </>
                                ) : (
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-3 text-slate-300 group-hover:text-blue-400">
                                        <Camera size={40} strokeWidth={1.5} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Take Photo</span>
                                    </button>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setImagePreview(reader.result as string);
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </div>

                            <button
                                disabled={!prodCode || !selectedUnit || isCodeTaken}
                                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:bg-slate-50 disabled:text-slate-300 flex items-center justify-center gap-2 shadow-xl shadow-slate-200 disabled:shadow-none"
                            >
                                <Check size={18} /> Update Inventory
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}