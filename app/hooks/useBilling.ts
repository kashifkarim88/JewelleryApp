import { useState, useEffect } from 'react';

export interface DetailSection {
    id?: string; name?: string; weight?: number; price?: number;
    color?: string; clarity?: string; cut?: string; rate?: number;
}

export interface CartItem {
    id: string;
    itemCode: string;
    productCode?: string;
    categoryName: string;
    carat: string;
    metal: string;
    netWeight: number;
    wastagePercent: number;
    wastageGram?: number;
    making: number;
    discount?: number; // Added per-item discount field
    description?: string;
    workerName?: string;
    imageUrl?: string | null;
    diamondDetails?: DetailSection | null;
    stoneDetails?: DetailSection | null;
    beadDetails?: DetailSection | null;
}

export const useBilling = () => {
    // --- PERSISTENCE HELPERS ---
    const getSaved = (key: string, fallback: any) => {
        if (typeof window === "undefined") return fallback;
        const saved = sessionStorage.getItem(key);
        try {
            return saved ? JSON.parse(saved) : fallback;
        } catch {
            return fallback;
        }
    };

    // --- INITIAL STATE ---
    const [customer, setCustomer] = useState(() => getSaved('bill_customer', { name: '', phone: '' }));
    const [goldRate, setGoldRate] = useState<number>(() => getSaved('bill_goldRate', 0));
    const [overallDiscount, setOverallDiscount] = useState<number>(() => getSaved('bill_discount', 0)); // Total bill discount
    const [exchangeValue, setExchangeValue] = useState<number>(() => getSaved('bill_exchangeValue', 0));
    const [cart, setCart] = useState<CartItem[]>(() => getSaved('bill_cart', []));

    const [itemInput, setItemInput] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    // --- AUTO-SAVE EFFECT ---
    useEffect(() => {
        sessionStorage.setItem('bill_customer', JSON.stringify(customer));
        sessionStorage.setItem('bill_goldRate', JSON.stringify(goldRate));
        sessionStorage.setItem('bill_discount', JSON.stringify(overallDiscount));
        sessionStorage.setItem('bill_exchangeValue', JSON.stringify(exchangeValue));
        sessionStorage.setItem('bill_cart', JSON.stringify(cart));
    }, [customer, goldRate, overallDiscount, exchangeValue, cart]);

    const fetchItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = itemInput.trim();
        if (!query) return;
        setIsFetching(true);
        try {
            const res = await fetch(`/api/stocks?itemCode=${query.toUpperCase()}`);
            const data = await res.json();
            if (res.ok && data) {
                if (!cart.some(item => item.itemCode === data.itemCode)) {
                    // Initialize discount as 0 for new items
                    setCart(prev => [{ ...data, discount: 0 }, ...prev]);
                }
                setItemInput("");
            } else { alert(`Item "${query}" not found.`); }
        } catch (err) { alert("Network error."); } finally { setIsFetching(false); }
    };

    const updateItemDetail = (index: number, section: keyof CartItem, field: string, value: any) => {
        setCart(prevCart => {
            const newCart = [...prevCart];
            const item = { ...newCart[index] };
            if (field) {
                const existingSection = item[section] && typeof item[section] === 'object' ? (item[section] as any) : {};
                (item as any)[section] = { ...existingSection, [field]: value };
            } else {
                (item as any)[section] = value;
            }
            newCart[index] = item;
            return newCart;
        });
    };

    const calculateAddons = (item: CartItem) => {
        return (Number(item.diamondDetails?.price) || 0) +
            (Number(item.stoneDetails?.price) || 0) +
            (Number(item.beadDetails?.price) || 0);
    };

    const calculateItemPrice = (item: CartItem) => {
        const ratePerGram = (goldRate || 0) / 11.664;
        const totalWeight = Number(item.netWeight || 0) + (Number(item.wastagePercent || 0) * Number(item.netWeight || 0) / 100);

        const basePrice = (totalWeight * ratePerGram) + (Number(item.making) || 0) + calculateAddons(item);
        const itemDiscount = Number(item.discount || 0);

        // Subtract item-specific discount from the item total
        const finalItemPrice = basePrice - itemDiscount;

        return finalItemPrice > 0 ? finalItemPrice : 0; // Prevent negative prices
    };

    // Subtotal is the sum of all item prices (which already have item-discounts subtracted)
    const subTotal = cart.reduce((a, b) => a + calculateItemPrice(b), 0);

    const clearSession = () => {
        sessionStorage.clear();
        setCustomer({ name: '', phone: '' });
        setGoldRate(0);
        setOverallDiscount(0);
        setExchangeValue(0);
        setCart([]);
    };

    return {
        customer, setCustomer, goldRate, setGoldRate,
        discount: overallDiscount, setDiscount: setOverallDiscount,
        exchangeValue, setExchangeValue,
        itemInput, setItemInput, isFetching, cart, fetchItem,
        updateItemDetail, removeItem: (index: number) => setCart(prev => prev.filter((_, i) => i !== index)),
        calculateItemPrice, calculateAddons,
        subTotal,
        // finalTotal takes the subtotal and applies the global bill discount and exchange
        finalTotal: subTotal - overallDiscount - exchangeValue,
        clearSession
    };
};