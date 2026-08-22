"use client";

import React from 'react';
import { RefreshCcw, Package } from 'lucide-react';
import { CartItem } from '../../../hooks/useBilling';
import { CartItemCard } from '../CartItemCard';

interface CartListProps {
    cart: CartItem[];
    editId: string | null;
    setEditId: (id: string | null) => void;
    updateItemDetail: any;
    removeItem: any;
    updateNestedDetail: any;
    calculateItemPrice: (item: CartItem) => number;
    calculateAddons: (item: CartItem) => number;
    onClearAll: () => void;
    onPrintSingle: (item: CartItem) => void;
}

export function CartList({
    cart,
    editId,
    setEditId,
    updateItemDetail,
    removeItem,
    updateNestedDetail,
    calculateItemPrice,
    calculateAddons,
    onClearAll,
    onPrintSingle,
}: CartListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Items In Cart ({cart.length})
                </h2>
                {cart.length > 0 && (
                    <button
                        onClick={onClearAll}
                        className="text-[9px] font-black uppercase text-red-400 hover:text-red-500 flex items-center gap-1.5 transition-colors"
                    >
                        <RefreshCcw size={10} /> Clear All
                    </button>
                )}
            </div>

            {cart.length === 0 ? (
                <div className="h-72 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white/50">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Package size={24} className="text-slate-300" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Cart is empty
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {cart.map((item, i) => (
                        <CartItemCard
                            key={item.id}
                            item={item}
                            index={i}
                            isOpen={editId === item.id}
                            onToggle={() => setEditId(editId === item.id ? null : item.id)}
                            onUpdate={updateItemDetail}
                            onRemove={removeItem}
                            onPrint={() => onPrintSingle(item)}
                            itemTotal={calculateItemPrice(item)}
                            stonesTotal={calculateAddons(item)}
                            onNestedUpdate={updateNestedDetail}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}