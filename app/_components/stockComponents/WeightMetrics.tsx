import React from 'react';

export const WeightMetrics = ({ vals, setVals, refs, errors, checkJump }: any) => {
    const fields = [
        { label: 'Net Wgt', key: 'netWeight', placeholder: '0.000' },
        { label: 'Wastage %', key: 'wastage', placeholder: '0.000', ref: refs.wastageRef },
        { label: 'Wastage/G', key: 'WastageGram', placeholder: '0.000', ref: refs.WastageGramRef },
        { label: 'Making', key: 'making', placeholder: '0', ref: refs.makingRef },
    ];

    const handleFieldChange = (key: string, label: string, value: string) => {
        let newVals = { ...vals, [key]: value };
        const numValue = parseFloat(value) || 0;
        const netW = label === 'Net Wgt' ? numValue : (parseFloat(vals.netWeight) || 0);

        // Scenario A: Calculate Wastage/G (User typed Net Wgt or Wastage %)
        if (label === 'Net Wgt' || label === 'Wastage %') {
            const wastP = label === 'Wastage %' ? numValue : (parseFloat(vals.wastage) || 0);

            if (netW > 0 && wastP > 0) {
                newVals.WastageGram = ((netW * wastP) / 100).toFixed(3);
            } else if (netW > 0 && label === 'Wastage %' && value === "") {
                newVals.WastageGram = ""; // Clear if input is cleared
            }
        }

        // Scenario B: Calculate Wastage % (User typed directly into Wastage/G)
        if (label === 'Wastage/G') {
            if (netW > 0 && numValue > 0) {
                // Calculate what percentage the grams are of the net weight
                newVals.wastage = ((numValue / netW) * 100).toFixed(3);
            } else if (value === "") {
                newVals.wastage = ""; // Clear if input is cleared
            }
        }

        setVals(newVals);

        // Jump Logic remains the same
        if (label === 'Net Wgt') checkJump(value, refs.wastageRef);
        if (label === 'Wastage %') checkJump(value, refs.WastageGramRef);
        if (label === 'Wastage/G') checkJump(value, refs.makingRef);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fields.map((field) => (
                <div key={field.key}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">
                        {field.label}
                    </label>
                    <input
                        ref={field.ref as any}
                        type="number"
                        step="any"
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-3 rounded-2xl outline-none text-sm transition-all font-medium border
                            ${(field.key === 'netWeight' && errors.weight)
                                ? 'bg-red-50 border-red-500 animate-shake placeholder:text-red-400'
                                : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-500'}`}
                        value={(vals as any)[field.key]}
                        onChange={(e) => handleFieldChange(field.key, field.label, e.target.value)}
                    />
                </div>
            ))}
        </div>
    );
};