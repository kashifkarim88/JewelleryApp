"use client"
import React, { useState } from 'react';
import {
    Search, User, Phone, Trash2, Printer, Loader2,
    ImageIcon, Tag, Gem, CircleDot, Sparkles
} from 'lucide-react';
import { PrintInvoice } from './PrintInvoice';

// 1. Defined Interfaces for strict Type Safety
interface DetailSection {
    id?: string;
    name?: string;
    weight?: number;
    price?: number;
    color?: string;
    clarity?: string;
    cut?: string;
    rate?: number;
}

interface CartItem {
    id: string;
    itemCode: string;
    categoryName: string;
    carat: string;
    metal: string;
    netWeight: number;
    wastagePercent: number;
    making: number;
    imageUrl?: string;
    diamondDetails?: DetailSection;
    stoneDetails?: DetailSection;
    beadDetails?: DetailSection;
}

export default function BillingPage() {
    const [customer, setCustomer] = useState({ name: '', phone: '' });
    const [goldRate, setGoldRate] = useState<number>(245000);
    const [discount, setDiscount] = useState<number>(0);
    const [itemInput, setItemInput] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);

    const handlePrint = () => {
        if (cart.length === 0) return alert("Cart is empty");
        window.print();
    };

    const handleItemFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemInput) return;
        setIsFetching(true);
        try {
            const res = await fetch(`/api/stocks?itemCode=${itemInput}`);
            const data = await res.json();
            if (res.ok && data) {
                if (!cart.some(item => item.itemCode === data.itemCode)) {
                    setCart(prev => [data, ...prev]);
                }
                setItemInput("");
            } else { alert("Item not found"); }
        } finally { setIsFetching(false); }
    };

    const updateItemDetail = (index: number, section: keyof CartItem | string, field: string, value: string | number) => {
        const newCart = [...cart];
        if (section === 'root') {
            (newCart[index] as any)[field] = value;
        } else {
            const targetSection = (newCart[index] as any)[section];
            if (targetSection) {
                (newCart[index] as any)[section] = { ...targetSection, [field]: value };
            }
        }
        setCart(newCart);
    };

    const calculateItemPrice = (item: CartItem) => {
        const ratePerGram = (goldRate || 0) / 11.664;
        const metalValue = (Number(item.netWeight) || 0) * ratePerGram;
        return metalValue +
            (Number(item.making) || 0) +
            (Number(item.stoneDetails?.price) || 0) +
            (Number(item.beadDetails?.price) || 0) +
            (Number(item.diamondDetails?.price) || 0);
    };

    const subTotal = cart.reduce((a, b) => a + calculateItemPrice(b), 0);
    const finalTotal = subTotal - discount;

    return (
        <>
            <PrintInvoice
                customer={customer}
                goldRate={goldRate}
                cart={cart}
                discount={discount}
            />

            <div className="print:hidden min-h-screen bg-[#FBFBFC] p-4 md:p-8 text-slate-900 antialiased font-sans">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Page Heading */}
                    <div className="mb-2">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Billing</h1>
                        <div className="h-1 w-12 bg-blue-600 rounded-full mt-1"></div>
                    </div>

                    {/* Top Control Section */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
                        <div className="flex flex-col lg:flex-row gap-6 items-end">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <InputGroup label="Customer Name" icon={User} value={customer.name} onChange={(v: string) => setCustomer({ ...customer, name: v })} placeholder="Enter Name" />
                                <InputGroup label="Phone Number" icon={Phone} value={customer.phone} onChange={(v: string) => setCustomer({ ...customer, phone: v })} placeholder="Enter Phone" />
                            </div>
                            <div className="w-full lg:w-48 bg-amber-50 rounded-2xl p-3 border border-amber-100/50">
                                <label className="text-[8px] font-black text-amber-600 uppercase tracking-widest block mb-0.5">Current Gold Rate</label>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-amber-500 font-bold text-xs">Rs.</span>
                                    <input type="number" className="bg-transparent text-md font-black text-amber-950 outline-none w-full" value={goldRate} onChange={(e) => setGoldRate(Number(e.target.value))} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                            <form onSubmit={handleItemFetch} className="relative w-full max-w-xs">
                                <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Search Products</label>
                                <div className="relative">
                                    <input type="text" placeholder="Scan Stock Code..." className="w-full py-2 pl-9 pr-20 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" value={itemInput} onChange={(e) => setItemInput(e.target.value.toUpperCase())} />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 px-3 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase hover:bg-blue-600 transition-all">
                                        {isFetching ? <Loader2 className="animate-spin" size={10} /> : "Fetch"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {cart.map((item, i) => (
                            <div key={item.id || i} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                                <div className="p-6 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800 leading-none mb-1 uppercase">{item.categoryName}</h3>
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{item.itemCode} • {item.metal} {item.carat}</p>
                                        </div>
                                        <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="p-2 text-slate-200 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                                    </div>

                                    {/* READ ONLY ROW */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        <ReadOnlyStat label="Net Weight" value={item.netWeight} unit="g" />
                                        <ReadOnlyStat label="Wastage %" value={item.wastagePercent} unit="%" />
                                        <ReadOnlyStat label="Labour (Rs)" value={item.making?.toLocaleString()} />
                                        <ReadOnlyStat label="Purity" value={item.carat} />
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                                        {item.diamondDetails && (
                                            <DetailCard icon={Sparkles} title="Diamond Details" color="cyan">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="col-span-full mb-1">
                                                        <label className="text-[7px] font-black text-slate-400 uppercase">Name</label>
                                                        <input className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-bold outline-none" value={item.diamondDetails.name} onChange={(e) => updateItemDetail(i, 'diamondDetails', 'name', e.target.value)} />
                                                    </div>
                                                    <EditableStat label="Weight (ct)" value={item.diamondDetails.weight} mini onChange={(v: number) => updateItemDetail(i, 'diamondDetails', 'weight', v)} />
                                                    <EditableStat label="Color" value={item.diamondDetails.color} isText mini onChange={(v: string) => updateItemDetail(i, 'diamondDetails', 'color', v)} />
                                                    <EditableStat label="Clarity" value={item.diamondDetails.clarity} isText mini onChange={(v: string) => updateItemDetail(i, 'diamondDetails', 'clarity', v)} />
                                                    <EditableStat label="Cut" value={item.diamondDetails.cut} isText mini onChange={(v: string) => updateItemDetail(i, 'diamondDetails', 'cut', v)} />
                                                    <EditableStat label="Rate" value={item.diamondDetails.rate} mini onChange={(v: number) => updateItemDetail(i, 'diamondDetails', 'rate', v)} />
                                                    <EditableStat label="Price (Rs)" value={item.diamondDetails.price} mini onChange={(v: number) => updateItemDetail(i, 'diamondDetails', 'price', v)} />
                                                </div>
                                            </DetailCard>
                                        )}

                                        {item.stoneDetails && (
                                            <DetailCard icon={Gem} title="Stone Details" color="blue">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="col-span-full mb-1">
                                                        <label className="text-[7px] font-black text-slate-400 uppercase">Name</label>
                                                        <input className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-bold outline-none" value={item.stoneDetails.name} onChange={(e) => updateItemDetail(i, 'stoneDetails', 'name', e.target.value)} />
                                                    </div>
                                                    <EditableStat label="Weight (ct)" value={item.stoneDetails.weight} mini onChange={(v: number) => updateItemDetail(i, 'stoneDetails', 'weight', v)} />
                                                    <EditableStat label="Price (Rs)" value={item.stoneDetails.price} mini onChange={(v: number) => updateItemDetail(i, 'stoneDetails', 'price', v)} />
                                                </div>
                                            </DetailCard>
                                        )}

                                        {item.beadDetails && (
                                            <DetailCard icon={CircleDot} title="Bead Details" color="purple">
                                                <div className="grid grid-cols-2 gap-2 mt-1">
                                                    <EditableStat label="Weight (g)" value={item.beadDetails.weight} unit="g" mini onChange={(v: number) => updateItemDetail(i, 'beadDetails', 'weight', v)} />
                                                    <EditableStat label="Price (Rs)" value={item.beadDetails.price} mini onChange={(v: number) => updateItemDetail(i, 'beadDetails', 'price', v)} />
                                                </div>
                                            </DetailCard>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Summary */}
                    <div className="bg-slate-950 rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="flex gap-8">
                            <div>
                                <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest">Gross Amount</p>
                                <p className="text-xl font-bold">Rs. {subTotal.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest">Discount</p>
                                <input type="number" className="bg-white/10 rounded-lg px-3 py-1 text-lg font-bold outline-none w-28 focus:ring-1 focus:ring-blue-500" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Total Payable</p>
                                <p className="text-3xl font-black">Rs. {finalTotal.toLocaleString()}</p>
                            </div>
                            <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-500 h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 transition-all">
                                PRINT INVOICE <Printer size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Sub-components with explicit Types for Vercel Build
function ReadOnlyStat({ label, value, unit = "" }: { label: string, value: string | number, unit?: string }) {
    return (
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-[11px] font-bold text-slate-700">
                {value || 0} {unit}
            </p>
        </div>
    );
}

function EditableStat({ label, value, unit = "", onChange, mini = false, isText = false }: { label: string, value: any, unit?: string, onChange: (v: any) => void, mini?: boolean, isText?: boolean }) {
    return (
        <div className={`${mini ? 'p-2' : 'p-2.5'} bg-white border border-slate-200 rounded-xl shadow-sm`}>
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <div className="flex items-center gap-1">
                <input
                    type={isText ? "text" : "number"}
                    className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none"
                    value={value || ''}
                    onChange={(e) => onChange(isText ? e.target.value : Number(e.target.value))}
                />
                {unit && <span className="text-[9px] font-bold text-slate-300">{unit}</span>}
            </div>
        </div>
    );
}

function DetailCard({ children, icon: Icon, title, color }: { children: React.ReactNode, icon: any, title: string, color: 'blue' | 'cyan' | 'purple' }) {
    const colors = {
        blue: 'bg-blue-50/40 border-blue-100 text-blue-600',
        cyan: 'bg-cyan-50/40 border-cyan-100 text-cyan-600',
        purple: 'bg-purple-50/40 border-purple-100 text-purple-600'
    };
    return (
        <div className={`p-4 rounded-[1.5rem] border ${colors[color]}`}>
            <div className="flex items-center gap-2 mb-3">
                <Icon size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{title}</span>
            </div>
            {children}
        </div>
    );
}

function InputGroup({ label, icon: Icon, value, onChange, placeholder }: { label: string, icon: any, value: string, onChange: (v: string) => void, placeholder: string }) {
    return (
        <div className="space-y-1 w-full">
            <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                <input type="text" className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 transition-all placeholder:text-slate-300" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
            </div>
        </div>
    );
}