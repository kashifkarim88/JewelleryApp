import React from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import Barcode from 'react-barcode';

export const ProductCoreForm = ({
    refs, errors, catSearch, setCatSearch, isCatOpen, setIsCatOpen,
    isLoadingCats, filteredCategories, setProdCode, prodCode, nextItemCode,
    prodDescription, setProdDescription, workerSearch, setWorkerSearch,
    setIsWorkerOpen, isWorkerOpen, isLoadingWorkers, filteredWorkers,
    vals, setVals, setActiveModal
}: any) => {
    return (
        <div className="flex flex-col gap-5">
            <div className={`grid grid-cols-1 transition-all duration-500 gap-5 ${prodCode ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
                <div className="relative" ref={refs.catRef}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Category Search</label>
                    <div className="relative">
                        <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.cat ? 'text-red-500' : 'text-slate-400'}`} size={18} />
                        <input
                            type="text"
                            className={`w-full pl-11 pr-12 py-3.5 rounded-2xl outline-none text-sm font-medium transition-all border
                ${errors.cat ? 'bg-red-50 border-red-500 animate-shake placeholder:text-red-400' : 'bg-slate-50 border-slate-100 focus:border-blue-500 focus:bg-white'}`}
                            placeholder={errors.cat ? "Selection Required" : "Search Category..."}
                            value={catSearch}
                            onFocus={() => setIsCatOpen(true)}
                            onChange={(e) => {
                                setCatSearch(e.target.value);
                                if (e.target.value === "") setProdCode("");
                            }}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <button onClick={() => setActiveModal('category')} className="p-2 bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-blue-600 rounded-xl transition-all shadow-sm"><Plus size={16} /></button>
                        </div>
                        {isCatOpen && (
                            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2">
                                {isLoadingCats ? (
                                    <div className="flex items-center justify-center p-6"><Loader2 className="animate-spin text-blue-500" size={20} /></div>
                                ) : filteredCategories.map((cat: any) => (
                                    <div
                                        key={cat.id}
                                        onMouseDown={() => {
                                            setCatSearch(cat.product_name);
                                            setProdCode(cat.Abbreviation);
                                            setIsCatOpen(false);
                                        }}
                                        className="px-4 py-3 hover:bg-blue-50 rounded-xl cursor-pointer text-sm font-semibold flex justify-between items-center group"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-slate-900">{cat.product_name}</span>
                                            <span className="text-[9px] text-blue-500 font-mono font-bold uppercase">{cat.product_code}</span>
                                        </div>
                                        <span className="text-[10px] bg-blue-100 px-2 py-1 rounded text-blue-700 font-black uppercase">{cat.Abbreviation}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {prodCode && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Target Item Code</label>
                        <div className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-2xl shadow-[0_4px_12px_rgba(59,130,246,0.06)] text-slate-900 text-sm font-mono font-bold flex items-center justify-between min-h-[50px]">
                            <div className="flex flex-col">
                                <span className="text-[8px] text-blue-500 uppercase tracking-tighter -mb-1">Code Preview</span>
                                <span className="text-base">{nextItemCode || "..."}</span>
                            </div>
                            {nextItemCode && !nextItemCode.includes("...") && (
                                <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
                                    <Barcode value={nextItemCode} width={0.8} height={22} fontSize={0} background="transparent" lineColor="#1e293b" margin={0} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest ml-1">Description</label>
                <input
                    type="text"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl outline-none text-sm font-medium transition-all"
                    placeholder="Enter product details..."
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                />
            </div>

            <div className="w-full pt-4 border-t border-slate-50 relative" ref={refs.workerRef}>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1 tracking-widest">Worker</label>
                <div className="relative w-full sm:max-w-xs md:max-w-[280px]">
                    <input
                        type="text"
                        placeholder="Search Worker"
                        className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm focus:bg-white focus:border-blue-500 transition-all font-semibold"
                        value={workerSearch}
                        onFocus={() => setIsWorkerOpen(true)}
                        onChange={(e) => {
                            setWorkerSearch(e.target.value);
                            setVals({ ...vals, worker: e.target.value });
                        }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <button onClick={() => setActiveModal('worker')} className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-500 transition-colors shadow-sm"><Plus size={16} /></button>
                    </div>
                    {isWorkerOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-48 overflow-y-auto p-2">
                            {isLoadingWorkers ? (
                                <div className="flex items-center justify-center p-4"><Loader2 className="animate-spin text-slate-400" size={16} /></div>
                            ) : filteredWorkers.map((w: any) => (
                                <div key={w.id} onMouseDown={() => { setWorkerSearch(w.name); setVals({ ...vals, worker: w.name }); setIsWorkerOpen(false); }} className="px-4 py-3 hover:bg-blue-50 rounded-xl cursor-pointer text-sm font-semibold flex justify-between items-center group">
                                    <span className="text-slate-900">{w.name}</span>
                                    <span className="text-[9px] bg-slate-100 px-2 py-1 rounded text-blue-600 font-mono font-bold uppercase">{w.worker_code || 'N/A'}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};