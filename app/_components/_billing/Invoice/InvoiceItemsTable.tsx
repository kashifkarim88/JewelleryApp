import React from "react";
import { Image as ImageIcon } from "lucide-react";
import type { ProcessedCartItem } from "../../../utils/types";
import { getDetailsArray } from "../../../utils/invoiceUtils";

interface InvoiceItemsTableProps {
    pageItems: ProcessedCartItem[];
    pageIdx: number;
    formatCurrency: (value: number) => string;
}

export const InvoiceItemsTable = ({
    pageItems,
    pageIdx,
    formatCurrency,
}: InvoiceItemsTableProps) => (
    <div className="w-full border border-zinc-800 rounded-sm overflow-hidden bg-transparent">

        <table className="w-full text-left border-collapse table-fixed min-w-0">

            <thead>

                <tr className="bg-zinc-400 text-zinc-900 font-bold border-b border-zinc-800 text-[9px]">

                    <th className="py-0.5 px-1 w-[7%] text-center">
                        S No.
                    </th>

                    <th className="py-0.5 px-1.5 w-[18%]">
                        Item Code
                    </th>

                    <th className="py-0.5 px-1.5 w-[35%]">
                        Description
                    </th>

                    <th className="py-0.5 px-1 w-[10%] text-center">
                        Purity
                    </th>

                    <th className="py-0.5 px-1 w-[10%] text-center">
                        Weight (gm)
                    </th>

                    <th className="py-0.5 px-1 w-[10%] text-center">
                        Wastage (gm)
                    </th>

                    <th className="py-0.5 px-1 w-[10%] text-center">
                        Total Weight
                    </th>

                </tr>

            </thead>

            <tbody>

                {pageItems.map((item, index) => {

                    const structuralSerialIndex =
                        pageIdx * 2 + index + 1;

                    return (
                        <React.Fragment key={item.id || index}>

                            {/* Main Item Row */}
                            <tr className="bg-zinc-100 opacity-70 border-b border-zinc-100 font-medium text-zinc-900 align-top text-[9px]">

                                <td className="py-0.5 px-1 text-center font-bold">
                                    {String(
                                        structuralSerialIndex
                                    ).padStart(2, "0")}
                                </td>

                                <td className="py-0.5 px-1.5 font-mono tracking-wider">
                                    {item.itemCode || "N/A"}
                                </td>

                                <td className="py-0.5 px-1.5 font-semibold">
                                    {item.metal
                                        ? `${item.metal} - ${item.categoryName ||
                                        "Jewellery Piece"
                                        }`
                                        : item.categoryName ||
                                        "Jewellery Piece"}
                                </td>

                                <td className="py-0.5 px-1 text-center font-bold">
                                    {item.metal === "Palladium"
                                        ? item.purity
                                            ? `${item.purity}%`
                                            : "—"
                                        : item.carat ||
                                        item.metal ||
                                        "—"}
                                </td>

                                <td className="py-0.5 px-1 text-center font-semibold">
                                    {item.netW?.toFixed(3) ??
                                        "0.000"}
                                </td>

                                <td className="py-0.5 px-1 text-right font-semibold">
                                    {item.wasteW?.toFixed(3) ??
                                        "0.000"}
                                </td>

                                <td className="py-0.5 px-1 text-right font-semibold">
                                    {item.grossMetalWeight?.toFixed(
                                        3
                                    ) ?? "0.000"}
                                </td>

                            </tr>

                            {/* Detail Breakdown Row */}
                            <tr className="border-b border-zinc-800 text-[8.5px] min-w-0">

                                <td
                                    colSpan={2}
                                    className="py-1 px-1.5 align-middle"
                                >

                                    <div className="w-16 h-11 border border-zinc-300 rounded-sm overflow-hidden p-0.5 mx-auto flex items-center justify-center bg-white">

                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                className="w-full h-full object-cover"
                                                alt="Invoice Item Thumbnail"
                                            />
                                        ) : (
                                            <div className="w-full h-full border border-dashed border-zinc-300 bg-zinc-50/50 flex flex-col items-center justify-center gap-0.5 text-zinc-400">

                                                <ImageIcon
                                                    size={12}
                                                    strokeWidth={1.5}
                                                />

                                                <span className="text-[6.5px] font-medium tracking-tight">
                                                    No Image
                                                </span>

                                            </div>
                                        )}

                                    </div>

                                </td>

                                <td
                                    colSpan={6}
                                    className="p-0 align-top min-w-0 overflow-hidden"
                                >
                                    <div className="w-full min-w-0 flex flex-col font-medium py-0.5 text-zinc-900 overflow-hidden">

                                        {/* GOLD / METAL ROW */}
                                        <div className="w-full border-b border-zinc-300 bg-zinc-100 min-w-0">

                                            <div className="grid grid-cols-[minmax(70px,1fr)_auto] items-center gap-2 px-1.5 py-0.5 min-w-0">
                                                <div className="font-bold text-zinc-950 whitespace-nowrap">
                                                    Sub Total
                                                </div>

                                                <div className="text-right font-mono font-semibold whitespace-nowrap shrink-0">
                                                    {formatCurrency(
                                                        (item.absoluteMetalPrice || 0) -
                                                        (Number(item.making) || 0)
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-[minmax(70px,1fr)_auto] items-center gap-2 px-1.5 py-0.5 min-w-0 border-t border-zinc-200">
                                                <div className="font-bold text-zinc-950 whitespace-nowrap">
                                                    Making
                                                </div>

                                                <div className="text-right font-mono font-semibold whitespace-nowrap shrink-0">
                                                    {formatCurrency(Number(item.making) || 0)}
                                                </div>
                                            </div>

                                        </div>

                                        {/* STONES */}
                                        {
                                            item.stoneDetails && item.stoneDetails.length > 0 && (
                                                <div className="grid grid-cols-[64px_minmax(0,1fr)] w-full border-b border-zinc-300 bg-zinc-100 min-w-0">

                                                    <div className="px-1.5 py-0.5 font-bold text-zinc-950 whitespace-nowrap">
                                                        Stones
                                                    </div>

                                                    <div className="px-1.5 py-0.5 text-zinc-700 min-w-0 font-medium overflow-hidden">

                                                        <div className="flex flex-col">

                                                            {getDetailsArray(item.stoneDetails).map((stone, index) => (

                                                                <div
                                                                    key={index}
                                                                    className="flex justify-between items-center"
                                                                >

                                                                    <span>
                                                                        {stone.name || "Unknown Stone"} -{" "}
                                                                        {stone.weight ?? 0} ct
                                                                    </span>

                                                                    <span className="font-mono font-semibold whitespace-nowrap shrink-0">
                                                                        Rs{" "}
                                                                        {formatCurrency(
                                                                            Number(stone.price) || 0
                                                                        )}
                                                                    </span>

                                                                </div>

                                                            ))}

                                                        </div>

                                                    </div>

                                                </div>)
                                        }

                                        {/* DIAMONDS */}
                                        {
                                            item.diamondDetails && item.diamondDetails.length > 0 && (
                                                <div className="grid grid-cols-[64px_minmax(0,1fr)] w-full border-b border-zinc-300 bg-zinc-100 min-w-0">

                                                    <div className="px-1.5 py-0.5 font-bold text-zinc-950 whitespace-nowrap">
                                                        Diamonds
                                                    </div>

                                                    <div className="px-1.5 py-0.5 text-zinc-700 min-w-0 font-medium overflow-hidden">

                                                        <div className="flex flex-col">

                                                            {getDetailsArray(item.diamondDetails).map(
                                                                (diamond, index) => (

                                                                    <div
                                                                        key={index}
                                                                        className="flex justify-between items-center"
                                                                    >

                                                                        <span>
                                                                            {diamond.name || "Diamond"} -{" "}
                                                                            {diamond.weight ?? 0} ct
                                                                        </span>

                                                                        <span className="font-mono font-semibold whitespace-nowrap shrink-0">
                                                                            Rs{" "}
                                                                            {formatCurrency(
                                                                                Number(diamond.price) || 0
                                                                            )}
                                                                        </span>

                                                                    </div>

                                                                )
                                                            )}

                                                        </div>

                                                    </div>

                                                </div>)
                                        }

                                        {/* BEADS */}
                                        {
                                            item.beadDetails &&
                                            (
                                                Array.isArray(item.beadDetails)
                                                    ? item.beadDetails.length > 0
                                                    : true
                                            ) && (
                                                <div className="grid grid-cols-[64px_minmax(0,1fr)] w-full border-b border-zinc-300 bg-zinc-100 min-w-0">

                                                    <div className="px-1.5 py-0.5 font-bold text-zinc-950 whitespace-nowrap">
                                                        Beads
                                                    </div>

                                                    <div className="px-1.5 py-0.5 text-zinc-700 min-w-0 font-medium overflow-hidden">

                                                        <div className="flex flex-col">

                                                            {getDetailsArray(item.beadDetails).map((bead, index) => (

                                                                <div
                                                                    key={index}
                                                                    className="flex justify-between items-center"
                                                                >

                                                                    <span>
                                                                        {bead.name || "Bead"} -{" "}
                                                                        {bead.weight ?? 0} ct
                                                                    </span>

                                                                    <span className="font-mono font-semibold whitespace-nowrap shrink-0">
                                                                        Rs{" "}
                                                                        {formatCurrency(
                                                                            Number(bead.price) || 0
                                                                        )}
                                                                    </span>

                                                                </div>

                                                            ))}

                                                        </div>

                                                    </div>

                                                </div>)
                                        }

                                        {/* COMBINED STONES TOTAL */}
                                        {/* <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 font-bold w-full bg-zinc-100 text-zinc-950 py-0.5 px-1.5 border-t border-zinc-300 min-w-0">

                                                                        <div className="uppercase tracking-tight text-[8px] min-w-0">
                                                                            Stones Total (Rs)
                                                                        </div>

                                                                        <div className="text-right text-[10px] font-extrabold font-mono whitespace-nowrap shrink-0">
                                                                            {formatCurrency(item.stonePrice)}
                                                                        </div>

                                                                    </div> */}

                                        {/* ITEM SUBTOTAL */}
                                        <div className="flex justify-between w-full bg-zinc-400 text-zinc-950 py-0.5 px-1.5 min-w-0">

                                            <div className="text-right uppercase tracking-tight text-[8px] min-w-0 py-1 font-bold">
                                                Item Total (Rs)
                                            </div>

                                            <div className="text-right text-[10px] font-extrabold font-mono whitespace-nowrap shrink-0 py-1">
                                                {formatCurrency(
                                                    Number(
                                                        item.peritemTotal ??
                                                        item.itemTotal
                                                    ) || 0
                                                )}
                                            </div>

                                        </div>

                                    </div>
                                </td>

                            </tr>

                        </React.Fragment>
                    );

                })}

            </tbody>

        </table>

    </div>
);
