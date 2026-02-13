"use client"
import React, { useState } from 'react';
import Barcode from 'react-barcode';
import { PlusCircle, Tag, Package, Barcode as BarcodeIcon } from 'lucide-react';

export default function IndexPage() {
    const [itemCode, setItemCode] = useState("");
    const [itemName, setItemName] = useState("");

    return (
        // Added responsive padding and max-width
        <div className="max-w-5xl mx-auto pb-10">

            {/* Page Header - Responsive text alignment */}
            <div className="mb-6 md:mb-10 text-center md:text-left">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Add New Inventory
                </h1>
                <p className="text-gray-500 mt-2 text-sm md:text-base">
                    Register and generate barcodes for new jewellery stock.
                </p>
            </div>

            {/* Main Responsive Grid: 1 column on mobile, 3 columns on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                {/* FORM SECTION (Takes 2/3 of space on Desktop) */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-8">
                        <div className="space-y-5 md:space-y-6">
                            {/* Item Name */}
                            <div>
                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Package size={16} className="text-gray-400" /> ITEM NAME
                                </label>
                                <input
                                    type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    placeholder="e.g. 22K Gold Necklace"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all text-sm md:text-base"
                                />
                            </div>

                            {/* Item Code */}
                            <div>
                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Tag size={16} className="text-gray-400" /> ITEM CODE
                                </label>
                                <input
                                    type="text"
                                    value={itemCode}
                                    onChange={(e) => setItemCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. HJ-9921"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all font-mono text-sm md:text-base"
                                />
                            </div>

                            {/* Action Button */}
                            <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3.5 md:py-4 rounded-xl transition-all shadow-md active:scale-95 text-sm md:text-base">
                                <PlusCircle size={20} /> Add Item to Stock
                            </button>
                        </div>
                    </div>
                </div>

                {/* PREVIEW SECTION (Fixed at top on mobile for instant feedback) */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                    <div className="sticky top-4">
                        <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 text-center lg:text-left">
                            Live Label Preview
                        </h3>
                        <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[180px] md:min-h-[280px] text-center transition-all bg-white">
                            {itemCode ? (
                                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                    <span className="text-[10px] font-black text-gray-400 mb-1 tracking-widest uppercase">
                                        {itemName || 'Draft Item'}
                                    </span>
                                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                        <Barcode
                                            value={itemCode}
                                            width={1.2}
                                            height={50}
                                            fontSize={12}
                                            margin={10}
                                        />
                                    </div>
                                    <p className="mt-4 text-[10px] text-gray-400 uppercase font-medium tracking-tighter">Scan to Verify</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-gray-300">
                                    <div className="p-4 bg-gray-100 rounded-full mb-3">
                                        <BarcodeIcon size={32} />
                                    </div>
                                    <p className="text-xs font-medium">Waiting for item code...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}