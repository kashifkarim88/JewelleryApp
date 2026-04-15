import { useState, useEffect, useMemo } from 'react';

export interface DetailSection {
    id?: string; name?: string; weight?: number; price?: number;
    color?: string; clarity?: string; cut?: string; rate?: number;
}

export interface CartItem {
    id: string; itemCode: string; productCode?: string; categoryName: string;
    carat: string; metal: string; netWeight: number; wastagePercent: number;
    making: number;
    discount?: number;
    advance?: number; // New field for itemized advance
    diamondDetails?: DetailSection | null;
    stoneDetails?: DetailSection | null;
    beadDetails?: DetailSection | null;
}

export const useBilling = () => {
    const getSaved = (key: string, fallback: any) => {
        if (typeof window === "undefined") return fallback;
        const saved = sessionStorage.getItem(key);
        try { return saved ? JSON.parse(saved) : fallback; } catch { return fallback; }
    };

    const [customer, setCustomer] = useState(() => getSaved('bill_customer', { name: '', phone: '' }));
    const [goldRate, setGoldRate] = useState<number>(() => getSaved('bill_goldRate', 0));
    const [exchangeValue, setExchangeValue] = useState<number>(() => getSaved('bill_exchangeValue', 0));
    const [cart, setCart] = useState<CartItem[]>(() => getSaved('bill_cart', []));
    const [extraDiscount, setExtraDiscount] = useState<number>(() => getSaved('bill_extraDiscount', 0));
    const [advance, setAdvance] = useState<number>(() => getSaved('bill_advance', 0));
    const [itemInput, setItemInput] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        sessionStorage.setItem('bill_customer', JSON.stringify(customer));
        sessionStorage.setItem('bill_goldRate', JSON.stringify(goldRate));
        sessionStorage.setItem('bill_exchangeValue', JSON.stringify(exchangeValue));
        sessionStorage.setItem('bill_cart', JSON.stringify(cart));
        sessionStorage.setItem('bill_extraDiscount', JSON.stringify(extraDiscount));
        sessionStorage.setItem('bill_advance', JSON.stringify(advance));
    }, [customer, goldRate, exchangeValue, cart, extraDiscount, advance]);

    // Sum of all individual item discounts
    const itemDiscountsSum = useMemo(() =>
        cart.reduce((sum, item) => sum + (Number(item.discount) || 0), 0)
        , [cart]);

    // NEW: Sum of all individual item advances
    const itemAdvancesSum = useMemo(() =>
        cart.reduce((sum, item) => sum + (Number(item.advance) || 0), 0)
        , [cart]);

    const calculateAddons = (item: CartItem) => (
        (Number(item.diamondDetails?.price) || 0) +
        (Number(item.stoneDetails?.price) || 0) +
        (Number(item.beadDetails?.price) || 0)
    );

    const calculateItemBasePrice = (item: CartItem) => {
        const ratePerGram = (goldRate || 0) / 11.664;
        const totalWeight = Number(item.netWeight || 0) + (Number(item.wastagePercent || 0) * Number(item.netWeight || 0) / 100);
        return (totalWeight * ratePerGram) + (Number(item.making) || 0) + calculateAddons(item);
    };

    const subTotal = useMemo(() =>
        cart.reduce((a, b) => a + calculateItemBasePrice(b), 0)
        , [cart, goldRate]);

    // FINAL TOTAL: Gross - (All Discounts) - Exchange - (All Advances)
    const finalTotal = subTotal - itemDiscountsSum - extraDiscount - exchangeValue - itemAdvancesSum - advance;

    const calculateItemPrice = (item: CartItem) => {
        const base = calculateItemBasePrice(item);
        // Display price per item card (Base - Item Discount - Item Advance)
        const final = base - Number(item.discount || 0) - Number(item.advance || 0);
        return final > 0 ? final : 0;
    };

    const fetchItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = itemInput.trim().toUpperCase();
        if (!query) return;
        setIsFetching(true);
        try {
            const res = await fetch(`/api/stocks?itemCode=${query}`);
            const data = await res.json();
            if (res.ok) {
                if (!cart.some(i => i.itemCode === data.itemCode)) {
                    setCart(prev => [{ ...data, discount: 0, advance: 0 }, ...prev]);
                }
                setItemInput("");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsFetching(false);
        }
    };

    const updateItemDetail = (index: number, section: keyof CartItem, field: string, value: any) => {
        const newCart = [...cart];
        if (field) {
            const currentSection = newCart[index][section] as any || {};
            (newCart[index] as any)[section] = { ...currentSection, [field]: value };
        } else {
            (newCart[index] as any)[section] = value;
        }
        setCart(newCart);
    };

    const removeItem = (idx: number) => setCart(cart.filter((_, i) => i !== idx));

    const clearSession = () => {
        sessionStorage.clear();
        window.location.reload();
    };

    return {
        customer, setCustomer,
        goldRate, setGoldRate,
        cart, setCart,
        itemInput, setItemInput,
        isFetching, fetchItem,
        updateItemDetail, removeItem,
        exchangeValue, setExchangeValue,
        extraDiscount, setExtraDiscount,
        advance, setAdvance,
        itemDiscountsSum,
        itemAdvancesSum, // Exported
        discount: itemDiscountsSum + extraDiscount,
        totalAdvance: itemAdvancesSum + advance, // Combined advance
        calculateItemPrice,
        calculateAddons,
        subTotal,
        finalTotal,
        clearSession,
    };
};