"use client";

import React from 'react';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { FullInput } from '../BillingComponents';

interface Customer {
    name: string;
    phone: string;
    seller: string;
}

interface CustomerSearchSectionProps {
    customer: Customer;
    setCustomer: (data: Partial<Customer>) => void;
    itemInput: string;
    setItemInput: (value: string) => void;
    showLoader: boolean;
    errorMessage: string | null;
    setErrorMessage: (msg: string | null) => void;
    onAddProduct: (e: React.FormEvent) => void;
}

export function CustomerSearchSection({
    customer,
    setCustomer,
    itemInput,
    setItemInput,
    showLoader,
    errorMessage,
    setErrorMessage,
    onAddProduct,
}: CustomerSearchSectionProps) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all">
            {/* Customer Info Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <FullInput
                    label="Customer Name"
                    placeholder="Enter Name"
                    value={customer.name}
                    onChange={(v) => setCustomer({ name: v })}
                />
                <FullInput
                    label="Phone Number"
                    placeholder="03xx-xxxxxxx"
                    value={customer.phone}
                    onChange={(v) => setCustomer({ phone: v })}
                />
                <FullInput
                    label="Seller Name"
                    placeholder="Seller name"
                    value={customer.seller}
                    onChange={(v) => setCustomer({ seller: v })}
                />
            </div>

            {/* Stock Search Form */}
            <form onSubmit={onAddProduct} className="flex flex-col mt-4">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">
                    Stock Search
                </label>
                <div className="relative group">
                    <input
                        className={`w-full py-2.5 px-4 bg-slate-50 border ${errorMessage
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-50'
                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-50'
                            } rounded-xl text-xs font-bold outline-none uppercase transition-all focus:bg-white focus:ring-4`}
                        placeholder="SCAN OR TYPE CODE..."
                        value={itemInput}
                        disabled={showLoader}
                        onChange={(e) => {
                            setItemInput(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                        }}
                    />
                    <button
                        type="submit"
                        disabled={showLoader}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
                    >
                        {showLoader ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    </button>
                </div>
            </form>

            {/* Error Message Alert */}
            {errorMessage && (
                <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 animate-fadeIn">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1 text-xs font-semibold leading-relaxed">
                        {errorMessage}
                    </div>
                    <button
                        onClick={() => setErrorMessage(null)}
                        className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </div>
    );
}