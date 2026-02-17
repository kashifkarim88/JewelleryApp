"use client"
import React, { useState } from 'react';
import Barcode from 'react-barcode';
import { PlusCircle, Tag, Package, Barcode as BarcodeIcon } from 'lucide-react';

export default function IndexPage() {
    const [itemCategory, setItemCategory] = useState("");
    const [itemCode, setItemCode] = useState("");
    const [itemName, setItemName] = useState("");

    // Shared Preview Component to keep code clean
    const BarcodePreview = ({ className = "" }) => (
        <div className={`animate-in fade-in zoom-in duration-300 ${className}`}>
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Tag Preview</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center min-w-[180px]">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {itemCategory || 'Category'}
                    </span>
                    <span className="text-[11px] font-bold text-gray-800 mb-3 text-center truncate max-w-[150px]">
                        {itemName || 'Item Name'}
                    </span>
                    <Barcode
                        value={itemCode}
                        width={1.1}
                        height={40}
                        fontSize={12}
                        margin={0}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 md:py-16 antialiased">

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Inventory</h1>
                <p className="text-gray-500 text-sm">Register new stock and generate labels.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                {/* FORM SECTION */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

                        {/* 1. Item Category */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 flex items-center gap-2 tracking-wider">
                                <Package size={12} /> Item Category
                            </label>
                            <input
                                type="text"
                                value={itemCategory}
                                onChange={(e) => setItemCategory(e.target.value)}
                                placeholder="e.g. Necklace"
                                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all text-sm"
                            />
                        </div>

                        {/* 2. Item Name */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 flex items-center gap-2 tracking-wider">
                                <Package size={12} /> Item Name
                            </label>
                            <input
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                placeholder="e.g. 22K Gold Diamond Band"
                                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all text-sm"
                            />
                        </div>

                        {/* 3. Item Code */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 flex items-center gap-2 tracking-wider">
                                <Tag size={12} /> Item Code
                            </label>
                            <input
                                type="text"
                                value={itemCode}
                                onChange={(e) => setItemCode(e.target.value.toUpperCase())}
                                placeholder="HJ-9921"
                                className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all font-mono text-sm"
                            />
                        </div>

                        {/* MOBILE PREVIEW: Visible only on mobile/tablet (below lg) when itemCode exists */}
                        {itemCode && (
                            <div className="lg:hidden mt-4">
                                <BarcodePreview />
                            </div>
                        )}

                        <button className="w-full mt-2 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-sm active:scale-[0.98]">
                            <PlusCircle size={18} /> Add to Stock
                        </button>
                    </div>
                </div>

                {/* DESKTOP PREVIEW: Visible only on large screens (lg) at the right-center */}
                <div className="hidden lg:block lg:col-span-5">
                    {itemCode ? (
                        <BarcodePreview />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-2xl p-12">
                            <BarcodeIcon size={40} className="mb-2 opacity-20" />
                            <p className="text-[10px] uppercase font-bold tracking-widest">Waiting for Code</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}