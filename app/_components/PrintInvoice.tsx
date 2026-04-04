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
                    @page { size: A4; margin: 8mm; }

                    body {
                        visibility: hidden;
                        background: white;
                        -webkit-print-color-adjust: exact;
                    }

                    .print-wrapper {
                        visibility: visible;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 190mm;
                        font-family: Arial, sans-serif;
                        font-size: 10px;
                        color: black;
                    }

                    .title {
                        font-size: 22px;
                        font-weight: bold;
                    }

                    .barcode-line {
                        font-size: 18px;
                        letter-spacing: 2px;
                    }

                    .barcode-number {
                        font-size: 9px;
                        letter-spacing: 4px;
                        text-align: center;
                        font-weight: bold;
                    }

                    .box {
                        border: 1px solid black;
                        width: 250px;
                        margin-top: 6px;
                    }

                    .box-head {
                        background: #bfbfbf;
                        border-bottom: 1px solid black;
                        padding: 2px 6px;
                        font-size: 10px;
                        font-weight: bold;
                    }

                    .box-body {
                        padding: 6px;
                    }

                    .memo {
                        margin-top: 8px;
                        border-bottom: 1px solid black;
                        padding-bottom: 2px;
                    }

                    .main-table {
                        width: 100%;
                        border-collapse: collapse;
                        border: 1px solid black;
                        margin-top: 6px;
                    }

                    .main-table th {
                        background: #a6a6a6;
                        padding: 4px;
                        text-align: center;
                        font-weight: bold;
                    }

                    .main-table td {
                        padding: 4px;
                        vertical-align: top;
                    }
                    
                    .detail-highlight {
                        background-color: #f2f2f2;
                    }

                    .text-right { text-align: right; }
                    .text-center { text-align: center; }

                    .detail-table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    .detail-table td {
                        padding: 3px;
                    }

                    .top-line {
                        border-top: 1px solid black;
                    }

                    .img-box {
                        width: 120px;
                        height: 80px;
                        border: 1px solid black;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .divider {
                        border-top: 2px solid black;
                        margin: 6px 0;
                    }

                    .summary {
                        width: 300px;
                        margin-left: auto;
                        margin-top: 10px;
                    }

                    .summary-row {
                        display: flex;
                        justify-content: space-between;
                        border-bottom: 1px solid black;
                        padding: 3px 0;
                    }

                    .footer {
                        margin-top: 30px;
                        font-size: 9px;
                        font-style: italic;
                    }
                }
            `}} />

            <div className="print-wrapper">

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <div className="title">Sale Invoice</div>
                        <div className="barcode-line">||||||||||||||||||||</div>
                        <div className="barcode-number">* 0 2 0 0 0 6 3 2 8 *</div>
                    </div>

                    <div style={{ fontSize: "10px" }}>
                        <b>Date:</b>{" "}
                        {new Date().toLocaleDateString('en-GB', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </div>
                </div>

                {/* Bill To */}
                <div className="box">
                    <div className="box-head">Bill To</div>
                    <div className="box-body">
                        <b>{customer.name || "Mr. Wasim Abbas"}</b><br />
                        Contact #: {customer.phone || "0331-4581823"}<br />
                        <span style={{ color: "#555" }}>Peshawar, Pakistan</span>
                    </div>
                </div>

                {/* Memo */}
                <div className="memo">
                    <b>Memo</b>
                    <span style={{ marginLeft: 10 }}>
                        {cart[0]?.carat || "21K"} - {cart.map(i => i.categoryName).join(', ')}
                    </span>
                </div>

                {/* Table */}
                <table className="main-table">
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Item Code</th>
                            <th style={{ textAlign: "left" }}>Description</th>
                            <th>Purity</th>
                            <th>Weight (gm)</th>
                            <th>Westage (%)</th>
                            <th>Westage (gm)</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cart.map((item, idx) => {
                            const wastageGm = item.netWeight * (item.wastagePercent / 100);
                            const totalGoldGm = item.netWeight + wastageGm;
                            const ratePerGm = goldRate / GRAMS_IN_TOLA;

                            return (
                                <React.Fragment key={idx}>

                                    {/* Main Row */}
                                    <tr>
                                        <td className="text-center">{idx + 1}</td>
                                        <td className="text-center">
                                            <div className="barcode-line">||||||||||||</div>
                                            <div style={{ fontSize: 8 }}>{item.itemCode || "SS-1"}</div>
                                        </td>
                                        <td><b>{item.categoryName}</b></td>
                                        <td className="text-center">{item.carat}</td>
                                        <td className="text-right">{item.netWeight.toFixed(3)}</td>
                                        <td className="text-right">{item.wastagePercent}</td>
                                        <td className="text-right">{wastageGm.toFixed(3)}</td>
                                    </tr>

                                    {/* Detail Row */}
                                    <tr>
                                        <td colSpan={2}>
                                            <div className="img-box">
                                                {item.imageUrl
                                                    ? <img src={item.imageUrl} style={{ maxHeight: "100%" }} />
                                                    : "Image"}
                                            </div>
                                        </td>

                                        <td colSpan={5}>
                                            <table className="detail-table">
                                                <tr className="detail-highlight">
                                                    <td>Gold (gm)</td>
                                                    <td className="text-right">{totalGoldGm.toFixed(3)}</td>
                                                    <td className="text-right">{ratePerGm.toFixed(1)}</td>
                                                    <td>per gm with making</td>
                                                    <td className="text-right">
                                                        {(totalGoldGm * ratePerGm).toFixed(2)}
                                                    </td>
                                                </tr>

                                                <tr className='detail-highlight'>
                                                    <td>Stones weight & price</td>
                                                    <td className="text-right">{item.stoneDetails?.weight || 0}</td>
                                                    <td>Rs</td>
                                                    <td></td>
                                                    <td className="text-right">
                                                        {item.stoneDetails?.price || 0}
                                                    </td>
                                                </tr>

                                                <tr className="top-line">
                                                    <td colSpan={4} style={{ textAlign: "right" }}>
                                                        <b>Item Sub Total (Rs)</b>
                                                    </td>
                                                    <td className="text-right">
                                                        <b>{calculateItemPrice(item, goldRate).toFixed(2)}</b>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    {/* ✅ Divider Between Products */}
                                    {idx !== cart.length - 1 && (
                                        <tr>
                                            <td colSpan={7} style={{ padding: 0 }}>
                                                <div className="divider" />
                                            </td>
                                        </tr>
                                    )}

                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>

                {/* Summary */}
                <div className="summary">
                    <div className="summary-row">
                        <span>Total Amount (Rs)</span>
                        <b>{totalAmount.toFixed(2)}</b>
                    </div>
                    <div className="summary-row">
                        <span>Received Price of Gold (Rs)</span>
                        <b>6590000</b>
                    </div>
                    <div className="summary-row">
                        <span>Total Cash Received (Rs)</span>
                        <b>720000</b>
                    </div>
                    <div className="summary-row">
                        <span>Net Balance (Rs)</span>
                        <b>0.00</b>
                    </div>
                </div>

                {/* Footer */}
                <div className="footer">
                    <p><b>Item(s) Exchange Policy:</b> Item(s) will be exchanged on net weight of gold.</p>
                    <p><b>Item(s) Return Policy:</b> 10, 15 & 25% will be deducted on net weight of 22K, 21K & 18K gold respectively.</p>
                </div>

            </div>
        </div>
    );
};