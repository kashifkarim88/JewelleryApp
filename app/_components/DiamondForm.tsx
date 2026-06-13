"use client";

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface DiamondFormProps {
    fetchDiamonds?: () => Promise<void> | void;
    vals: any;
    setVals: any;
    onDiamondCreated?: () => void;
}

export default function DiamondForm({
    fetchDiamonds,
    vals,
    setVals,
    onDiamondCreated
}: DiamondFormProps) {
    const [diamondName, setDiamondName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSaveDiamond = async (nameToSave: string) => {
        const trimmedName = nameToSave.trim();
        if (!trimmedName) {
            setError("Name cannot be empty");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/diamond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmedName }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong');

            if (setVals && vals) {
                setVals({ ...vals, dName: data.name });
            }

            if (fetchDiamonds) await fetchDiamonds();
            if (onDiamondCreated) onDiamondCreated();

            setDiamondName('');
        } catch (err: any) {
            setError(err.message);
        } {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">New Diamond Name</h3>
            <input
                type="text" autoFocus value={diamondName}
                onChange={(e) => setDiamondName(e.target.value)} disabled={loading}
                className="w-full p-2 border rounded outline-none focus:border-blue-500 disabled:bg-slate-50"
                placeholder="e.g. Lab Grown"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) handleSaveDiamond(diamondName);
                }}
            />
            {error && <p className="text-xs font-semibold text-red-500 bg-red-50 p-2 rounded">{error}</p>}
            <button
                className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-blue-400"
                disabled={loading} onClick={() => handleSaveDiamond(diamondName)}
            >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Saving... </> : 'Save'}
            </button>
        </div>
    );
}