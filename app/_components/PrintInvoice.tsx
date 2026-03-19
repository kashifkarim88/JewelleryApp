import React from 'react';

interface PrintInvoiceProps {
    customer: { name: string; phone: string };
    goldRate: number;
    cart: any[];
    discount: number;
}

export const PrintInvoice = ({ customer, goldRate, cart, discount }: PrintInvoiceProps) => {
    const calculateItemPrice = (item: any, rate: number) => {
        const ratePerGram = rate / 11.664;
        return (item.netWeight * ratePerGram) + (item.making || 0) +
            (item.stoneDetails?.price || 0) + (item.beadDetails?.price || 0);
    };

    const subTotal = cart.reduce((acc, item) => acc + calculateItemPrice(item, goldRate), 0);

    return (
        <div className="hidden print:block">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { size: A4; margin: 10mm; }
                    body { visibility: hidden; background: white; -webkit-print-color-adjust: exact; }
                    .print-wrapper {
                        visibility: visible;
                        position: absolute;
                        left: 0; top: 0;
                        width: 190mm;
                        color: black !important;
                        font-family: Arial, sans-serif;
                    }
                    .main-table { width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid black !important; }
                    .main-table th, .main-table td { 
                        border: 1px solid black !important; 
                        padding: 4px 6px; 
                        text-align: center; 
                        font-size: 11px; 
                        line-height: 1.2;
                    }
                    .box-container { border: 1px solid black; margin-bottom: 15px; }
                    .box-header { 
                        background-color: #d1d5db !important; 
                        border-bottom: 1px solid black; 
                        padding: 2px 8px; 
                        font-size: 11px; 
                        font-weight: bold; 
                    }
                }
            `}} />

            <div className="print-wrapper">
                {/* Sale Invoice Header [cite: 15, 16] */}
                <div className="mb-4">
                    <h1 className="text-3xl font-bold uppercase tracking-tight">Sale Invoice [cite: 15]</h1>
                    <div className="flex flex-col mt-1">
                        <span className="text-3xl tracking-[0.2em] font-mono leading-none">* 0 2 0 0 0 6 3 2 8 * [cite: 16]</span>
                        <span className="text-[10px] ml-14 mt-1">0 2 0 0 0 6 3 2 8 [cite: 16]</span>
                    </div>
                </div>

                {/* Bill To Section [cite: 17, 18, 19, 20] */}
                <div className="w-[300px] box-container">
                    <div className="box-header">Bill To [cite: 17]</div>
                    <div className="p-2 font-bold text-sm">
                        <p>{customer.name || "Walk-in Customer"} [cite: 18]</p>
                        <p className="font-normal text-xs">Contact #: {customer.phone || ""} [cite: 19]</p>
                        <p className="font-normal text-xs mt-2">Peshawar 25000 [cite: 20]</p>
                        <p className="font-normal text-xs">Pakistan [cite: 20]</p>
                    </div>
                </div>

                {/* Memo [cite: 21, 22] */}
                <div className="mb-4">
                    <div className="text-[11px] font-bold uppercase underline">Memo [cite: 21]</div>
                    <div className="text-sm font-bold mt-1">
                        {cart[0]?.carat} - {cart.map(i => i.categoryName).join(', ')} [cite: 22]
                    </div>
                </div>

                {/* Main Table Structure  */}
                <table className="main-table">
                    <thead>
                        <tr className="bg-gray-200 uppercase font-bold">
                            <th className="w-[5%]">S No.</th>
                            <th className="w-[12%]">Item Code</th>
                            <th className="w-[12%]">Weight (gm)</th>
                            <th className="w-[10%]">Westage (%)</th>
                            <th className="w-[10%]">Purity</th>
                            <th className="w-[36%] text-left">Description</th>
                            <th className="w-[15%]">Westage (gm)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, idx) => (
                            <React.Fragment key={idx}>
                                <tr>
                                    <td>{String(idx + 1).padStart(2, '0')} </td>
                                    <td>{item.itemCode || ""} </td>
                                    <td>{Number(item.netWeight).toFixed(3)} </td>
                                    <td>{item.wastagePercent} </td>
                                    <td>{item.carat} </td>
                                    <td className="text-left font-bold uppercase">{item.categoryName} {item.carat} </td>
                                    <td>{(item.netWeight * (item.wastagePercent / 100)).toFixed(3)} </td>
                                </tr>
                                {/* Additional Info Row as seen in template */}
                                <tr className="italic">
                                    <td colSpan={2} className="border-r-0"></td>
                                    <td colSpan={3} className="text-left border-l-0 text-[10px]">Gold (gm): {(item.netWeight + (item.netWeight * (item.wastagePercent / 100))).toFixed(3)}</td>
                                    <td className="text-left text-[10px]">Stones weight & price: {item.stoneDetails?.weight || "0"}ct.</td>
                                    <td className="text-right text-[10px]">Rs. {item.stoneDetails?.price?.toLocaleString() || "0.00"} </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {/* Bottom Summary Block  */}
                <div className="flex justify-end mt-4">
                    <div className="w-[300px] border border-black">
                        <div className="flex justify-between px-2 py-1 border-b border-black text-[11px] font-bold">
                            <span>Item Sub Total (Rs) </span>
                            <span>{subTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between px-2 py-1 border-b border-black text-[11px] font-bold">
                            <span>Total Amount (Rs) </span>
                            <span>{(subTotal - discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between px-2 py-1 border-b border-black text-[11px] font-bold">
                            <span>Total Cash Received (Rs) </span>
                            <span>{(subTotal - discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between px-2 py-1 text-[11px] font-black bg-gray-200">
                            <span>Net Balance (Rs) </span>
                            <span>0.00 </span>
                        </div>
                    </div>
                </div>

                {/* Date & Policy Footer [cite: 24, 25, 26, 27] */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-[11px] font-bold">Date: {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} [cite: 24]</div>
                        <div className="border border-black px-2 py-1 text-[11px] font-bold uppercase italic">COPY [cite: 25]</div>
                    </div>
                    <div className="text-[9px] space-y-1 border-t border-black pt-2">
                        <p><strong>Item(s) Exchange Policy:</strong> Item(s) will be exchanged on net weight of gold. [cite: 26]</p>
                        <p><strong>Item(s) Return Policy:</strong> 10, 15 & 25% will be deducted on net weight of 22K, 21K & 18K gold respectively. [cite: 27]</p>
                    </div>
                </div>
            </div>
        </div>
    );
};