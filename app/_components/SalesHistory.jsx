import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Download, Calendar, Gem } from 'lucide-react';

const initialSalesData = [
    {
        id: "INV-2026-001",
        customer: "Ahmad Khan",
        date: "2026-07-15",
        total: "Rs. 245,000",
        status: "Paid",
        items: [
            { code: "R-092", name: "Gold Engagement Ring", weight: "6.2g", purity: "21K", price: "Rs. 135,000" },
            { code: "E-114", name: "Gold Stud Earrings", weight: "4.8g", purity: "21K", price: "Rs. 110,000" }
        ]
    },
    {
        id: "INV-2026-002",
        customer: "Zainab Bibi",
        date: "2026-07-14",
        total: "Rs. 450,000",
        status: "Paid",
        items: [
            { code: "N-401", name: "Bridal Diamond Necklace", weight: "12.5g", purity: "18K", price: "Rs. 450,000" }
        ]
    },
    {
        id: "INV-2026-003",
        customer: "Muhammad Ali",
        date: "2026-07-12",
        total: "Rs. 320,000",
        status: "Partial",
        items: [
            { code: "B-204", name: "Gold Kada Bangle", weight: "11.2g", purity: "22K", price: "Rs. 260,000" },
            { code: "R-011", name: "Simple Band Ring", weight: "2.5g", purity: "22K", price: "Rs. 60,000" }
        ]
    }
];

export default function SalesHistory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const filteredSales = initialSalesData.filter((sale) =>
        sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen text-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sales History</h1>
                    <p className="text-sm text-slate-500 mt-1">View past orders and expand records to view itemized receipts.</p>
                </div>

                <div className="relative w-full sm:w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Search size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search Sales ID or customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-6 w-12"></th>
                                <th className="py-4 px-6">Sales ID</th>
                                <th className="py-4 px-6">Customer</th>
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6 text-center">Total Items</th>
                                <th className="py-4 px-6">Total Amount</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredSales.length > 0 ? (
                                filteredSales.map((sale) => (
                                    <React.Fragment key={sale.id}>
                                        <tr
                                            onClick={() => toggleRow(sale.id)}
                                            className="hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
                                        >
                                            <td className="py-4 px-6 text-slate-400">
                                                {expandedRows[sale.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-slate-900">{sale.id}</td>
                                            <td className="py-4 px-6 text-slate-600">{sale.customer}</td>
                                            <td className="py-4 px-6 text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {sale.date}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center text-slate-600 font-medium">
                                                {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-slate-900">{sale.total}</td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sale.status === 'Paid'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    }`}>
                                                    {sale.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    title="Download PDF"
                                                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all"
                                                >
                                                    <Download size={16} />
                                                </button>
                                            </td>
                                        </tr>

                                        {expandedRows[sale.id] && (
                                            <tr className="bg-slate-50/50">
                                                <td colSpan="8" className="px-8 py-4 border-t border-b border-slate-100">
                                                    <div className="bg-white rounded-lg border border-slate-100 p-4 shadow-inner">
                                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                                            <Gem size={12} /> Itemized Invoice Breakdown
                                                        </h3>
                                                        <table className="w-full text-left text-xs text-slate-600">
                                                            <thead>
                                                                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                                                                    <th className="pb-2">Code</th>
                                                                    <th className="pb-2">Item Name</th>
                                                                    <th className="pb-2">Purity</th>
                                                                    <th className="pb-2">Weight</th>
                                                                    <th className="pb-2 text-right">Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-50">
                                                                {sale.items.map((item, index) => (
                                                                    <tr key={index} className="text-slate-700">
                                                                        <td className="py-2.5 font-mono text-slate-400">{item.code}</td>
                                                                        <td className="py-2.5 font-medium text-slate-900">{item.name}</td>
                                                                        <td className="py-2.5">{item.purity}</td>
                                                                        <td className="py-2.5">{item.weight}</td>
                                                                        <td className="py-2.5 text-right font-semibold text-slate-800">{item.price}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-slate-400 bg-slate-50/30">
                                        No sales record found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}