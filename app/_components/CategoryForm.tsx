"use client"
import React, { useState, useEffect } from 'react';
import { Tag, Plus, Hash, Type, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// --- 1. Define Props Interface for TypeScript Build Safety ---
interface CategoryFormProps {
    onSuccess?: () => void;
}

export default function CategoryForm({ onSuccess }: CategoryFormProps) {
    const [productname, setProductName] = useState("");
    const [productAbbreviation, setProductAbbreviation] = useState("");
    const [productCode, setProductCode] = useState("");

    const [isAbbrTaken, setIsAbbrTaken] = useState(false);
    const [checkingAbbr, setCheckingAbbr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // --- Debounced Search & Auto-Code Generation ---
    useEffect(() => {
        if (productAbbreviation.trim().length < 1) {
            setIsAbbrTaken(false);
            setProductCode("");
            return;
        }

        const checkAbbr = async () => {
            setCheckingAbbr(true);
            try {
                const res = await fetch(`/api/category/check?abbr=${productAbbreviation.trim()}`);
                const data = await res.json();

                const taken = data.exists === true;
                setIsAbbrTaken(taken);

                if (!taken && data.suggestedCode) {
                    setProductCode(data.suggestedCode);
                } else if (taken) {
                    setProductCode("");
                }

            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setCheckingAbbr(false);
            }
        };

        const timer = setTimeout(checkAbbr, 500);
        return () => clearTimeout(timer);
    }, [productAbbreviation]);

    // --- 2. Form Submission with Callback ---
    const handleSubmit = async () => {
        if (isAbbrTaken || !productname || !productAbbreviation || !productCode) return;

        try {
            setLoading(true);
            setError("");
            setSuccess(false);

            const res = await fetch("/api/category", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productname,
                    productAbbreviation,
                    productCode
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to add category");
            } else {
                setSuccess(true);

                // --- 3. TRIGGER AUTO-REFRESH IN STOCK PAGE ---
                if (onSuccess) {
                    onSuccess();
                }

                // Reset form fields
                setProductName("");
                setProductAbbreviation("");
                setProductCode("");

                // Short delay to show success before modal usually closes
                setTimeout(() => setSuccess(false), 2000);
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 bg-white max-w-md mx-auto rounded-3xl">
            <div className="mb-8">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Tag size={20} className="text-blue-600" />
                    New Category
                </h2>
                <p className="text-slate-500 text-xs font-medium mt-1">Register a product type.</p>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[11px] flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-[11px] flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 size={14} /> Category added successfully!
                </div>
            )}

            <div className="space-y-5">
                <ModalInput
                    label="Product Name"
                    icon={Type}
                    placeholder="e.g. Bracelet"
                    value={productname}
                    onChange={setProductName}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <ModalInput
                            label="Abbreviation"
                            icon={Hash}
                            placeholder="BR"
                            value={productAbbreviation}
                            onChange={(val: string) => setProductAbbreviation(val.toUpperCase())}
                        />
                        <div className="absolute right-3 top-[38px]">
                            {checkingAbbr ? (
                                <Loader2 size={14} className="animate-spin text-blue-500" />
                            ) : productAbbreviation.length > 0 ? (
                                isAbbrTaken ?
                                    <AlertCircle size={14} className="text-red-500" /> :
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                            ) : null}
                        </div>
                        {isAbbrTaken && <p className="text-[9px] text-red-500 font-bold mt-1 ml-1 uppercase">Taken</p>}
                    </div>

                    <div className="relative">
                        <ModalInput
                            label="Product Code"
                            icon={Hash}
                            placeholder="..."
                            value={productCode}
                            onChange={setProductCode}
                            readOnly={true}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading || isAbbrTaken || !productname || !productAbbreviation || !productCode}
                className="w-full mt-8 bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} strokeWidth={3} />}
                <span className="text-sm uppercase tracking-widest">{loading ? "Adding..." : "Add Category"}</span>
            </button>
        </div>
    );
}

// Reusable Input Component (Type-safe)
function ModalInput({ label, icon: Icon, value, onChange, placeholder, readOnly }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Icon size={16} />
                </div>
                <input
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3.5 border border-slate-100 rounded-2xl outline-none text-sm font-medium transition-all ${readOnly ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-slate-50 focus:bg-white focus:border-blue-500'
                        }`}
                />
            </div>
        </div>
    );
}