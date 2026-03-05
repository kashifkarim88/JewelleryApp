"use client"
import React from 'react';
import Barcode from 'react-barcode';
import { Search, Package, Hammer, Gem, Camera, X, ChevronDown, ChevronUp, Lock, Plus, Loader2 } from 'lucide-react';
import CategoryForm from './CategoryForm';
import WorkerForm from './WorkerForm';
import { useStockLogic } from '../hooks/useStockForm';

export default function StockPage() {
    const {
        mounted, nextItemCode, selectedMetal, setSelectedMetal, selectedCarat, setSelectedCarat,
        catSearch, setCatSearch, isCatOpen, setIsCatOpen, workerSearch, setWorkerSearch,
        isWorkerOpen, setIsWorkerOpen, activeModal, setActiveModal, prodDescription, setProdDescription,
        prodCode, setProdCode, imagePreview, setImagePreview, isSubmitting, vals, setVals,
        showStone, setShowStone, showBeads, setShowBeads, showDiamond, setShowDiamond,
        isStoneDirty, isBeadsDirty, isDiamondDirty, filteredCategories, filteredWorkers,
        refs, handleSave, fetchCategories, fetchWorkers, isLoadingCats, isLoadingWorkers, errors
    } = useStockLogic();

    const checkJump = (val: string, nextRef: React.RefObject<HTMLInputElement | null>) => {
        if (/\.\d{3}$/.test(val)) nextRef.current?.focus();
    };

    if (!mounted) return null;

    const METALS = ["Gold", "Palladium", "Platinum", "Silver"];
    const GOLD_CARATS = ["24K", "22K", "21K", "18K", "14K"];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-8 p-4 md:p-8 text-slate-900 antialiased font-sans">
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
                input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                input[type=number] { -moz-appearance: textfield; }
            `}</style>

            <div className="max-w-6xl mx-auto">
                {/* BANNER */}
                <div className="mt-4 mb-4 flex flex-col items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Item Code:</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{nextItemCode}</span>
                        <div className="flex items-center opacity-80">
                            <Barcode value={nextItemCode} width={0.8} height={12} background="transparent" lineColor="#2563eb" displayValue={false} margin={0} />
                        </div>
                    </div>
                </div>

                <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-y-6 gap-x-4">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 truncate">Product Entry</h1>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:justify-end">
                        <div className="flex p-2 items-center gap-3 overflow-x-auto scrollbar-hide">
                            {selectedMetal === "Gold" && (
                                <div className="flex items-center gap-1 bg-amber-50/80 backdrop-blur-sm p-1.5 rounded-2xl border border-amber-100 shadow-sm shrink-0">
                                    {GOLD_CARATS.map((carat) => (
                                        <button key={carat} onClick={() => setSelectedCarat(carat)} className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all ${selectedCarat === carat ? 'bg-amber-500 text-white shadow-md' : 'text-amber-700 hover:bg-amber-100'}`}>{carat}</button>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                                {METALS.map((metal) => (
                                    <label key={metal} className="flex items-center cursor-pointer">
                                        <input type="radio" className="hidden" name="metal" checked={selectedMetal === metal} onChange={() => setSelectedMetal(metal)} />
                                        <span className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase transition-all ${selectedMetal === metal ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{metal}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="order-2 lg:order-1 lg:col-span-8 space-y-6 bg-white rounded-3xl border border-slate-200 p-5 md:p-8 shadow-sm">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative" ref={refs.catRef}>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Category Search</label>
                                <div className="relative">
                                    <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.cat ? 'text-red-500' : 'text-slate-400'}`} size={18} />
                                    <input
                                        type="text"
                                        className={`w-full pl-11 pr-12 py-3.5 rounded-2xl outline-none text-sm font-medium transition-all border
                                            ${errors.cat ? 'bg-red-50 border-red-500 animate-shake placeholder:text-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder={errors.cat ? "Selection Required" : "Search..."}
                                        value={catSearch}
                                        onFocus={() => setIsCatOpen(true)}
                                        onChange={(e) => { setCatSearch(e.target.value); if (e.target.value === "") setProdCode(""); }}
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <button onClick={() => setActiveModal('category')} className="p-2 bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-blue-600 rounded-xl transition-all shadow-sm"><Plus size={16} /></button>
                                    </div>
                                    {isCatOpen && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2">
                                            {isLoadingCats ? (
                                                <div className="flex items-center justify-center p-6"><Loader2 className="animate-spin text-blue-500" size={20} /></div>
                                            ) : filteredCategories.map(cat => (
                                                <div key={cat.id} onMouseDown={() => { setCatSearch(cat.product_name); setProdCode(cat.product_code); setIsCatOpen(false); }} className="px-4 py-3 hover:bg-blue-50 rounded-xl cursor-pointer text-sm font-semibold flex justify-between items-center group">
                                                    <div className="flex flex-col"><span className="text-slate-900">{cat.product_name}</span><span className="text-[9px] text-blue-500 font-mono font-bold uppercase">{cat.product_code}</span></div>
                                                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold uppercase">{cat.Abbreviation}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Stock Code</label>
                                    <input type="text" readOnly className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-mono font-bold outline-none ${prodCode ? 'bg-blue-50/50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`} value={prodCode || "---"} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Description</label>
                                    <input type="text" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl outline-none text-sm font-medium transition-all" placeholder="Details..." value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4 border-t border-slate-50">
                            <div className="col-span-2 relative" ref={refs.workerRef}>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1 tracking-widest">Worker</label>
                                <div className="relative group/worker">
                                    <input type="text" placeholder="Search Worker" className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm focus:bg-white focus:border-blue-500 transition-all font-semibold" value={workerSearch} onFocus={() => setIsWorkerOpen(true)} onChange={(e) => { setWorkerSearch(e.target.value); setVals({ ...vals, worker: e.target.value }); }} />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <button onClick={() => setActiveModal('worker')} className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-xl"><Plus size={14} /></button>
                                    </div>
                                    {isWorkerOpen && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-48 overflow-y-auto p-2">
                                            {isLoadingWorkers ? (
                                                <div className="flex items-center justify-center p-4"><Loader2 className="animate-spin text-slate-400" size={16} /></div>
                                            ) : filteredWorkers.map(w => (
                                                <div key={w.id} onMouseDown={() => { setWorkerSearch(w.name); setVals({ ...vals, worker: w.name }); setIsWorkerOpen(false); }} className="px-4 py-3 hover:bg-blue-50 rounded-xl cursor-pointer text-sm font-semibold flex justify-between items-center group">
                                                    <span className="text-slate-900">{w.name}</span>
                                                    <span className="text-[9px] bg-slate-100 px-2 py-1 rounded text-blue-600 font-mono font-bold uppercase">{w.worker_code || 'N/A'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {[
                                { label: 'Net Wgt', key: 'netWeight', placeholder: '0.000' },
                                { label: 'Wastage/G', key: 'WastageGram', placeholder: '0.000', ref: refs.WastageGramRef },
                                { label: 'Wastage %', key: 'wastage', placeholder: '0.000', ref: refs.wastageRef },
                                { label: 'Making', key: 'making', placeholder: '0', ref: refs.makingRef },
                            ].map((field) => (
                                <div key={field.key}>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">{field.label}</label>
                                    <input
                                        ref={field.ref as any}
                                        type="number"
                                        placeholder={field.placeholder}
                                        className={`w-full px-4 py-3 rounded-2xl outline-none text-sm transition-all font-medium border
                                            ${(field.key === 'netWeight' && errors.weight) ? 'bg-red-50 border-red-500 animate-shake placeholder:text-red-400' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-500'}`}
                                        value={vals[field.key as keyof typeof vals]}
                                        onChange={(e) => {
                                            setVals({ ...vals, [field.key]: e.target.value });
                                            if (field.label === 'Net Wgt') checkJump(e.target.value, refs.WastageGramRef);
                                            if (field.label === 'Wastage/G') checkJump(e.target.value, refs.wastageRef);
                                            if (field.label === 'Wastage %') checkJump(e.target.value, refs.makingRef);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6">
                            <SectionWrapper title="Stone Details" icon={Gem} show={showStone} setShow={setShowStone} isDirty={isStoneDirty}>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <InputBlock label="Stone Name" value={vals.sName} onChange={(v: string) => setVals({ ...vals, sName: v })} placeholder="Ruby..." />
                                    <InputBlock label="Weight (Carat)" value={vals.sWgt} onChange={(v: string) => { setVals({ ...vals, sWgt: v }); checkJump(v, refs.sPriceRef); }} placeholder="0.000" type="number" inputRef={refs.sWgtRef} />
                                    <InputBlock label="Price" value={vals.sPrice} onChange={(v: string) => setVals({ ...vals, sPrice: v })} placeholder="0" type="number" inputRef={refs.sPriceRef} />
                                </div>
                            </SectionWrapper>

                            <SectionWrapper title="Beads Details" icon={Package} show={showBeads} setShow={setShowBeads} isDirty={isBeadsDirty}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputBlock label="Bead Weight" value={vals.bWgt} onChange={(v: string) => { setVals({ ...vals, bWgt: v }); checkJump(v, refs.bPriceRef); }} placeholder="0.000" type="number" />
                                    <InputBlock label="Price" value={vals.bPrice} onChange={(v: string) => setVals({ ...vals, bPrice: v })} placeholder="0" type="number" inputRef={refs.bPriceRef} />
                                </div>
                            </SectionWrapper>

                            <SectionWrapper title="Diamond Details" icon={Hammer} show={showDiamond} setShow={setShowDiamond} isDirty={isDiamondDirty}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="col-span-2"><InputBlock label="Diamond Name" value={vals.dName} onChange={(v: string) => setVals({ ...vals, dName: v })} placeholder="Round Brilliant" /></div>
                                    <InputBlock label="Weight" value={vals.dWgt} onChange={(v: string) => { setVals({ ...vals, dWgt: v }); checkJump(v, refs.dColorRef); }} placeholder="0.000" type="number" inputRef={refs.dWgtRef} />
                                    <InputBlock label="Color" value={vals.dColor} onChange={(v: string) => setVals({ ...vals, dColor: v })} placeholder="D-F" inputRef={refs.dColorRef} />
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
                                    <><img src={imagePreview} alt="Preview" className="h-full w-full object-cover" /><button onClick={() => setImagePreview(null)} className="absolute top-3 right-3 p-2 bg-white/90 rounded-xl text-red-500 shadow-md"><X size={18} /></button></>
                                ) : (
                                    <button type="button" onClick={() => (document.getElementById('file-upload') as HTMLInputElement).click()} className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-blue-500 transition-colors"><div className="p-4 bg-white rounded-full shadow-sm"><Camera size={32} /></div><span className="text-[10px] font-bold uppercase tracking-wider">Upload Image</span></button>
                                )}
                                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setImagePreview(reader.result as string); reader.readAsDataURL(file); } }} />
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className={`w-full font-bold py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2
                                    ${(errors.cat || errors.weight) ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 'bg-slate-900 hover:bg-black shadow-slate-100'} 
                                    text-white disabled:opacity-70`}
                            >
                                {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Saving...</> : (errors.cat || errors.weight ? "Missing Fields" : "Update Inventory")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                    <div ref={refs.modalRef} className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden">
                        <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 z-10"><X size={20} /></button>
                        {activeModal === 'category' ? <CategoryForm onSuccess={() => { fetchCategories(); setActiveModal(null); }} /> : <WorkerForm onSuccess={() => { fetchWorkers(); setActiveModal(null); }} />}
                    </div>
                </div>
            )}
        </div>
    );
}

function InputBlock({ label, value, onChange, placeholder, type = "text", inputRef }: any) {
    return (
        <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1 tracking-widest">{label}</label>
            <input ref={inputRef} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-medium focus:bg-white focus:border-blue-500 transition-all appearance-none" type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}

function SectionWrapper({ title, icon: Icon, children, show, setShow, isDirty }: any) {
    const handleToggle = () => { if (!isDirty) setShow(!show); };
    const activeShow = isDirty || show;
    return (
        <div className={`rounded-2xl border transition-all duration-300 ${activeShow ? 'border-blue-100 bg-blue-50/10' : 'border-slate-100 bg-white'}`}>
            <button type="button" onClick={handleToggle} className={`w-full flex items-center justify-between p-4 text-left ${isDirty ? 'cursor-default' : 'cursor-pointer'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeShow ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-400'}`}><Icon size={16} /></div>
                    <div className="flex flex-col"><span className={`text-sm font-bold ${activeShow ? 'text-blue-900' : 'text-slate-600'}`}>{title}</span>{isDirty && <span className="text-[9px] text-blue-500 font-bold uppercase tracking-tighter">Locked</span>}</div>
                </div>
                {isDirty ? <Lock size={16} className="text-blue-500" /> : (activeShow ? <ChevronUp size={18} className="text-blue-400" /> : <ChevronDown size={18} className="text-slate-300" />)}
            </button>
            {activeShow && <div className="p-4 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">{children}</div>}
        </div>
    );
}