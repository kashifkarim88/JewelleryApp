import type { ClientProfile, ProcessedCartItem } from "../../../utils/types";
import { Code128Barcode } from "./Code128Barcode";

interface InvoicePageHeaderProps {
    customer: ClientProfile;
    pageItems: ProcessedCartItem[];
    billSerialNumber: string;
    formattedDate: string;
    getItemRate: (item: ProcessedCartItem) => number;
    formatCurrency: (value: number) => string;
}

export const InvoicePageHeader = ({
    customer,
    pageItems,
    billSerialNumber,
    formattedDate,
    getItemRate,
    formatCurrency,
}: InvoicePageHeaderProps) => (
    <>
        <div className="flex justify-between items-start w-full">

            <div className="flex flex-col items-start">

                <div className="flex flex-col items-start">
                    <Code128Barcode value={billSerialNumber} />
                    <span className="mt-0.5 text-[8px] font-mono font-semibold tracking-[0.08em] text-zinc-900">
                        {billSerialNumber || "N/A"}
                    </span>
                </div>

                <h1 className="mt-1 text-xl font-extrabold tracking-tight text-zinc-900">
                    Sale Invoice
                </h1>

            </div>

            <div className="text-right pt-0.5">
                <p className="text-[10px] font-medium">
                    <span className="font-bold text-zinc-900">
                        Printed On:
                    </span>{" "}
                    {formattedDate}
                </p>
            </div>

        </div>

        {/* --- DETAILS OVERVIEW CONTROLLERS --- */}
        <div className="w-full flex items-stretch justify-between gap-2.5">

            <div className="w-[62mm] border border-zinc-800 rounded-sm overflow-hidden bg-white shadow-sm flex flex-col">

                <div className="bg-zinc-200/80 px-1.5 py-0.5 border-b border-zinc-800">
                    <p className="font-extrabold text-zinc-900 text-[8px] uppercase tracking-wider">
                        Bill To
                    </p>
                </div>

                <div className="p-1 space-y-0.5 text-zinc-900 font-medium flex-1 justify-center flex flex-col">

                    <p className="font-black text-[10px] tracking-tight text-zinc-950 leading-tight">
                        {customer?.name || "Walk-in Customer"}
                    </p>

                    <p className="text-[8.5px]">
                        Contact #: {customer?.phone || "N/A"}
                    </p>

                    <p className="text-[8.5px]">
                        Seller:{" "}
                        <span className="font-semibold">
                            {customer?.seller || "N/A"}
                        </span>
                    </p>
                    <p className="text-[8.5px]">
                        Bill No:{" "}
                        <span className="font-semibold">
                            {billSerialNumber || "N/A"}
                        </span>
                    </p>

                    <p className="text-[8.5px] text-zinc-500">
                        Pakistan
                    </p>

                </div>

            </div>

            <div className="w-[85mm] border border-zinc-800 rounded-sm overflow-hidden bg-white shadow-sm flex flex-col">

                <div className="bg-zinc-200/80 px-1.5 py-0.5 border-b border-zinc-800 flex justify-between items-center">

                    <p className="font-extrabold text-zinc-900 text-[8px] uppercase tracking-wider">
                        Live Invoice Metal Rates Lookup
                    </p>

                    <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>

                </div>

                <div className="p-1 flex-1 flex flex-col justify-center space-y-0.5">

                    {pageItems
                        .filter(
                            (item, index, self) =>
                                index ===
                                self.findIndex(
                                    (t) =>
                                        `${(t.metal || '').toLowerCase()}-${(t.carat || '').toLowerCase()}` ===
                                        `${(item.metal || '').toLowerCase()}-${(item.carat || '').toLowerCase()}`
                                )
                        )
                        .map((item, idx) => {
                            const computedRate = getItemRate(item);
                            return (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between border-b border-zinc-100 pb-0.5 last:border-0 last:pb-0 w-full"
                                >
                                    <div className="flex items-baseline space-x-1 w-[30mm]">
                                        <span className="font-bold text-zinc-900 text-[8.5px] tracking-tight">
                                            {item.metal?.toLowerCase() === 'gold' || !item.metal
                                                ? item.carat || "Gold"
                                                : item.metal}
                                        </span>
                                        <span className="text-[7.5px] font-medium text-zinc-400 lowercase tracking-tight">
                                            ({item.metal || "Gold"})
                                        </span>
                                    </div>

                                    <div className="flex-1 text-right">
                                        <span className="text-[8.5px] font-bold text-zinc-700 font-mono tracking-tight">
                                            {computedRate > 0
                                                ? `Rs ${formatCurrency(computedRate)}`
                                                : "—"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                </div>

            </div>

        </div>

        {/* --- MEMO --- */}
        <div className="w-full border-b border-zinc-800 pb-0.5 flex items-baseline">

            <span className="font-bold text-zinc-900 text-[9px] uppercase tracking-wider mr-1.5">
                Memo
            </span>

            <div className="flex-1 text-[9px] font-semibold text-zinc-800 pl-2 italic tracking-wide truncate">
                {pageItems
                    .map(
                        (item) =>
                            `${item.carat ||
                            item.metal ||
                            "21K"} - ${item.categoryName ||
                            "Jewellery Item"
                            }`
                    )
                    .join(", ")}
            </div>

        </div>
    </>
);
