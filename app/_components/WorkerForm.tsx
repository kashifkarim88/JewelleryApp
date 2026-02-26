"use client"
import React, { useState } from "react";
import { User, Phone, Hash, Plus, Briefcase } from "lucide-react";

export default function WorkerForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch("/api/workers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
                alert("Worker added successfully!");
                setName("");
                setPhone("");
                setCode("");
            }
        } catch (error) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 bg-white">
            <div className="mb-8">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Briefcase size={20} className="text-blue-600" />
                    New Worker
                </h2>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                    {error}
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
                    label="Worker Code"
                    icon={Hash}
                    placeholder="W-001"
                    value={code}
                    onChange={setCode}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-8 bg-blue-600 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Adding..." : "Register Worker"}
            </button>
        </div>
    );
}

function ModalInput({
    label,
    icon: Icon,
    placeholder,
    value,
    onChange,
}: {
    label: string;
    icon: any;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
}) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon size={16} />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
            </div>
        </div>
    );
}