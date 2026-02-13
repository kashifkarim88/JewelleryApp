"use client"
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Package, Ruler, Hammer, Gem, Camera, X } from 'lucide-react';

const DUMMY_ITEMS = [
    { id: 1, name: "Diamond Engagement Ring", code: "HJ-1001" },
    { id: 2, name: "Gold Bridal Set", code: "HJ-5502" },
    { id: 3, name: "Silver Bracelet", code: "HJ-3021" },
];

const UNITS = ["Grams (g)", "Carat (ct)", "Pieces (pcs)", "Tola"];

export default function StockPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState<{ name: string, code: string } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [vals, setVals] = useState({
        netWeight: "", wastage: "", worker: "",
        sWgt: "", sRate: "",
        bWgt: "", bRate: "",
        dWgt: "", dRate: ""
    });

    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const refWastage = useRef<HTMLInputElement>(null);
    const refStoneWgt = useRef<HTMLInputElement>(null);
    const refStoneRate = useRef<HTMLInputElement>(null);
    const refBeadsWgt = useRef<HTMLInputElement>(null);
    const refBeadsRate = useRef<HTMLInputElement>(null);
    const refDiamondWgt = useRef<HTMLInputElement>(null);
    const refDiamondRate = useRef<HTMLInputElement>(null);

    // Bug Fix: Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredItems = useMemo(() => {
        return DUMMY_ITEMS.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Logic for 2-decimal jump
    const handleDecimalInput = (key: string, value: string, nextRef?: React.RefObject<HTMLInputElement>) => {
        setVals(prev => ({ ...prev, [key]: value }));
        const decimalMatch = value.match(/\.\d{2}$/);
        if (decimalMatch && nextRef?.current) {
            nextRef.current.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, nextRef?: React.RefObject<HTMLInputElement>) => {
        if (e.key === 'Enter' && nextRef?.current) {
            e.preventDefault();
            nextRef.current.focus();
        }
    };

    const stoneTotal = (Number(vals.sWgt) * Number(vals.sRate)).toFixed(2);
    const beadsTotal = (Number(vals.bWgt) * Number(vals.bRate)).toFixed(2);
    const diamondTotal = (Number(vals.dWgt) * Number(vals.dRate)).toFixed(2);

    return (
        <div className="h-full flex flex-col max-w-7xl mx-auto overflow-hidden">
            <div className="mb-4">
                <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>Inventory Entry</h1>
                <p className='text-gray-500 text-xs font-medium'>Weight and Wastage auto-jump after 2 decimal places.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-y-auto lg:overflow-hidden flex flex-col">
                <div className="p-4 md:p-6 space-y-5">

                    {/* TOP SECTION: Search & Primary Details (Aligned) */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
                        <div className="relative lg:col-span-1" ref={dropdownRef}>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Item Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-800 outline-none text-sm h-[42px]"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                />
                                {isDropdownOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-2xl max-h-40 overflow-y-auto">
                                        {filteredItems.map(item => (
                                            <button key={item.id} onClick={() => { setSelectedItem(item); setSearchTerm(item.name); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b last:border-0">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-[10px] text-gray-400 font-mono">{item.code}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:col-span-3 items-end">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Unit</label>
                                <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm outline-none bg-white h-[42px]">
                                    <option value="">Select Unit</option>
                                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Making (Worker)</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm outline-none h-[42px]"
                                    value={vals.worker}
                                    onChange={(e) => setVals({ ...vals, worker: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2 lg:col-span-1 p-2 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center h-[42px]">
                                <span className="text-[11px] font-mono font-bold text-gray-600 tracking-tighter uppercase">Code: {selectedItem?.code || '---'}</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* MIDDLE SECTION: Detail Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                        {/* 1. Image Upload Section */}
                        <div className="p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[145px] relative">
                            {imagePreview ? (
                                <div className="h-full w-full relative">
                                    <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
                                    <button onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md">
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors py-4">
                                    <Camera size={28} className="mb-2" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Capture Item</span>
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

                        {/* 2. Weight Info */}
                        <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><Ruler size={12} /> Weight</h3>
                            <input
                                className='w-full p-2.5 text-xs rounded-lg border border-gray-200 focus:border-gray-900 outline-none'
                                type="number" step="0.01" placeholder='Net Wgt (1.99)'
                                value={vals.netWeight}
                                onChange={(e) => handleDecimalInput('netWeight', e.target.value, refWastage)}
                                onKeyDown={(e) => handleKeyDown(e, refWastage)}
                            />
                            <input
                                ref={refWastage}
                                className='w-full p-2.5 text-xs rounded-lg border border-gray-200 focus:border-gray-900 outline-none'
                                type="number" step="0.01" placeholder='Wastage %'
                                value={vals.wastage}
                                onChange={(e) => handleDecimalInput('wastage', e.target.value, refStoneWgt)}
                                onKeyDown={(e) => handleKeyDown(e, refStoneWgt)}
                            />
                        </div>

                        {/* 3. Stone Section */}
                        <div className="p-3 bg-blue-50/30 rounded-xl space-y-2 border border-blue-100">
                            <h3 className="text-[10px] font-black text-blue-400 uppercase flex items-center gap-1"><Gem size={12} /> Stone</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    ref={refStoneWgt}
                                    className='p-2.5 text-xs rounded-lg border border-gray-200 outline-none'
                                    type="number" step="0.01" placeholder='Wgt'
                                    value={vals.sWgt}
                                    onChange={(e) => handleDecimalInput('sWgt', e.target.value, refStoneRate)}
                                    onKeyDown={(e) => handleKeyDown(e, refStoneRate)}
                                />
                                <input
                                    ref={refStoneRate}
                                    className='p-2.5 text-xs rounded-lg border border-gray-200 outline-none'
                                    type="number" placeholder='Rate'
                                    value={vals.sRate}
                                    onChange={(e) => setVals({ ...vals, sRate: e.target.value })}
                                    onKeyDown={(e) => handleKeyDown(e, refBeadsWgt)}
                                />
                                <div className='col-span-2 p-2 text-[10px] rounded-lg border border-blue-100 font-bold bg-white text-blue-600 flex justify-between uppercase'>
                                    <span>Total:</span> <span>{stoneTotal}</span>
                                </div>
                            </div>
                        </div>

                        {/* 4. Beads Section */}
                        <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><Package size={12} /> Beads</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    ref={refBeadsWgt}
                                    className='p-2.5 text-xs rounded-lg border border-gray-200 outline-none'
                                    type="number" step="0.01" placeholder='Wgt'
                                    value={vals.bWgt}
                                    onChange={(e) => handleDecimalInput('bWgt', e.target.value, refBeadsRate)}
                                    onKeyDown={(e) => handleKeyDown(e, refBeadsRate)}
                                />
                                <input
                                    ref={refBeadsRate}
                                    className='p-2.5 text-xs rounded-lg border border-gray-200 outline-none'
                                    type="number" placeholder='Rate'
                                    value={vals.bRate}
                                    onChange={(e) => setVals({ ...vals, bRate: e.target.value })}
                                    onKeyDown={(e) => handleKeyDown(e, refDiamondWgt)}
                                />
                                <div className='col-span-2 p-2 text-[10px] rounded-lg border border-gray-200 font-bold bg-white text-gray-500 flex justify-between uppercase'>
                                    <span>Total:</span> <span>{beadsTotal}</span>
                                </div>
                            </div>
                        </div>

                        {/* 5. Diamond Section */}
                        <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><Hammer size={12} /> Diamond</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    ref={refDiamondWgt}
                                    className='p-2.5 text-xs rounded-lg border border-gray-200 outline-none'
                                    type="number" step="0.01" placeholder='Wgt'
                                    value={vals.dWgt}
                                    onChange={(e) => handleDecimalInput('dWgt', e.target.value, refDiamondRate)}
                                    onKeyDown={(e) => handleKeyDown(e, refDiamondRate)}
                                />
                                <input
                                    ref={refDiamondRate}
                                    className='p-2.5 text-xs rounded-lg border border-gray-200 outline-none'
                                    type="number" placeholder='Rate'
                                    value={vals.dRate}
                                    onChange={(e) => setVals({ ...vals, dRate: e.target.value })}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                />
                                <div className='col-span-2 p-2 text-[10px] rounded-lg border border-gray-200 font-bold bg-white text-gray-500 flex justify-between uppercase'>
                                    <span>Total:</span> <span>{diamondTotal}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end border-t border-gray-50 pt-4">
                        <button
                            disabled={!selectedItem || !selectedUnit}
                            className="w-full lg:w-64 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg"
                        >
                            <Package size={18} /> Update Stock Level
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}