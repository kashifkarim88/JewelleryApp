import React from 'react';

interface PrintInvoiceProps {
    customer: { name: string; phone: string };
    goldRate: number;
    cart: any[]; // The full cart
    discount: number;
    // New props for single-item printing
    isSingle?: boolean;
    activeItem?: any;
}

export const PrintInvoice = ({
    customer,
    goldRate,
    cart,
    discount,
    isSingle = false,
    activeItem
}: PrintInvoiceProps) => {
    const GRAMS_IN_TOLA = 11.664;

    // Use either the single active item or the whole cart
    const displayItems = isSingle && activeItem ? [activeItem] : cart;

    const calculateItemPrice = (item: any, rate: number) => {
        const ratePerGram = rate / GRAMS_IN_TOLA;
        const totalWeight = item.netWeight + (item.netWeight * (item.wastagePercent / 100));
        return (totalWeight * ratePerGram) + (item.making || 0) + (item.stoneDetails?.price || 0);
    };

    const subTotal = displayItems.reduce((acc, item) => acc + calculateItemPrice(item, goldRate), 0);
    const totalAmount = subTotal - (isSingle ? 0 : discount);

    return (
        <div className="hidden print:block print:bg-white print:text-black">
            <style dangerouslySetInnerHTML={{
                __html: `@media print { @page { size: A4; margin: 8mm; } body { visibility: hidden; } }`
            }} />

            <div className="print:visible absolute top-0 left-0 w-[190mm] font-sans text-[10px]">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-[22px] font-bold">
                            {isSingle ? "Item Specification" : "Sale Invoice"}
                        </div>
                        <div className="text-[18px] tracking-[2px]">||||||||||||||||||||</div>
                        <div className="text-[9px] tracking-[4px] text-center font-bold">* 0 2 0 0 0 6 3 2 8 *</div>
                    </div>
                    <div className="text-[10px]">
                        <span className="font-bold">Date:</span>{" "}
                        {new Date().toLocaleDateString('en-GB', {
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </div>
                </div>

                {/* Bill To */}
                <div className="border border-black w-62.5 mt-2">
                    <div className="bg-[#bfbfbf] border-b border-black px-1.5 py-0.5 text-[10px] font-bold">Customer Details</div>
                    <div className="p-1.5 leading-tight">
                        <b className="text-[11px]">{customer.name || "Walk-in Customer"}</b><br />
                        Contact #: {customer.phone || "N/A"}<br />
                    </div>
                </div>

                {/* Main Table */}
                <table className="w-full border-collapse border border-black mt-2 text-[10px]">
                    <thead>
                        <tr className="bg-[#a6a6a6]">
                            <th className="border border-black p-1 text-center font-bold">S No</th>
                            <th className="border border-black p-1 text-center font-bold">Item Code</th>
                            <th className="border border-black p-1 text-left font-bold">Description</th>
                            <th className="border border-black p-1 text-center font-bold">Purity</th>
                            <th className="border border-black p-1 text-right font-bold">Weight (gm)</th>
                            <th className="border border-black p-1 text-right font-bold">Wastage (%)</th>
                            <th className="border border-black p-1 text-right font-bold">Wastage (gm)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayItems.map((item, idx) => {
                            const wastageGm = item.netWeight * (item.wastagePercent / 100);
                            const totalGoldGm = item.netWeight + wastageGm;
                            const ratePerGm = goldRate / GRAMS_IN_TOLA;

                            return (
                                <React.Fragment key={idx}>
                                    <tr>
                                        <td className="p-1 text-center align-top border-x border-black">{idx + 1}</td>
                                        <td className="p-1 text-center align-top border-x border-black">
                                            <div className="text-[14px] leading-none tracking-tight">||||||||||||</div>
                                            <div className="text-[8px]">{item.itemCode}</div>
                                        </td>
                                        <td className="p-1 align-top border-x border-black"><b>{item.categoryName}</b></td>
                                        <td className="p-1 text-center align-top border-x border-black">{item.carat}</td>
                                        <td className="p-1 text-right align-top border-x border-black">{item.netWeight.toFixed(3)}</td>
                                        <td className="p-1 text-right align-top border-x border-black">{item.wastagePercent}</td>
                                        <td className="p-1 text-right align-top border-x border-black">{wastageGm.toFixed(3)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="p-1 border-x border-black align-top">
                                            <div className="w-30 h-20 border border-black flex items-center justify-center overflow-hidden">
                                                {item.imageUrl ? <img src={item.imageUrl} alt="item" className="max-h-full" /> : <span className="text-gray-400">image</span>}
                                            </div>
                                        </td>
                                        <td colSpan={5} className="p-1 border-x border-black align-top">
                                            <table className="w-full border-collapse">
                                                <tbody>
                                                    <tr className="bg-[#f2f2f2]">
                                                        <td className="p-0.75">Gold (gm)</td>
                                                        <td className="p-0.75 text-right">{totalGoldGm.toFixed(3)}</td>
                                                        <td className="p-0.75 text-right">{ratePerGm.toFixed(1)}</td>
                                                        <td className="p-0.75">per gm</td>
                                                        <td className="p-0.75 text-right font-semibold">{(totalGoldGm * ratePerGm).toFixed(2)}</td>
                                                    </tr>
                                                    <tr className="bg-[#f2f2f2]">
                                                        <td className="p-0.75">Making & Stones</td>
                                                        <td className="p-0.75 text-right">--</td>
                                                        <td className="p-0.75 text-right">Rs</td>
                                                        <td className="p-0.75"></td>
                                                        <td className="p-0.75 text-right font-semibold">{(item.making + (item.stoneDetails?.price || 0)).toFixed(2)}</td>
                                                    </tr>
                                                    <tr className="border-t border-black">
                                                        <td colSpan={4} className="p-0.75 text-right font-bold">Item Total (Rs)</td>
                                                        <td className="p-0.75 text-right font-bold">{calculateItemPrice(item, goldRate).toFixed(2)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    {/* Divider logic matches your previous style */}
                                    {idx !== displayItems.length - 1 && (
                                        <tr><td colSpan={7} className="border-t-2 border-black my-1.5" /></tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>

                {/* Only show Summary and Policy if NOT printing a single item */}
                {!isSingle && (
                    <>
                        <div className="w-75 ml-auto mt-2 text-[10px]">
                            <div className="flex justify-between border-b border-black py-0.5">
                                <span>Sub Total (Rs)</span>
                                <span>{subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-black py-0.5">
                                <span>Discount (Rs)</span>
                                <span>{discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-black py-0.5 font-bold">
                                <span>Grand Total (Rs)</span>
                                <span>{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 text-[9px] italic leading-tight">
                            <p><b>Item(s) Exchange Policy:</b> Item(s) will be exchanged on net weight of gold.</p>
                            <p><b>Item(s) Return Policy:</b> Deductions apply based on purity.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};