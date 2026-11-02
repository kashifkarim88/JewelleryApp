import type { PageFinancialSummary } from "../../../utils/types";
import { formatCurrency } from "../../../utils/invoiceUtils";

interface InvoicePageSummaryProps {
    summary?: PageFinancialSummary;
}

export const InvoicePageSummary = ({ summary }: InvoicePageSummaryProps) => {
    if (!summary) return null;

    return (
        <div className="w-full flex justify-end page-break-inside-avoid pt-0.5">
            <div className="w-[70mm] flex flex-col font-bold text-zinc-900 text-right text-[9.5px]">

                <div className="flex justify-between py-0.5 border-b border-zinc-300">
                    <span className="text-zinc-700 font-medium">
                        Total Amount (Rs)
                    </span>

                    <span className="text-[10px] font-black font-mono whitespace-nowrap">
                        {formatCurrency(summary.pageTotalAmount)}
                    </span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-zinc-300">
                    <span className="text-zinc-700 font-medium">
                        Total Discount (Rs)
                    </span>

                    <span className="text-[10px] font-bold font-mono whitespace-nowrap">
                        {formatCurrency(summary.pageDiscount)}
                    </span>
                </div>

                <div className="flex justify-between py-0.5 border-b border-zinc-300">
                    <span className="text-zinc-700 font-medium">
                        Advance Paid (Rs)
                    </span>

                    <span className="text-[10px] font-bold font-mono whitespace-nowrap">
                        {formatCurrency(summary.pageAdvance)}
                    </span>
                </div>



                <div className="flex justify-between py-0.5 border-b-[2px] border-double border-zinc-900 mt-0.5">
                    <span className="text-zinc-950 font-extrabold text-[10px] uppercase tracking-tight">
                        Net Balance (Rs)
                    </span>

                    <span className="text-[12px] font-black font-mono tracking-tight whitespace-nowrap">
                        {formatCurrency(summary.pageNetBalance)}
                    </span>
                </div>

            </div>
        </div>
    );
};
