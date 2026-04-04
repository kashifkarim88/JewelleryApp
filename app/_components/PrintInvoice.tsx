import React from 'react';

interface PrintInvoiceProps {
    customer: { name: string; phone: string };
    goldRate: number;
    cart: any[];
    discount: number;
}

export const PrintInvoice = ({ customer, goldRate, cart, discount }: PrintInvoiceProps) => {
    const GRAMS_IN_TOLA = 11.664;

    const calculateItemPrice = (item: any, rate: number) => {
        const ratePerGram = rate / GRAMS_IN_TOLA;
        const totalWeight = item.netWeight + (item.netWeight * (item.wastagePercent / 100));
        return (totalWeight * ratePerGram) + (item.making || 0) + (item.stoneDetails?.price || 0);
    };

    const subTotal = cart.reduce((acc, item) => acc + calculateItemPrice(item, goldRate), 0);
    const totalAmount = subTotal - discount;

    return (
        <div className="hidden print:block">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { size: A4; margin: 10mm; }
                    body { visibility: hidden; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print-wrapper {
                        visibility: visible;
                        position: absolute;
                        left: 0; top: 0;
                        width: 190mm;
                        color: black !important;
                        font-family: Arial, sans-serif;
                    }
                    
                    /* Outer Border Only Table */
                    .main-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        border: 1.5px solid black !important; 
                    }
                    
                    /* Remove all internal cell borders */
                    .main-table th, .main-table td { 
                        border: none !important; 
                        padding: 6px 8px; 
                        font-size: 11px; 
                    }

                    .main-table th { 
                        background-color: #B6B6B6 !important; 
                        color: white !important; 
                        text-transform: uppercase;
                        text-align: center;
                    }

                    /* Sub-Detail Styling (Internal rows for gold/stones) */
                    .detail-table { width: 100%; border-collapse: collapse; }
                    .detail-table td { border: none !important; padding: 4px 4px; }
                    .border-t-black { border-top: 1px solid black !important; }
                    
                    .box-container { border: 1.5px solid black; width: 280px; margin-bottom: 15px; }
                    .box-header { background-color: #cbd5e1 !important; border-bottom: 1.5px solid black; padding: 2px 8px; font-size: 11px; font-weight: bold; }
                }
            `}} />

            <div className="print-wrapper">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Sale Invoice</h1>
                        <div className="mt-1">
                            <div className="text-2xl tracking-tighter">|| ||| || ||| || ||</div>
                            <p className="text-[10px] tracking-[0.3em] font-bold">* 0 2 0 0 0 6 3 2 8 *</p>
                        </div>
                    </div>
                    <div className="text-right text-sm font-bold">
                        Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>

                {/* Bill To */}
                <div className="box-container">
                    <div className="box-header uppercase">Bill To</div>
                    <div className="p-2 font-bold text-sm">
                        <p>{customer.name || "Mr. Wasim Abbas"}</p>
                        <p className="font-normal text-xs">Contact #: {customer.phone || "0331-4581823"}</p>
                        <p className="font-normal text-xs mt-1 text-slate-600">Peshawar, Pakistan</p>
                    </div>
                </div>

                {/* Memo */}
                <div className="mb-4 text-sm font-bold border-b border-black pb-1">
                    Memo <span className="font-normal italic ml-4">{cart[0]?.carat || "21K"} - {cart.map(i => i.categoryName).join(', ')}</span>
                </div>

                {/* Main Table with Outer Border Only */}
                <table className="main-table">
                    <thead>
                        <tr className="font-bold text-[10px]">
                            <th className="w-[5%]">S No</th>
                            <th className="w-[20%]">Item Code</th>
                            <th className="w-[30%] text-left">Description</th>
                            <th className="w-[10%]">Purity</th>
                            <th className="w-[12%] text-right">Weight (gm)</th>
                            <th className="w-[10%] text-right">Westage (%)</th>
                            <th className="w-[13%] text-right">Westage (gm)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, idx) => {
                            const wastageGm = item.netWeight * (item.wastagePercent / 100);
                            const totalGoldGm = item.netWeight + wastageGm;
                            const ratePerGm = goldRate / GRAMS_IN_TOLA;

                            return (
                                <React.Fragment key={idx}>
                                    <tr>
                                        <td className="text-center">{String(idx + 1).padStart(2, '0')}</td>
                                        <td className="text-center py-2">
                                            <div className="text-lg leading-none mb-1 text-slate-400">||||||||||||||||||||</div>
                                            <span className="text-[9px] uppercase font-bold">{item.itemCode || "SS-1"}</span>
                                        </td>
                                        <td className="text-left font-bold uppercase">{item.categoryName}</td>
                                        <td className="text-center">{item.carat}</td>
                                        <td className="text-right">{Number(item.netWeight).toFixed(3)}</td>
                                        <td className="text-right">{item.wastagePercent}</td>
                                        <td className="text-right">{wastageGm.toFixed(3)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="p-2 align-middle">
                                            <div className="w-full aspect-video bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center">
                                                {item.imageUrl ? <img src={item.imageUrl} className="max-h-full" alt="Product" /> : <span className="text-[7px] text-slate-400 font-bold uppercase text-center px-2">Image Area</span>}
                                            </div>
                                        </td>
                                        <td colSpan={5} className="p-0">
                                            <table className="detail-table font-bold">
                                                <tr>
                                                    <td className="w-[30%]">Gold (gm)</td>
                                                    <td className="text-right w-[15%]">{totalGoldGm.toFixed(3)}</td>
                                                    <td className="text-right w-[15%]">{ratePerGm.toFixed(1)}</td>
                                                    <td className="text-left italic font-normal">per gm with making</td>
                                                    <td className="text-right">{(totalGoldGm * ratePerGm).toLocaleString(undefined, { minimumFractionDigits: 3 })}</td>
                                                </tr>
                                                <tr>
                                                    <td>Stones weight & price</td>
                                                    <td className="text-right">{item.stoneDetails?.weight || 0}ct.</td>
                                                    <td className="text-right">Rs</td>
                                                    <td></td>
                                                    <td className="text-right">{Number(item.stoneDetails?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                </tr>
                                                <tr className="border-t-black bg-slate-50">
                                                    <td colSpan={4} className="text-right uppercase py-2">Item Sub Total (Rs)</td>
                                                    <td className="text-right font-black">{(calculateItemPrice(item, goldRate)).toLocaleString(undefined, { minimumFractionDigits: 3 })}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>

                {/* Summary Totals */}
                <div className="flex justify-end mt-6">
                    <div className="w-[320px]">
                        {[
                            { label: "Total Amount (Rs)", val: totalAmount },
                            { label: "Received Price of Gold (Rs)", val: 6590000 },
                            { label: "Total Cash Received (Rs)", val: 720000 },
                            { label: "Net Balance (Rs)", val: 0 }
                        ].map((row, i) => (
                            <div key={i} className="flex justify-between items-center py-1.5 border-b border-black">
                                <span className="text-[11px] font-bold uppercase">{row.label}</span>
                                <span className={`text-[13px] font-black ${row.label === "Net Balance (Rs)" ? "border-b-4 border-double border-black" : ""}`}>
                                    {row.val.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Policy Footer */}
                <div className="mt-12 text-[9px] italic space-y-1 opacity-80">
                    <p><strong>Item(s) Exchange Policy:</strong> Item(s) will be exchanged on net weight of gold.</p>
                    <p><strong>Item(s) Return Policy:</strong> 10, 15 & 25% will be deducted on net weight of 22K, 21K & 18K gold respectively.</p>
                </div>
            </div>
        </div>
    );
};