"use client";

import React from 'react';
import { X } from 'lucide-react';
import DiamondForm from '../DiamondForm';
import CategoryForm from '../CategoryForm';
import WorkerForm from '../WorkerForm';
import StoneForm from '../StoneForm';

export type ActiveModalType = 'diamond' | 'category' | 'worker' | 'stone' | null;

interface StockModalsProps {
    activeModal: ActiveModalType;
    setActiveModal: React.Dispatch<React.SetStateAction<any>>;
    vals: any;
    setVals: any;
    refs: any;
    fetchCategories?: () => Promise<void> | void;
    fetchWorkers?: () => Promise<void> | void;
    onDiamondCreated: () => void;
    onCategoryCreated: () => void;
    onWorkerCreated: () => void;
    onStoneCreated?: () => void;
    fetchStones?: () => Promise<void> | void;
}

export default function StockModals({
    activeModal,
    setActiveModal,
    vals,
    setVals,
    refs,
    fetchCategories,
    fetchWorkers,
    onDiamondCreated,
    onCategoryCreated,
    onWorkerCreated,
    onStoneCreated,
    fetchStones,
}: StockModalsProps) {

    if (!activeModal) return null;
    const closeModal = () => setActiveModal(null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={closeModal} />

            <div className="relative w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl p-6 z-10">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    type="button"
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <X size={18} />
                </button>

                {/* --- Diamond Modal --- */}
                {activeModal === 'diamond' && (
                    <DiamondForm
                        vals={vals}
                        setVals={setVals}
                        onDiamondCreated={() => {
                            onDiamondCreated();
                            closeModal();
                        }}
                    />
                )}

                {/* --- Category Modal --- */}
                {activeModal === 'category' && (
                    <CategoryForm
                        onCategoryCreated={() => {
                            if (fetchCategories) fetchCategories();
                            onCategoryCreated();
                            closeModal();
                        }}
                    />
                )}

                {/* --- Worker Modal --- */}
                {activeModal === 'worker' && (
                    <WorkerForm
                        onWorkerCreated={() => {
                            if (fetchWorkers) fetchWorkers();
                            onWorkerCreated();
                            closeModal();
                        }}
                    />
                )}

                {/* --- Stone Modal --- */}
                {activeModal === 'stone' && (
                    <StoneForm
                        onStoneCreated={() => {
                            if (fetchStones) fetchStones();
                            if (onStoneCreated) onStoneCreated();
                            closeModal();
                        }}
                    />
                )}
            </div>
        </div>
    );
}