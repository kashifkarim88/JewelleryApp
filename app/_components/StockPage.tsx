"use client";
import React from 'react';
import { Gem, X, Hammer, CircleDashed, Trash2, Plus } from 'lucide-react';
import CategoryForm from './CategoryForm';
import WorkerForm from './WorkerForm';
import { useStockLogic } from '../hooks/useStockForm';

// Import sub-components
import { MetalSelector } from './stockComponents/MetalSelector';
import { ProductCoreForm } from './stockComponents/ProductCoreForm';
import { WeightMetrics } from './stockComponents/WeightMetrics';
import { ImageUploadSidebar } from './stockComponents/ImageUploadSidebar';
import SectionWrapper from './stockComponents/SectionWrapper';
import InputBlock from './stockComponents/InputBlock';

export default function StockPage() {
    const {
        mounted, nextItemCode, selectedMetal, setSelectedMetal, selectedCarat, setSelectedCarat,
        catSearch, setCatSearch, isCatOpen, setIsCatOpen, workerSearch, setWorkerSearch,
        isWorkerOpen, setIsWorkerOpen, activeModal, setActiveModal, prodDescription, setProdDescription,
        prodCode, setProdCode, imagePreview, setImagePreview, isSubmitting, vals, setVals,
        showStone, setShowStone, showBeads, setShowBeads, showDiamond, setShowDiamond,
        isStoneDirty, isBeadsDirty, isDiamondDirty, filteredCategories, filteredWorkers,
        refs, handleSave, fetchCategories, fetchWorkers, isLoadingCats, isLoadingWorkers, errors, diamondList,
        handleAddDiamond,
        handleRemoveDiamond, stoneList,
        handleAddStone,
        handleRemoveStone,
    } = useStockLogic();

    const metalConfig: any = {
        Gold: { bg: "bg-amber-400 text-amber-950 border-amber-500 shadow-sm", caratActive: "bg-amber-600 text-white shadow-md", caratInactive: "text-amber-800 hover:bg-amber-100", caratContainer: "bg-amber-50/80 border-amber-100", button: "bg-amber-500 hover:bg-amber-600 shadow-amber-100" },
        Palladium: { bg: "bg-cyan-100 text-cyan-900 border-cyan-300", button: "bg-cyan-600 hover:bg-cyan-700" },
        Platinum: { bg: "bg-indigo-100 text-indigo-950 border-indigo-200", button: "bg-indigo-600 hover:bg-indigo-700" },
        Silver: { bg: "bg-slate-200 text-slate-800 border-slate-300", button: "bg-slate-700 hover:bg-slate-800" }
    };

    const checkJump = (val: string, nextRef: any) => {
        // Regex checks for a decimal point followed by exactly 3 digits
        if (/\.\d{3}$/.test(val)) {
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };
    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F1F5F9] pb-24 md:pb-8 p-4 md:p-8 text-slate-900 antialiased font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-slate-800">Product Entry</h1>
                    <MetalSelector
                        selectedMetal={selectedMetal} setSelectedMetal={setSelectedMetal}
                        selectedCarat={selectedCarat} setSelectedCarat={setSelectedCarat}
                        vals={vals} setVals={setVals} metalConfig={metalConfig}
                    />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="order-2 lg:order-1 lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <ProductCoreForm
                                {...{
                                    refs, errors, catSearch, setCatSearch, isCatOpen, setIsCatOpen,
                                    isLoadingCats, filteredCategories, setProdCode, prodCode, nextItemCode,
                                    prodDescription, setProdDescription, workerSearch, setWorkerSearch,
                                    setIsWorkerOpen, isWorkerOpen, isLoadingWorkers, filteredWorkers,
                                    vals, setVals, setActiveModal
                                }}
                            />

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <WeightMetrics {...{ vals, setVals, refs, errors, checkJump }} />
                            </div>

                            <div className="space-y-4 mt-8">
                                <SectionWrapper
                                    title="Stone Details"
                                    icon={Gem}
                                    show={showStone}
                                    setShow={setShowStone}
                                    isDirty={isStoneDirty}
                                >
                                    <div className="space-y-4">
                                        {/* Input Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                            <InputBlock
                                                label="Stone Name"
                                                value={vals.sName}
                                                onChange={(v) => setVals({ ...vals, sName: v })}
                                                placeholder="Ruby..."
                                            />
                                            <InputBlock
                                                label="Weight (ct)"
                                                value={vals.sWgt}
                                                onChange={(v) => { setVals({ ...vals, sWgt: v }); checkJump(v, refs.sQtyRef); }}
                                                placeholder="0.000"
                                                type="number"
                                                inputRef={refs.sWgtRef}
                                            />
                                            <InputBlock
                                                label="Quantity"
                                                value={vals.sQty}
                                                onChange={(v) => { setVals({ ...vals, sQty: v }); checkJump(v, refs.sPriceRef); }}
                                                placeholder="0"
                                                type="number"
                                                inputRef={refs.sQtyRef}
                                            />

                                            {/* Price Field with Add Button */}
                                            <div className="flex items-end gap-2">
                                                <div className="flex-1">
                                                    <InputBlock
                                                        label="Price"
                                                        value={vals.sPrice}
                                                        onChange={(v) => setVals({ ...vals, sPrice: v })}
                                                        placeholder="0"
                                                        type="number"
                                                        inputRef={refs.sPriceRef}
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleAddStone}
                                                    type="button"
                                                    className="h-[38px] w-[38px] mb-[1px] flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-sm transition-all active:scale-95"
                                                    title="Add Stone"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Stone List Table (Only shows if items exist) */}
                                        {stoneList.length > 0 && (
                                            <div className="mt-4 overflow-hidden border border-slate-200 rounded-lg bg-white shadow-sm">
                                                <table className="w-full text-sm text-left">
                                                    <thead>
                                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                                                            <th className="px-3 py-2">Stone Name</th>
                                                            <th className="px-3 py-2 text-center">Weight</th>
                                                            <th className="px-3 py-2 text-center">Qty</th>
                                                            <th className="px-3 py-2 text-right">Price</th>
                                                            <th className="px-3 py-2 w-10"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {stoneList.map((item) => (
                                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                                <td className="px-3 py-2 text-slate-900 font-medium">{item.name}</td>
                                                                <td className="px-3 py-2 text-center text-slate-600">{item.weight} ct</td>
                                                                <td className="px-3 py-2 text-center text-slate-600">{item.qty} pcs</td>
                                                                <td className="px-3 py-2 text-right font-bold text-slate-800">
                                                                    {Number(item.price).toLocaleString()}
                                                                </td>
                                                                <td className="px-3 py-2 text-center">
                                                                    <button
                                                                        onClick={() => handleRemoveStone(item.id)}
                                                                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    {/* Table Footer with Totals */}
                                                    <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-xs uppercase tracking-wider">
                                                        <tr>
                                                            <td className="px-3 py-2 text-slate-500">Totals</td>
                                                            <td className="px-3 py-2 text-center text-blue-700">
                                                                {stoneList.reduce((acc, cur) => acc + Number(cur.weight || 0), 0).toFixed(3)}
                                                            </td>
                                                            <td className="px-3 py-2 text-center text-slate-700">
                                                                {stoneList.reduce((acc, cur) => acc + Number(cur.qty || 0), 0)}
                                                            </td>
                                                            <td className="px-3 py-2 text-right text-emerald-700">
                                                                {stoneList.reduce((acc, cur) => acc + Number(cur.price || 0), 0).toLocaleString()}
                                                            </td>
                                                            <td></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </SectionWrapper>

                                <SectionWrapper title="Beads Details" icon={CircleDashed} show={showBeads} setShow={setShowBeads} isDirty={isBeadsDirty}>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <InputBlock label="Beads Name" value={vals.bName} onChange={(v) => setVals({ ...vals, bName: v })} placeholder="Pearl..." />
                                        <InputBlock label="Weight" value={vals.bWgt} onChange={(v) => { setVals({ ...vals, bWgt: v }); checkJump(v, refs.bPriceRef); }} placeholder="0.000" type="number" inputRef={refs.bWgtRef} />
                                        <InputBlock label="Price" value={vals.bPrice} onChange={(v) => setVals({ ...vals, bPrice: v })} placeholder="0" type="number" inputRef={refs.bPriceRef} />
                                    </div>
                                </SectionWrapper>

                                <SectionWrapper
                                    title="Diamond Details"
                                    icon={Hammer}
                                    show={showDiamond}
                                    setShow={setShowDiamond}
                                    isDirty={isDiamondDirty}
                                >
                                    <div className="space-y-4">
                                        {/* Input Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <InputBlock
                                                label="Diamond Name"
                                                value={vals.dName}
                                                onChange={(v) => setVals({ ...vals, dName: v })}
                                                placeholder="CVD, Natural..."
                                                onAction={() => setActiveModal('diamond')}
                                            />
                                            <InputBlock label="Cut" value={vals.dCut} onChange={(v) => setVals({ ...vals, dCut: v })} placeholder="Ex..." />
                                            <InputBlock label="Color" value={vals.dColor} onChange={(v) => setVals({ ...vals, dColor: v })} placeholder="G..." />
                                            <InputBlock label="Clarity" value={vals.dClarity} onChange={(v) => setVals({ ...vals, dClarity: v })} placeholder="VS..." />

                                            <InputBlock
                                                label="Weight"
                                                value={vals.dWgt}
                                                onChange={(v) => { setVals({ ...vals, dWgt: v }); checkJump(v, refs.dPriceRef); }}
                                                placeholder="0.000"
                                                type="number"
                                                inputRef={refs.dWgtRef}
                                            />

                                            <InputBlock
                                                label="Rate"
                                                value={vals.dRate}
                                                onChange={(v) => setVals({ ...vals, dRate: v })}
                                                placeholder="0"
                                                type="number"
                                            />
                                            <InputBlock
                                                label="Quantity"
                                                value={vals.dQty}
                                                onChange={(v) => setVals({ ...vals, dQty: v })}
                                                placeholder="0"
                                                type="number"
                                            />

                                            {/* Price Field with Add Button */}
                                            <div className="flex items-end gap-2">
                                                <div className="flex-1">
                                                    <InputBlock
                                                        label="Price"
                                                        value={vals.dPrice}
                                                        onChange={(v) => setVals({ ...vals, dPrice: v })}
                                                        placeholder="0"
                                                        type="number"
                                                        inputRef={refs.dPriceRef}
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleAddDiamond}
                                                    type="button"
                                                    className="h-[38px] w-[38px] mb-[1px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-all active:scale-95"
                                                    title="Add Diamond to List"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Diamond List Table */}
                                        {diamondList.length > 0 && (
                                            <div className="mt-4 overflow-hidden border border-slate-200 rounded-lg bg-white shadow-sm">
                                                <table className="w-full text-sm text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-slate-50 border-b border-slate-200">
                                                            <th className="px-3 py-2 font-semibold text-slate-700">Name</th>
                                                            <th className="px-3 py-2 font-semibold text-slate-700">Specs</th>
                                                            <th className="px-3 py-2 font-semibold text-slate-700 text-center">Wgt/Qty</th>
                                                            <th className="px-3 py-2 font-semibold text-slate-700 text-right">Price</th>
                                                            <th className="px-3 py-2 text-center text-slate-700 w-10"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {diamondList.map((item) => (
                                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                                                <td className="px-3 py-2 text-slate-900 font-medium">{item.name}</td>
                                                                <td className="px-3 py-2 text-slate-500 uppercase">
                                                                    {item.cut} {item.color} {item.clarity}
                                                                </td>
                                                                <td className="px-3 py-2 text-slate-600 text-center">
                                                                    <span className="font-medium text-blue-600">{item.weight}ct</span>
                                                                    <span className="mx-1">/</span>
                                                                    <span>{item.qty}p</span>
                                                                </td>
                                                                <td className="px-3 py-2 text-right font-bold text-slate-800">
                                                                    {Number(item.price).toLocaleString()}
                                                                </td>
                                                                <td className="px-3 py-2 text-center">
                                                                    <button
                                                                        onClick={() => handleRemoveDiamond(item.id)}
                                                                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                                                        <tr>
                                                            <td colSpan={2} className="px-3 py-2 text-slate-600">Total Diamonds:</td>
                                                            <td className="px-3 py-2 text-center text-blue-700">
                                                                {diamondList.reduce((acc, cur) => acc + Number(cur.qty || 0), 0)} pcs
                                                            </td>
                                                            <td className="px-3 py-2 text-right text-emerald-700">
                                                                {diamondList.reduce((acc, cur) => acc + Number(cur.price || 0), 0).toLocaleString()}
                                                            </td>
                                                            <td></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </SectionWrapper>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 lg:col-span-4 lg:sticky lg:top-8">
                        <ImageUploadSidebar {...{ imagePreview, setImagePreview, handleSave, isSubmitting, prodCode, errors, metalConfig, selectedMetal }} />
                    </div>
                </div>
            </div>

            {activeModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                    <div ref={refs.modalRef} className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6">
                        <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 z-10"><X size={18} /></button>

                        {activeModal === 'category' && <CategoryForm onSuccess={() => { fetchCategories(); setActiveModal(null); }} />}
                        {activeModal === 'worker' && <WorkerForm onSuccess={() => { fetchWorkers(); setActiveModal(null); }} />}

                        {activeModal === 'diamond' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800">New Diamond Name</h3>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        autoFocus
                                        className="w-full p-2 border rounded outline-none focus:border-blue-500"
                                        placeholder="e.g. Lab Grown"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setVals({ ...vals, dName: e.currentTarget.value });
                                                setActiveModal(null);
                                            }
                                        }}
                                    />
                                </div>
                                <button
                                    className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700"
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling?.querySelector('input');
                                        if (input) {
                                            setVals({ ...vals, dName: input.value });
                                            setActiveModal(null);
                                        }
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}