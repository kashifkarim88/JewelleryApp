"use client";

import { useState, useTransition, useRef } from "react";
import { useBilling, CartItem } from "../hooks/useBilling";
import { useGoldStore } from "../hooks/useGoldStore";

export interface StockItem {
    id: string;
    itemCode: string;
    metal?: string;
    carat?: string;
    stoneDetails?: any[];
    diamondDetails?: any[];
    categoryName?: string;
    netWeight?: string | number;
    wastagePercent?: string | number;
    making?: string | number;
    [key: string]: any;
}

export interface RateTarget {
    key:
    | "21K"
    | "24K"
    | "22K"
    | "20K"
    | "18K"
    | "14K"
    | "palladium"
    | "silver"
    | "platinum";
    label: string;
}

export interface PrintConfig {
    items: CartItem[];
    isSingle: boolean;
    billSerialNumber: string;
}

export function useInvoiceLogic() {
    const billing = useBilling();
    const goldStore = useGoldStore();

    const [editId, setEditId] = useState<string | null>(null);
    const [printData, setPrintData] = useState<PrintConfig | null>(null);
    const [isPending, startTransition] = useTransition();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingItem, setPendingItem] = useState<StockItem | null>(null);
    const [tempRate, setTempRate] = useState("");
    const [rateTarget, setRateTarget] = useState<RateTarget | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [localFetching, setLocalFetching] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    /*
     * Prevent multiple Print clicks from creating
     * multiple API requests / print dialogs.
     *
     * This is a ref instead of state because refs update
     * immediately and don't wait for a React render.
     */
    const printLockRef = useRef(false);

    /*
     * Once a print operation succeeds, keep its operation ID.
     *
     * This gives us an additional layer of protection
     * against accidentally submitting the same operation twice.
     */
    const printOperationIdRef = useRef<string | null>(null);

    const showLoader =
        billing.isFetching ||
        localFetching ||
        isPending;

    const checkAndInterceptRate = (
        data: StockItem
    ): RateTarget | null => {
        const metal =
            data.metal?.trim().toLowerCase() || "gold";

        const carat =
            data.carat?.trim().toLowerCase() || "";

        switch (metal) {
            case "palladium":
                if (!goldStore.ratePalladium) {
                    return {
                        key: "palladium",
                        label: "Palladium",
                    };
                }
                break;

            case "silver":
                if (!goldStore.rateSilver) {
                    return {
                        key: "silver",
                        label: "Silver",
                    };
                }
                break;

            case "platinum":
                if (!goldStore.ratePlatinum) {
                    return {
                        key: "platinum",
                        label: "Platinum",
                    };
                }
                break;

            default:
                if (
                    metal === "gold" ||
                    metal.includes("gold")
                ) {
                    if (
                        carat.includes("24") &&
                        !goldStore.rate24ct
                    ) {
                        return {
                            key: "24K",
                            label: "24K Gold",
                        };
                    }

                    if (
                        carat.includes("22") &&
                        !goldStore.rate22ct
                    ) {
                        return {
                            key: "22K",
                            label: "22K Gold",
                        };
                    }

                    if (
                        carat.includes("21") &&
                        !goldStore.rate21ct
                    ) {
                        return {
                            key: "21K",
                            label: "21K Gold",
                        };
                    }

                    if (
                        carat.includes("20") &&
                        !goldStore.rate20ct
                    ) {
                        return {
                            key: "20K",
                            label: "20K Gold",
                        };
                    }

                    if (
                        carat.includes("18") &&
                        !goldStore.rate18ct
                    ) {
                        return {
                            key: "18K",
                            label: "18K Gold",
                        };
                    }

                    if (
                        carat.includes("14") &&
                        !goldStore.rate14ct
                    ) {
                        return {
                            key: "14K",
                            label: "14K Gold",
                        };
                    }
                }

                break;
        }

        return null;
    };

    const insertItemToCart = (itemData: StockItem) => {
        if (
            billing.cart.some(
                (i) => i.itemCode === itemData.itemCode
            )
        ) {
            setErrorMessage(
                `Item code "${itemData.itemCode}" is already in your cart.`
            );

            billing.setItemInput("");

            return;
        }

        const formattedItem: CartItem = {
            ...itemData,

            id:
                itemData.id ||
                `${itemData.itemCode}-${Date.now()}`,

            metal: itemData.metal || "Gold",

            carat: itemData.carat
                ? itemData.carat
                    .replace(/ct/gi, "K")
                    .trim()
                : "21K",

            categoryName:
                itemData.categoryName ||
                "Unknown Category",

            netWeight:
                Number(itemData.netWeight) || 0,

            wastagePercent:
                Number(itemData.wastagePercent) || 0,

            making:
                Number(itemData.making) || 0,

            discount: 0,
            advance: 0,

            stoneDetails:
                itemData.stoneDetails || [],

            diamondDetails:
                itemData.diamondDetails || [],
        };

        startTransition(() => {
            billing.setCart([
                formattedItem,
                ...billing.cart,
            ]);
        });

        billing.setItemInput("");
    };

    const handleAddProduct = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const query =
            billing.itemInput.trim().toUpperCase();

        if (!query) return;

        setLocalFetching(true);
        setErrorMessage(null);

        try {
            const res = await fetch(
                `/api/stocks?itemCode=${encodeURIComponent(
                    query
                )}`
            );

            if (res.status === 404) {
                setErrorMessage(
                    `Stock item matching code "${query}" could not be found.`
                );

                return;
            }

            if (!res.ok) {
                throw Error(
                    `Server returned unexpected error state status: ${res.status}`
                );
            }

            const data: StockItem = await res.json();

            if (
                !data ||
                Object.keys(data).length === 0
            ) {
                setErrorMessage(
                    `Received invalid or corrupted stock object metadata records for "${query}".`
                );

                return;
            }

            const target =
                checkAndInterceptRate(data);

            if (target) {
                setPendingItem(data);
                setRateTarget(target);
                setTempRate("");
                setIsModalOpen(true);

                return;
            }

            insertItemToCart(data);
        } catch (err) {
            console.error(
                "[STOCK_FETCH_EXCEPTION]:",
                err
            );

            setErrorMessage(
                "Network error: Failed to fetch item. Please check your connection or contact IT support."
            );
        } finally {
            setLocalFetching(false);
        }
    };

    const confirmDynamicRate = () => {
        if (
            !tempRate ||
            !rateTarget?.key
        ) {
            return;
        }

        const dynamicRateValue =
            tempRate.trim();

        switch (rateTarget.key) {
            case "21K":
                goldStore.setRate21ct(
                    dynamicRateValue
                );
                break;

            case "24K":
                goldStore.setRate24ct(
                    dynamicRateValue
                );
                break;

            case "22K":
                goldStore.setRate22ct(
                    dynamicRateValue
                );
                break;

            case "20K":
                goldStore.setRate20ct(
                    dynamicRateValue
                );
                break;

            case "18K":
                goldStore.setRate18ct(
                    dynamicRateValue
                );
                break;

            case "14K":
                goldStore.setRate14ct(
                    dynamicRateValue
                );
                break;

            case "palladium":
                goldStore.setRatePalladium(
                    dynamicRateValue
                );
                break;

            case "silver":
                goldStore.setRateSilver(
                    dynamicRateValue
                );
                break;

            case "platinum":
                goldStore.setRatePlatinum(
                    dynamicRateValue
                );
                break;
        }

        if (pendingItem) {
            insertItemToCart(pendingItem);
        }

        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPendingItem(null);
        setRateTarget(null);
    };

    /*
     * Generate a stable ID for THIS print operation.
     *
     * crypto.randomUUID() is available in modern browsers.
     */
    const createPrintOperationId = () => {
        return crypto.randomUUID();
    };

    /*
     * Generate a bill serial number.
     *
     * This is currently generated on the client because
     * your Bill model requires billSerialNumber.
     *
     * Later, if you already have an existing bill-number
     * system, we can connect this to that system instead.
     */
    const createBillSerialNumber = () => {
        const timestamp = Date.now();

        const randomPart = Math.floor(
            Math.random() * 1000
        )
            .toString()
            .padStart(3, "0");

        return `BILL-${timestamp}-${randomPart}`;
    };

    /*
     * Save billing information to the database,
     * then print.
     */
    const handlePrint = async (
        items: CartItem[],
        isSingle: boolean
    ) => {
        /*
         * Ignore every additional click while the current
         * print operation is being processed.
         */
        if (printLockRef.current) {
            console.log(
                "[PRINT] Duplicate print click ignored."
            );

            return;
        }

        if (!items || items.length === 0) {
            setErrorMessage(
                "There are no items to print."
            );

            return;
        }

        /*
         * Customer validation.
         */
        if (
            !billing.customer.name.trim() ||
            !billing.customer.phone.trim()
        ) {
            setErrorMessage(
                "Please enter customer name and phone number before printing."
            );

            return;
        }

        /*
         * Lock immediately.
         */
        printLockRef.current = true;
        setIsPrinting(true);

        setErrorMessage(null);

        /*
         * Create one operation ID for this print.
         */
        const printOperationId =
            printOperationIdRef.current ||
            createPrintOperationId();

        printOperationIdRef.current =
            printOperationId;

        /*
         * Each actual print operation gets its own bill
         * serial number.
         */
        const billSerialNumber =
            createBillSerialNumber();

        try {
            /*
             * ------------------------------------------
             * Prepare items exactly using the existing
             * billing calculations.
             * ------------------------------------------
             */

            const preparedItems = items.map(
                (item) => {
                    const itemTotal =
                        billing.calculateItemPrice(
                            item
                        );

                    const stonesTotal =
                        billing.calculateAddons(
                            item
                        );

                    return {
                        ...item,

                        itemTotal,

                        stonesTotal,
                    };
                }
            );

            /*
             * ------------------------------------------
             * SINGLE ITEM PRINT
             * ------------------------------------------
             *
             * The single item becomes its own bill.
             */
            let billFinalTotal: number;

            let billDiscount: number;
            let billExtraDiscount: number;
            let billExchangeValue: number;
            let billAdvance: number;

            if (isSingle) {
                const singleItem =
                    preparedItems[0];

                /*
                 * Single-item bill uses only this
                 * item's discount and advance.
                 *
                 * Invoice-level discount/exchange/
                 * advance are NOT copied from the
                 * complete cart.
                 */
                billDiscount =
                    Number(
                        singleItem.discount || 0
                    );

                billExtraDiscount = 0;

                billExchangeValue = 0;

                billAdvance =
                    Number(
                        singleItem.advance || 0
                    );

                billFinalTotal =
                    Number(
                        singleItem.itemTotal || 0
                    );
            } else {
                /*
                 * --------------------------------------
                 * COMPLETE INVOICE
                 * --------------------------------------
                 */

                billDiscount =
                    Number(
                        billing.itemDiscountsSum
                    ) || 0;

                billExtraDiscount =
                    Number(
                        billing.extraDiscount
                    ) || 0;

                billExchangeValue =
                    Number(
                        billing.exchangeValue
                    ) || 0;

                billAdvance =
                    Number(
                        billing.totalAdvance
                    ) || 0;

                billFinalTotal =
                    Number(
                        billing.finalTotal
                    ) || 0;
            }

            /*
             * ------------------------------------------
             * Send billing snapshot to API
             * ------------------------------------------
             */
            const response = await fetch(
                "/api/billing",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        printOperationId,

                        billSerialNumber,

                        customer: {
                            name:
                                billing.customer.name.trim(),

                            phone:
                                billing.customer.phone.trim(),
                        },

                        sellerName:
                            billing.customer.seller?.trim() ||
                            null,

                        discount:
                            billDiscount,

                        extraDiscount:
                            billExtraDiscount,

                        exchangeValue:
                            billExchangeValue,

                        advancePaid:
                            billAdvance,

                        finalTotal:
                            billFinalTotal,

                        items:
                            preparedItems,
                    }),
                }
            );

            const result =
                await response.json();

            /*
             * API/database failed.
             *
             * DO NOT PRINT.
             */
            if (!response.ok || !result.success) {
                throw new Error(
                    result.error ||
                    "Failed to save billing information."
                );
            }

            /*
             * ------------------------------------------
             * Database successfully saved.
             * ------------------------------------------
             */

            console.log(
                "[PRINT] Bill saved successfully:",
                result.billSerialNumber
            );

            /*
             * Now show the print preview data.
             *
             * This happens ONLY after successful
             * database saving.
             */
            const savedBillSerialNumber =
                result.billSerialNumber ||
                result.bill_serial_number ||
                billSerialNumber;

            setPrintData({
                items,
                isSingle,
                billSerialNumber: savedBillSerialNumber,
            });

            /*
             * Give React time to render PrintInvoice
             * with the new printData.
             */
            setTimeout(() => {
                /*
                 * Final safety check.
                 */
                if (!printLockRef.current) {
                    return;
                }

                window.print();
                setIsPrinting(false);

                /*
                 * The print operation is now complete.
                 * Unlock immediately so another item can
                 * be printed without reloading the page.
                 *
                 * This is especially important for single-item
                 * printing: item 1 can be printed, deleted,
                 * and then item 2 or items 2+3 can be printed.
                 */
                printLockRef.current = false;
                printOperationIdRef.current = null;

                /*
                 * Only complete invoices ask whether
                 * the user wants to clear the current
                 * billing session.
                 */
                if (
                    !isSingle &&
                    items.length > 0
                ) {
                    setTimeout(() => {
                        if (
                            window.confirm(
                                "Invoice generated successfully. Would you like to clear the current bill session parameters?"
                            )
                        ) {
                            billing.clearSession();
                            setErrorMessage(null);
                        }
                    }, 500);
                }
            }, 200);
        } catch (error: any) {
            console.error(
                "[PRINT_ERROR]:",
                error
            );

            /*
             * IMPORTANT:
             *
             * If database saving fails, we unlock the
             * button so the user can try again.
             *
             * We do NOT call window.print().
             */
            printLockRef.current = false;
            setIsPrinting(false);

            printOperationIdRef.current =
                null;

            setErrorMessage(
                error?.message ||
                "Failed to save invoice. The invoice was NOT printed."
            );
        }
    };

    const handleClearAll = () => {
        if (
            window.confirm(
                "Are you sure you want to drop all active item allocations?"
            )
        ) {
            billing.clearSession();

            setErrorMessage(null);

            /*
             * A cleared invoice is a new billing session,
             * so allow a new print operation.
             */
            printOperationIdRef.current =
                null;

            printLockRef.current = false;
            setIsPrinting(false);

            setPrintData(null);
        }
    };

    return {
        billing,

        editId,
        setEditId,

        printData,

        showLoader,
        isPrinting,

        errorMessage,
        setErrorMessage,

        isModalOpen,

        tempRate,
        setTempRate,

        pendingItem,

        rateTarget,

        handleAddProduct,

        confirmDynamicRate,

        closeModal,

        handlePrint,

        handleClearAll,
    };
} 