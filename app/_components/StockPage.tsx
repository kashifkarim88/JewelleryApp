"use client"
import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Search, Package, Hammer, Gem, Camera, X, ChevronDown, ChevronUp, Check, Hash, QrCode } from 'lucide-react';

// --- Types & Dummy Data ---
interface Product {
    id: number;
    name: string;
    code: string;
    category: string;
}

const CATEGORIES = ["Ring", "Necklace", "Bracelet", "Earrings", "Bangle"];

const PRODUCTS: Product[] = [
    { id: 1, name: "Baby Ring", code: "R-001", category: "Ring" },
    { id: 2, name: "Engagement Ring", code: "R-002", category: "Ring" },
    { id: 3, name: "Ladies Ring", code: "R-003", category: "Ring" },
    { id: 4, name: "Bridal Necklace", code: "N-501", category: "Necklace" },
    { id: 5, name: "Silver Bracelet", code: "B-201", category: "Bracelet" },
];

const UNITS = ["Grams (g)", "Carat (ct)", "Pieces (pcs)", "Tola"];

export default function StockPage() {
    const [catSearch, setCatSearch] = useState("");
    const [prodSearch, setProdSearch] = useState("");
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

    const filteredCats = CATEGORIES.filter(c => c.toLowerCase().includes(catSearch.toLowerCase()));
    const filteredProds = PRODUCTS.filter(p =>
        p.category === selectedCat &&
        p.name.toLowerCase().includes(prodSearch.toLowerCase())
    );

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!catRef.current?.contains(e.target as Node)) setIsCatOpen(false);
            if (!prodRef.current?.contains(e.target as Node)) setIsProdOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const calculateTotal = (wgt: string, rate: string) => (Number(wgt) * Number(rate)).toFixed(2);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 antialiased font-sans">
            <div className="max-w-6xl mx-auto relative">

                {/* Header & Floating Item Code */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight text-slate-900'>Inventory Entry</h1>
                        <p className='text-slate-500 text-sm'>Manage stock categories and product metrics.</p>
                    </div>

                    {/* TOP RIGHT ITEM CODE DISPLAY */}
                    <div className="flex flex-col items-end">
                        {selectedProd ? (
                            <div className="bg-white border-2 border-blue-500 rounded-2xl p-3 flex items-center gap-4 shadow-lg shadow-blue-100 animate-in zoom-in duration-300">
                                <div className="text-right">
                                    <p className="text-xl font-mono font-black text-blue-900 leading-none">{selectedProd.code}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2 border-dashed">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waiting for Selection</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Category Search */}
                            <div className="relative" ref={catRef}>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Product Category</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl outline-none text-sm font-medium transition-all"
                                        placeholder="Search category..."
                                        value={catSearch}
                                        onChange={(e) => {
                                            setCatSearch(e.target.value);
                                            setIsCatOpen(true);
                                            // Reset product if category is cleared
                                            if (e.target.value === "") {
                                                setSelectedCat(null);
                                                setSelectedProd(null);
                                                setProdSearch("");
                                            }
                                        }}
                                        onFocus={() => setIsCatOpen(true)}
                                    />
                                    {isCatOpen && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-48 overflow-y-auto p-2">
                                            {filteredCats.map(cat => (
                                                <div key={cat} onClick={() => { setSelectedCat(cat); setCatSearch(cat); setIsCatOpen(false); setSelectedProd(null); setProdSearch(""); }}
                                                    className="px-4 py-2.5 hover:bg-blue-50 rounded-xl cursor-pointer text-sm font-medium flex justify-between items-center transition-colors">
                                                    {cat} {selectedCat === cat && <Check size={14} className="text-blue-500" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Search - FIX APPLIED HERE */}
                            <div className="relative" ref={prodRef}>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Product Name</label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        disabled={!selectedCat}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl outline-none text-sm font-medium disabled:opacity-50"
                                        placeholder={selectedCat ? `Find ${selectedCat}...` : "← Select category"}
                                        value={prodSearch}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setProdSearch(val);
                                            setIsProdOpen(true);
                                            // FIX: If user clears the text, clear the selected product/code
                                            if (val === "") {
                                                setSelectedProd(null);
                                            }
                                        }}
                                        onFocus={() => setIsProdOpen(true)}
                                    />
                                    {isProdOpen && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-48 overflow-y-auto p-2">
                                            {filteredProds.map(prod => (
                                                <div key={prod.id} onClick={() => { setSelectedProd(prod); setProdSearch(prod.name); setIsProdOpen(false); }}
                                                    className="px-4 py-2.5 hover:bg-blue-50 rounded-xl cursor-pointer flex justify-between items-center">
                                                    <span className="text-sm font-medium">{prod.name}</span>
                                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{prod.code}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* REST OF THE CODE REMAINS THE SAME */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Worker</label>
                                <input type="text" placeholder="Worker Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm transition-all focus:bg-white focus:border-blue-500" value={vals.worker} onChange={(e) => setVals({ ...vals, worker: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Unit</label>
                                <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm cursor-pointer focus:bg-white focus:border-blue-500">
                                    <option value="">Select Unit</option>
                                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Net Wgt</label>
                                    <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-mono focus:bg-white focus:border-blue-500" value={vals.netWeight} onChange={(e) => setVals({ ...vals, netWeight: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Wastage %</label>
                                    <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-mono focus:bg-white focus:border-blue-500" value={vals.wastage} onChange={(e) => setVals({ ...vals, wastage: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-50">
                            {[
                                { label: 'Stone', icon: Gem, show: showStone, setShow: setShowStone, wgt: vals.sWgt, rate: vals.sRate, keyW: 'sWgt', keyR: 'sRate' },
                                { label: 'Beads', icon: Package, show: showBeads, setShow: setShowBeads, wgt: vals.bWgt, rate: vals.bRate, keyW: 'bWgt', keyR: 'bRate' },
                                { label: 'Diamond', icon: Hammer, show: showDiamond, setShow: setShowDiamond, wgt: vals.dWgt, rate: vals.dRate, keyW: 'dWgt', keyR: 'dRate' }
                            ].map((sec, i) => (
                                <div key={i} className={`rounded-2xl border transition-all ${sec.show ? 'border-blue-200 bg-blue-50/20' : 'border-slate-100 bg-white'}`}>
                                    <button type="button" onClick={() => sec.setShow(!sec.show)} className="w-full flex items-center justify-between p-4 text-left">
                                        <div className="flex items-center gap-3">
                                            <sec.icon size={16} className={sec.show ? 'text-blue-500' : 'text-slate-400'} />
                                            <span className={`text-sm font-bold ${sec.show ? 'text-blue-900' : 'text-slate-600'}`}>{sec.label} Details</span>
                                        </div>
                                        {sec.show ? <ChevronUp size={16} className="text-blue-400" /> : <ChevronDown size={16} className="text-slate-300" />}
                                    </button>
                                    {sec.show && (
                                        <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in duration-200">
                                            <div className="grid grid-cols-2 gap-2">
                                                <input className="p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none" type="number" placeholder="Weight" value={sec.wgt} onChange={(e) => setVals({ ...vals, [sec.keyW]: e.target.value })} />
                                                <input className="p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none" type="number" placeholder="Rate" value={sec.rate} onChange={(e) => setVals({ ...vals, [sec.keyR]: e.target.value })} />
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

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-8">
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
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setImagePreview(reader.result as string);
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </div>

                            <button
                                disabled={!selectedProd || !selectedUnit}
                                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:bg-slate-50 disabled:text-slate-300 flex items-center justify-center gap-2 shadow-xl shadow-slate-100"
                            >
                                <Package size={18} /> Update Inventory
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}