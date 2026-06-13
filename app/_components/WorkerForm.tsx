"use client"
import React, { useEffect, useState, useCallback } from "react";
import { User, Phone, Hash, Briefcase, CheckCircle2 } from "lucide-react";

interface WorkerFormProps {
    worker?: any; // For editing mode if data is passed down
    onWorkerCreated?: () => void; // The safe callback to refresh parent state
}

export default function WorkerForm({ worker, onWorkerCreated }: WorkerFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Populate values if an existing worker is supplied for editing
    useEffect(() => {
        if (worker) {
            setName(worker.name || "");
            setPhone(worker.phone_number || "");
            setCode(worker.worker_code || "");
        }
    }, [worker]);

    const refreshNextCode = useCallback(async () => {
        if (worker) return; // Don't overwrite the code if we are in edit mode
        try {
            const res = await fetch("/api/workers/check");
            const data = await res.json();
            if (data.nextCode) {
                setCode(data.nextCode);
            }
        } catch (err) {
            console.error("Failed to fetch next worker code");
        }
    }, [worker]);

    useEffect(() => {
        refreshNextCode();
    }, [refreshNextCode]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("Worker name is required");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess(false);

            // Dynamically change routing/methods based on Edit vs Create modes
            const url = worker ? `/api/workers/${worker.id}` : "/api/workers";
            const method = worker ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    phone_number: phone,
                    worker_code: code,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
            } else {
                setSuccess(true);

                // Clear inputs only if creating a brand new record
                if (!worker) {
                    setName("");
                    setPhone("");
                    await refreshNextCode();
                }

                // Fires trigger pipeline up to StockModals -> StockPage
                if (onWorkerCreated) onWorkerCreated();
            }
        } catch (error) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 bg-white max-w-md mx-auto rounded-3xl">
            <div className="mb-8">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Briefcase size={20} className="text-blue-600" />
                    {worker ? "Edit Worker Details" : "New Worker"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                    {worker ? "Modify employee information saved on the system." : "Register a new employee to the system."}
                </p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    {worker ? "Worker updated successfully!" : "Worker added successfully!"}
                </div>
            )}

            <div className="space-y-5">
                <ModalInput
                    label="Worker Name"
                    icon={User}
                    placeholder="Full Name"
                    value={name}
                    onChange={setName}
                />
                <ModalInput
                    label="Contact Number"
                    icon={Phone}
                    placeholder="0334..."
                    value={phone}
                    onChange={setPhone}
                />
                <ModalInput
                    label="Worker Code (Auto)"
                    icon={Hash}
                    placeholder="WC-001"
                    value={code}
                    onChange={setCode}
                    readOnly
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
                {loading ? "Processing..." : worker ? "Save Changes" : "Register Worker"}
            </button>
        </div>
    );
}

function ModalInput({ label, icon: Icon, placeholder, value, onChange, readOnly = false }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icon size={16} /></div>
                <input
                    type="text"
                    value={value}
                    readOnly={readOnly}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-2xl transition-all focus:outline-none 
                        ${readOnly ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-slate-50 border-slate-100 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500'}`}
                />
            </div>
        </div>
    );
}