"use client";

import React, { useState } from 'react';
import { useStockLogic } from '../hooks/useStockForm';

import { MetalSelector } from './stockComponents/MetalSelector';
import { ProductCoreForm } from './stockComponents/ProductCoreForm';
import { WeightMetrics } from './stockComponents/WeightMetrics';
import { ImageUploadSidebar } from './stockComponents/ImageUploadSidebar';

import StoneSection from './stockComponents/StoneSection';
import DiamondSection from './stockComponents/DiamondSection';
import BeadsSection from './stockComponents/BeadsSection';
import StockModals from './stockComponents/StockModals';

export default function StockPage() {
    const [stoneRefreshTrigger, setStoneRefreshTrigger] = useState<number>(0);
    const hookState = useStockLogic();
    const {
        mounted, nextItemCode, selectedMetal, setSelectedMetal, selectedCarat, setSelectedCarat,
        catSearch, setCatSearch, isCatOpen, setIsCatOpen, workerSearch, setWorkerSearch,
        isWorkerOpen, setIsWorkerOpen, activeModal, setActiveModal, prodDescription, setProdDescription,
        prodCode, setProdCode, imagePreview, setImagePreview, isSubmitting, vals, setVals,
        showStone, setShowStone, showBeads, setShowBeads, showDiamond, setShowDiamond,
        isStoneDirty, isBeadsDirty, isDiamondDirty, filteredCategories, filteredWorkers,
        refs, handleSave, fetchCategories, fetchWorkers, isLoadingCats, isLoadingWorkers, errors,
        diamondList, handleAddDiamond, handleRemoveDiamond, stoneList, handleAddStone, handleRemoveStone, stoneTypes,
        fetchStones
    } = hookState;

    // Seamless communication pipeline variable tracking state changes across modals
    const [diamondRefreshTrigger, setDiamondRefreshTrigger] = useState<number>(0);
    const [categoryRefreshTrigger, setCategoryRefreshTrigger] = useState<number>(0);
    const [workerRefreshTrigger, setWorkerRefreshTrigger] = useState<number>(0);

    const metalConfig: any = {
        Gold: {
            bg: "bg-amber-400 text-amber-950 border-amber-500 shadow-sm",
            caratActive: "bg-amber-600 text-white shadow-md",
            caratInactive: "text-amber-800 hover:bg-amber-100",
            caratContainer: "bg-amber-50/80 border-amber-100",
            button: "bg-amber-500 hover:bg-amber-600 shadow-amber-100"
        },
        Palladium: { bg: "bg-cyan-100 text-cyan-900 border-cyan-300", button: "bg-cyan-600 hover:bg-cyan-700" },
        Platinum: { bg: "bg-indigo-100 text-indigo-950 border-indigo-200", button: "bg-indigo-600 hover:bg-indigo-700" },
        Silver: { bg: "bg-slate-200 text-slate-800 border-slate-300", button: "bg-slate-700 hover:bg-slate-800" }
    };

    const checkJump = (val: string, nextRef: React.RefObject<HTMLInputElement>) => {
        if (/\.\d{3}$/.test(val)) {
            if (nextRef && nextRef.current) nextRef.current.focus();
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F1F5F9] pb-24 md:pb-8 p-4 md:p-8 text-slate-900 antialiased font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Product Entry</h1>
                        <p className="text-slate-500 text-sm">Add new inventory items to the system</p>
                    </div>
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
                                refs={refs} errors={errors} catSearch={catSearch} setCatSearch={setCatSearch}
                                isCatOpen={isCatOpen} setIsCatOpen={setIsCatOpen} isLoadingCats={isLoadingCats}
                                filteredCategories={filteredCategories} setProdCode={setProdCode} prodCode={prodCode}
                                nextItemCode={nextItemCode} prodDescription={prodDescription} setProdDescription={setProdDescription}
                                workerSearch={workerSearch} setWorkerSearch={setWorkerSearch} setIsWorkerOpen={setIsWorkerOpen}
                                isWorkerOpen={isWorkerOpen} isLoadingWorkers={isLoadingWorkers} filteredWorkers={filteredWorkers}
                                vals={vals} setVals={setVals} setActiveModal={setActiveModal}
                            />

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <WeightMetrics vals={vals} setVals={setVals} refs={refs} errors={errors} checkJump={checkJump} />
                            </div>

                            <div className="space-y-4 mt-8">
                                <StoneSection
                                    vals={vals} setVals={setVals} refs={refs}
                                    stoneList={stoneList}
                                    stoneTypes={hookState.stoneTypes || []} // 🚩 Feed master database stones array here
                                    handleAddStone={handleAddStone}
                                    handleRemoveStone={handleRemoveStone}
                                    checkJump={checkJump}
                                    showStone={showStone}
                                    setShowStone={setShowStone}
                                    isStoneDirty={isStoneDirty}
                                    setActiveModal={setActiveModal}
                                />
                                <BeadsSection
                                    vals={vals} setVals={setVals} refs={refs} checkJump={checkJump}
                                    showBeads={showBeads} setShowBeads={setShowBeads} isBeadsDirty={isBeadsDirty}
                                />
                                <DiamondSection
                                    vals={vals} setVals={setVals} refs={refs} checkJump={checkJump}
                                    diamondList={diamondList} handleAddDiamond={handleAddDiamond}
                                    handleRemoveDiamond={handleRemoveDiamond} setActiveModal={setActiveModal}
                                    showDiamond={showDiamond} setShowDiamond={setShowDiamond}
                                    isDiamondDirty={isDiamondDirty} diamondRefreshTrigger={diamondRefreshTrigger}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 lg:col-span-4 lg:sticky lg:top-8">
                        <ImageUploadSidebar
                            imagePreview={imagePreview} setImagePreview={setImagePreview}
                            handleSave={handleSave} isSubmitting={isSubmitting} prodCode={prodCode}
                            errors={errors} metalConfig={metalConfig} selectedMetal={selectedMetal}
                        />
                    </div>
                </div>
            </div>

            {/* FIXED: Safely cast the setter here so it matches whatever internal types StockModals expects */}
            <StockModals
                activeModal={activeModal}
                setActiveModal={setActiveModal as any}
                vals={vals} setVals={setVals} refs={refs}
                fetchCategories={fetchCategories}
                fetchWorkers={fetchWorkers}
                fetchStones={fetchStones} // 🚩 Pass it here so StockModals can execute it on save success
                onDiamondCreated={() => setDiamondRefreshTrigger(prev => prev + 1)}
                onCategoryCreated={() => setCategoryRefreshTrigger(prev => prev + 1)}
                onWorkerCreated={() => setWorkerRefreshTrigger(prev => prev + 1)}
                onStoneCreated={() => setStoneRefreshTrigger(prev => prev + 1)}
            />
        </div>
    );
}