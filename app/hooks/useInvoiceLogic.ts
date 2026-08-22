"use client";

import { useState, useTransition } from 'react';
import { useBilling, CartItem } from '../hooks/useBilling';
import { useGoldStore } from '../hooks/useGoldStore';

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
    key: '21K' | '24K' | '22K' | '20K' | '18K' | '14K' | 'palladium' | 'silver' | 'platinum';
    label: string;
}

export interface PrintConfig {
    items: CartItem[];
    isSingle: boolean;
}

export function useInvoiceLogic() {
    const billing = useBilling();
    const goldStore = useGoldStore();

    const [editId, setEditId] = useState<string | null>(null);
    const [printData, setPrintData] = useState<PrintConfig | null>(null);
    const [isPending, startTransition] = useTransition();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingItem, setPendingItem] = useState<StockItem | null>(null);
    const [tempRate, setTempRate] = useState('');
    const [rateTarget, setRateTarget] = useState<RateTarget | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [localFetching, setLocalFetching] = useState(false);

    const showLoader = billing.isFetching || localFetching || isPending;

    const checkAndInterceptRate = (data: StockItem): RateTarget | null => {
        const metal = data.metal?.trim().toLowerCase() || 'gold';
        const carat = data.carat?.trim().toLowerCase() || '';

        switch (metal) {
            case 'palladium':
                if (!goldStore.ratePalladium) return { key: 'palladium', label: 'Palladium' };
                break;
            case 'silver':
                if (!goldStore.rateSilver) return { key: 'silver', label: 'Silver' };
                break;
            case 'platinum':
                if (!goldStore.ratePlatinum) return { key: 'platinum', label: 'Platinum' };
                break;
            default:
                if (metal === 'gold' || metal.includes('gold')) {
                    if (carat.includes('24') && !goldStore.rate24ct) return { key: '24K', label: '24K Gold' };
                    if (carat.includes('22') && !goldStore.rate22ct) return { key: '22K', label: '22K Gold' };
                    if (carat.includes('21') && !goldStore.rate21ct) return { key: '21K', label: '21K Gold' };
                    if (carat.includes('20') && !goldStore.rate20ct) return { key: '20K', label: '20K Gold' };
                    if (carat.includes('18') && !goldStore.rate18ct) return { key: '18K', label: '18K Gold' };
                    if (carat.includes('14') && !goldStore.rate14ct) return { key: '14K', label: '14K Gold' };
                }
                break;
        }
        return null;
    };

    const insertItemToCart = (itemData: StockItem) => {
        if (billing.cart.some((i) => i.itemCode === itemData.itemCode)) {
            setErrorMessage(`Item code "${itemData.itemCode}" is already in your cart.`);
            billing.setItemInput('');
            return;
        }

        const formattedItem: CartItem = {
            ...itemData,
            id: itemData.id || `${itemData.itemCode}-${Date.now()}`,
            metal: itemData.metal || 'Gold',
            // Replaces any 'ct' / 'CT' with 'K' or falls back to '21K'
            carat: itemData.carat ? itemData.carat.replace(/ct/gi, 'K').trim() : '21K',
            categoryName: itemData.categoryName || 'Unknown Category',
            netWeight: Number(itemData.netWeight) || 0,
            wastagePercent: Number(itemData.wastagePercent) || 0,
            making: Number(itemData.making) || 0,
            discount: 0,
            advance: 0,
            stoneDetails: itemData.stoneDetails || [],
            diamondDetails: itemData.diamondDetails || [],
        };

        startTransition(() => {
            billing.setCart([formattedItem, ...billing.cart]);
        });
        billing.setItemInput('');
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = billing.itemInput.trim().toUpperCase();
        if (!query) return;

        setLocalFetching(true);
        setErrorMessage(null);

        try {
            const res = await fetch(`/api/stocks?itemCode=${encodeURIComponent(query)}`);

            if (res.status === 404) {
                setErrorMessage(`Stock item matching code "${query}" could not be found.`);
                return;
            }
            if (!res.ok) {
                throw Error(`Server returned unexpected error state status: ${res.status}`);
            }

            const data: StockItem = await res.json();

            if (!data || Object.keys(data).length === 0) {
                setErrorMessage(`Received invalid or corrupted stock object metadata records for "${query}".`);
                return;
            }

            const target = checkAndInterceptRate(data);
            if (target) {
                setPendingItem(data);
                setRateTarget(target);
                setTempRate('');
                setIsModalOpen(true);
                return;
            }

            insertItemToCart(data);
        } catch (err) {
            console.error('[STOCK_FETCH_EXCEPTION]:', err);
            setErrorMessage('Network error: Failed to fetch item. Please check your connection or contact IT support.');
        } finally {
            setLocalFetching(false);
        }
    };

    const confirmDynamicRate = () => {
        if (!tempRate || !rateTarget?.key) return;

        const dynamicRateValue = tempRate.trim();

        switch (rateTarget.key) {
            case '21K': goldStore.setRate21ct(dynamicRateValue); break;
            case '24K': goldStore.setRate24ct(dynamicRateValue); break;
            case '22K': goldStore.setRate22ct(dynamicRateValue); break;
            case '20K': goldStore.setRate20ct(dynamicRateValue); break;
            case '18K': goldStore.setRate18ct(dynamicRateValue); break;
            case '14K': goldStore.setRate14ct(dynamicRateValue); break;
            case 'palladium': goldStore.setRatePalladium(dynamicRateValue); break;
            case 'silver': goldStore.setRateSilver(dynamicRateValue); break;
            case 'platinum': goldStore.setRatePlatinum(dynamicRateValue); break;
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

    const handlePrint = (items: CartItem[], isSingle: boolean) => {
        setPrintData({ items, isSingle });
        setTimeout(() => {
            window.print();
            if (!isSingle && items.length > 0) {
                setTimeout(() => {
                    if (window.confirm('Invoice generated successfully. Would you like to clear the current bill session parameters?')) {
                        billing.clearSession();
                        setErrorMessage(null);
                    }
                }, 500);
            }
        }, 200);
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to drop all active item allocations?')) {
            billing.clearSession();
            setErrorMessage(null);
        }
    };

    return {
        billing,
        editId,
        setEditId,
        printData,
        showLoader,
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