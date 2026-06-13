"use client"
import { useState, useEffect, useMemo } from 'react';
import { useGoldStore } from './useGoldStore';

export interface DetailSection {
    id?: string;
    name?: string;
    weight?: number;
    price?: number;
    color?: string;
    clarity?: string;
    cut?: string;
    rate?: number;
    squantity?: number;
    dquantity?: number;
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
    making: number;
    discount?: number;
    advance?: number;
    diamondDetails?: DetailSection[] | null;
    stoneDetails?: DetailSection[] | null;
    beadDetails?: DetailSection | null;
}

export const useBilling = () => {
    // Connect to global store for synchronized 21ct and 24ct live rates
    const { rate21ct, rate24ct, ratePalladium, setRatePalladium } = useGoldStore();

    const getSaved = (key: string, fallback: any) => {
        if (typeof window === "undefined") return fallback;
        const saved = sessionStorage.getItem(key);
        try {
            return saved ? JSON.parse(saved) : fallback;
        } catch {
            return fallback;
        }
    };


    // Customer & Main States
    const [customer, setCustomer] = useState(() => getSaved('bill_customer', { name: '', phone: '', seller: "" }));
    const [exchangeValue, setExchangeValue] = useState<number>(() => getSaved('bill_exchangeValue', 0));
    const [cart, setCart] = useState<CartItem[]>(() => getSaved('bill_cart', []));
    const [extraDiscount, setExtraDiscount] = useState<number>(() => getSaved('bill_extraDiscount', 0));
    const [advance, setAdvance] = useState<number>(() => getSaved('bill_advance', 0));
    const [itemInput, setItemInput] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    // Remaining Metal Rates States (Gold removed here as it is managed by Zustand)
    const [silverRate, setSilverRate] = useState<number>(() => getSaved('bill_silverRate', 0));
    const [platinumRate, setPlatinumRate] = useState<number>(() => getSaved('bill_platinumRate', 0));
    const [palladiumRate, setPalladiumRate] = useState<number>(() => getSaved('bill_palladiumRate', 0));



    // Session Persistence
    useEffect(() => {
        sessionStorage.setItem('bill_customer', JSON.stringify(customer));
        sessionStorage.setItem('bill_silverRate', JSON.stringify(silverRate));
        sessionStorage.setItem('bill_platinumRate', JSON.stringify(platinumRate));
        sessionStorage.setItem('bill_palladiumRate', JSON.stringify(palladiumRate));
        sessionStorage.setItem('bill_exchangeValue', JSON.stringify(exchangeValue));
        sessionStorage.setItem('bill_cart', JSON.stringify(cart));
        sessionStorage.setItem('bill_extraDiscount', JSON.stringify(extraDiscount));
        sessionStorage.setItem('bill_advance', JSON.stringify(advance));
    }, [customer, silverRate, platinumRate, palladiumRate, exchangeValue, cart, extraDiscount, advance]);

    // Totals logic
    const itemDiscountsSum = useMemo(() =>
        cart.reduce((sum, item) => sum + (Number(item.discount) || 0), 0)
        , [cart]);

    const itemAdvancesSum = useMemo(() =>
        cart.reduce((sum, item) => sum + (Number(item.advance) || 0), 0)
        , [cart]);

    const calculateAddons = (item: CartItem) => {
        const stonesPrice = (item.stoneDetails || []).reduce((sum, s) => sum + (Number(s.price) || 0), 0);
        const diamondsPrice = (item.diamondDetails || []).reduce((sum, d) => sum + (Number(d.price) || 0), 0);
        const beadsPrice = Number(item.beadDetails?.price) || 0;
        return stonesPrice + diamondsPrice + beadsPrice;
    };

    const calculateItemBasePrice = (item: CartItem) => {
        let activeRate = 0;
        let isPerGram = true;
        const metalType = item.metal?.toLowerCase();
        const caratValue = item.carat?.toLowerCase() || '';

        // Prioritize explicit alternative metals first
        if (metalType === 'silver') {
            activeRate = silverRate;
        } else if (metalType === 'platinum') {
            activeRate = platinumRate;
        } else if (metalType === 'palladium') {
            activeRate = palladiumRate;
            isPerGram = false;
        } else {
            // Defaulting behavior strictly matches based on carat signatures
            if (caratValue.includes('24')) {
                activeRate = Number(rate24ct) || 0;
            } else if (caratValue.includes('21')) {
                activeRate = Number(rate21ct) || 0;
            } else {
                // Safe fallback if an item does not specify 21 or 24 clearly
                activeRate = Number(rate24ct) || 0;
            }
        }

        const ratePerGram = isPerGram ? (activeRate / 11.664) : activeRate;
        const totalWeight = Number(item.netWeight || 0) + (Number(item.wastagePercent || 0) * Number(item.netWeight || 0) / 100);

        return (totalWeight * ratePerGram) + (Number(item.making) || 0) + calculateAddons(item);
    };

    const subTotal = useMemo(() =>
        cart.reduce((a, b) => a + calculateItemBasePrice(b), 0)
        // Explicitly tracking Zustand rates ensures the subtotal updates instantly on shift changes
        , [cart, silverRate, platinumRate, palladiumRate, rate21ct, rate24ct]);

    const finalTotal = subTotal - itemDiscountsSum - extraDiscount - exchangeValue - itemAdvancesSum - advance;

    const calculateItemPrice = (item: CartItem) => {
        const base = calculateItemBasePrice(item);
        const final = base - Number(item.discount || 0) - Number(item.advance || 0);
        return final > 0 ? final : 0;
    };

    // Item Management Actions
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
                    setCart(prev => [{
                        ...data,
                        discount: 0,
                        advance: 0,
                        stoneDetails: data.stoneDetails || [],
                        diamondDetails: data.diamondDetails || []
                    }, ...prev]);
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

    const updateNestedDetail = (
        itemIndex: number,
        section: 'stoneDetails' | 'diamondDetails',
        detailIndex: number,
        field: string,
        value: any
    ) => {
        const newCart = [...cart];
        const item = { ...newCart[itemIndex] };
        const details = [...(item[section] as DetailSection[])];

        details[detailIndex] = { ...details[detailIndex], [field]: value };
        item[section] = details;
        newCart[itemIndex] = item;

        setCart(newCart);
    };

    const removeItem = (idx: number) => setCart(cart.filter((_, i) => i !== idx));

    const clearSession = () => {
        sessionStorage.clear();
        window.location.reload();
    };

    return {
        customer, setCustomer,
        silverRate, setSilverRate,
        platinumRate, setPlatinumRate,
        palladiumRate, setPalladiumRate,
        cart, setCart,
        itemInput, setItemInput,
        isFetching, fetchItem,
        updateItemDetail, removeItem,
        exchangeValue, setExchangeValue,
        extraDiscount, setExtraDiscount,
        advance, setAdvance,
        itemDiscountsSum,
        itemAdvancesSum,
        discount: itemDiscountsSum + extraDiscount,
        totalAdvance: itemAdvancesSum + advance,
        calculateItemPrice,
        calculateAddons,
        subTotal,
        finalTotal,
        clearSession,
        updateNestedDetail
    };
};