import React from 'react';
import { Camera, X, Loader2 } from 'lucide-react';

export const ImageUploadSidebar = ({ imagePreview, setImagePreview, handleSave, isSubmitting, prodCode, errors, metalConfig, selectedMetal }: any) => {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="aspect-square w-full relative rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 overflow-hidden flex flex-col items-center justify-center group hover:border-blue-300 transition-all mb-6">
                {imagePreview ? (
                    <>
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                        <button onClick={() => setImagePreview(null)} className="absolute top-3 right-3 p-2 bg-white/90 rounded-xl text-red-500 shadow-md"><X size={18} /></button>
                    </>
                ) : (
                    <button type="button" onClick={() => (document.getElementById('file-upload') as HTMLInputElement).click()} className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-blue-500 transition-colors">
                        <div className="p-4 bg-white rounded-full shadow-sm"><Camera size={32} /></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Upload Image</span>
                    </button>
                )}
                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result as string);
                        reader.readAsDataURL(file);
                    }
                }} />
            </div>

            <button
                onClick={handleSave}
                disabled={isSubmitting || !prodCode}
                className={`w-full font-bold py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2
          ${(errors.cat || errors.weight)
                        ? 'bg-red-600 hover:bg-red-700 shadow-red-100'
                        : !prodCode ? 'bg-slate-300 cursor-not-allowed' : metalConfig[selectedMetal].button
                    } 
          text-white disabled:opacity-70`}
            >
                {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Saving...</> : (errors.cat || errors.weight ? "Missing Fields" : !prodCode ? "Select Category" : "Update Inventory")}
            </button>
        </div>
    );
};