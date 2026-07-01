"use client"
import { useEffect, useMemo, useReducer, useState, useRef } from 'react';
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
    peritemTotal?: number;
}

interface CustomerState {
    name: string;
    phone: string;
    seller: string;
}

interface BillingState {
    customer: CustomerState;
    exchangeValue: number;
    cart: CartItem[];
    extraDiscount: number;
    advance: number;
}

type BillingAction =
    | { type: 'SET_CUSTOMER'; payload: Partial<CustomerState> }
    | { type: 'SET_EXCHANGE_VALUE'; payload: number }
    | { type: 'SET_CART'; payload: CartItem[] }
    | { type: 'ADD_CART_ITEM'; payload: CartItem }
    | { type: 'REMOVE_CART_ITEM'; payload: number }
    | { type: 'SET_EXTRA_DISCOUNT'; payload: number }
    | { type: 'SET_ADVANCE'; payload: number }
    | { type: 'UPDATE_ITEM_DETAIL'; payload: { index: number; section: keyof CartItem; field?: string; value: any } }
    | { type: 'UPDATE_NESTED_DETAIL'; payload: { itemIndex: number; section: 'stoneDetails' | 'diamondDetails'; detailIndex: number; field: string; value: any } }
    | { type: 'HYDRATE_STATE'; payload: BillingState };

const FALLBACK_STATE: BillingState = {
    customer: { name: '', phone: '', seller: "" },
    exchangeValue: 0,
    cart: [],
    extraDiscount: 0,
    advance: 0,
};

function billingReducer(state: BillingState, action: BillingAction): BillingState {
    switch (action.type) {
        case 'HYDRATE_STATE':
            return action.payload;
        case 'SET_CUSTOMER':
            return { ...state, customer: { ...state.customer, ...action.payload } };
        case 'SET_EXCHANGE_VALUE':
            return { ...state, exchangeValue: action.payload };
        case 'SET_CART':
            return { ...state, cart: action.payload };
        case 'ADD_CART_ITEM':
            if (state.cart.some(item => item.itemCode === action.payload.itemCode)) return state;
            return { ...state, cart: [action.payload, ...state.cart] };
        case 'REMOVE_CART_ITEM':
            return { ...state, cart: state.cart.filter((_, i) => i !== action.payload) };
        case 'SET_EXTRA_DISCOUNT':
            return { ...state, extraDiscount: action.payload };
        case 'SET_ADVANCE':
            return { ...state, advance: action.payload };
        case 'UPDATE_ITEM_DETAIL': {
            const { index, section, field, value } = action.payload;
            return {
                ...state,
                cart: state.cart.map((item, i) => {
                    if (i !== index) return item;
                    if (field) {
                        const currentSection = (item[section] as Record<string, any>) || {};
                        return { ...item, [section]: { ...currentSection, [field]: value } };
                    }
                    return { ...item, [section]: value };
                })
            };
        }
        case 'UPDATE_NESTED_DETAIL': {
            const { itemIndex, section, detailIndex, field, value } = action.payload;
            return {
                ...state,
                cart: state.cart.map((item, i) => {
                    if (i !== itemIndex) return item;
                    const currentDetails = [...(item[section] as DetailSection[] || [])];
                    if (currentDetails[detailIndex]) {
                        currentDetails[detailIndex] = { ...currentDetails[detailIndex], [field]: value };
                    }
                    return { ...item, [section]: currentDetails };
                })
            };
        }
        default:
            return state;
    }
}

const formatFinancial = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

export const useBilling = () => {
    const {
        rate24ct, rate22ct, rate21ct, rate20ct, rate18ct, rate14ct,
        ratePalladium, rateSilver, ratePlatinum
    } = useGoldStore();

    const [state, dispatch] = useReducer(billingReducer, FALLBACK_STATE);
    const [itemInput, setItemInput] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    // Persistent controller instance across renders to manage API abort flags
    const abortControllerRef = useRef<AbortController | null>(null);

    // Safe Client-side Hydration
    useEffect(() => {
        const getSaved = (key: string, fallback: any) => {
            const saved = sessionStorage.getItem(key);
            try { return saved ? JSON.parse(saved) : fallback; } catch { return fallback; }
        };

        dispatch({
            type: 'HYDRATE_STATE',
            payload: {
                customer: getSaved('bill_customer', FALLBACK_STATE.customer),
                exchangeValue: getSaved('bill_exchangeValue', FALLBACK_STATE.exchangeValue),
                cart: getSaved('bill_cart', FALLBACK_STATE.cart),
                extraDiscount: getSaved('bill_extraDiscount', FALLBACK_STATE.extraDiscount),
                advance: getSaved('bill_advance', FALLBACK_STATE.advance),
            }
        });
    }, []);

    // Optimized Storage Syncer (Debounced or structured approach recommended if performance drops)
    useEffect(() => {
        if (state === FALLBACK_STATE) return; // Skip initial empty render sync
        sessionStorage.setItem('bill_customer', JSON.stringify(state.customer));
        sessionStorage.setItem('bill_exchangeValue', JSON.stringify(state.exchangeValue));
        sessionStorage.setItem('bill_cart', JSON.stringify(state.cart));
        sessionStorage.setItem('bill_extraDiscount', JSON.stringify(state.extraDiscount));
        sessionStorage.setItem('bill_advance', JSON.stringify(state.advance));
    }, [state]);

    // Clean up ongoing API fetches if component unmounts
    useEffect(() => {
        return () => abortControllerRef.current?.abort();
    }, []);

    // Memoized Matrix Computations
    const itemDiscountsSum = useMemo(() =>
        state.cart.reduce((sum, item) => sum + (Number(item.discount) || 0), 0), [state.cart]);

    const itemAdvancesSum = useMemo(() =>
        state.cart.reduce((sum, item) => sum + (Number(item.advance) || 0), 0), [state.cart]);

    const calculateAddons = (item: CartItem) => {
        const stonesPrice = (item.stoneDetails || []).reduce((sum, s) => sum + (Number(s.price) || 0), 0);
        const diamondsPrice = (item.diamondDetails || []).reduce((sum, d) => sum + (Number(d.price) || 0), 0);
        const beadsPrice = Number(item.beadDetails?.price) || 0;
        return formatFinancial(stonesPrice + diamondsPrice + beadsPrice);
    };

    const calculateItemBasePrice = (item: CartItem) => {
        let activeRate = 0;
        let isPerGram = true;
        const metalType = item.metal?.toLowerCase() || 'gold';
        const caratValue = item.carat?.toLowerCase() || '';

        if (metalType === 'silver') activeRate = Number(rateSilver) || 0;
        else if (metalType === 'platinum') activeRate = Number(ratePlatinum) || 0;
        else if (metalType === 'palladium') {
            activeRate = Number(ratePalladium) || 0;
            isPerGram = false;
        } else {
            if (caratValue.includes('24')) activeRate = Number(rate24ct) || 0;
            else if (caratValue.includes('22')) activeRate = Number(rate22ct) || 0;
            else if (caratValue.includes('21')) activeRate = Number(rate21ct) || 0;
            else if (caratValue.includes('20')) activeRate = Number(rate20ct) || 0;
            else if (caratValue.includes('18')) activeRate = Number(rate18ct) || 0;
            else if (caratValue.includes('14')) activeRate = Number(rate14ct) || 0;
            else activeRate = Number(rate24ct) || 0;
        }

        const ratePerGram = isPerGram ? (activeRate / 11.664) : activeRate;
        const totalWeight = Number(item.netWeight || 0) + (Number(item.wastagePercent || 0) * Number(item.netWeight || 0) / 100);

        return formatFinancial((totalWeight * ratePerGram) + (Number(item.making) || 0));
    };

    const subTotal = useMemo(() =>
        formatFinancial(state.cart.reduce((a, b) => a + calculateItemBasePrice(b) + calculateAddons(b), 0))
        , [state.cart, rate24ct, rate22ct, rate21ct, rate20ct, rate18ct, rate14ct, ratePalladium, rateSilver, ratePlatinum]);

    const finalTotal = useMemo(() =>
        formatFinancial(subTotal - itemDiscountsSum - state.extraDiscount - state.exchangeValue - itemAdvancesSum - state.advance)
        , [subTotal, itemDiscountsSum, state.extraDiscount, state.exchangeValue, itemAdvancesSum, state.advance]);

    const calculateItemPrice = (item: CartItem) => {
        const base = calculateItemBasePrice(item) + calculateAddons(item);
        const final = base - Number(item.discount || 0) - Number(item.advance || 0);
        return final > 0 ? formatFinancial(final) : 0;
    };

    // Safe, Race-condition Immune Fetch Method
    const fetchItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = itemInput.trim().toUpperCase();
        if (!query) return;

        // Abort previous running lookups
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;
        setIsFetching(true);

        try {
            const res = await fetch(`/api/stocks?itemCode=${query}`, {
                signal: controller.signal
            });
            const data = await res.json();

            if (res.ok) {
                dispatch({
                    type: 'ADD_CART_ITEM',
                    payload: {
                        ...data,
                        discount: 0,
                        advance: 0,
                        stoneDetails: data.stoneDetails || [],
                        diamondDetails: data.diamondDetails || []
                    }
                });
                setItemInput("");
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error("Fetch handling breakdown:", err);
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsFetching(false);
            }
        }
    };

    const clearSession = () => {
        sessionStorage.clear();
        window.location.reload();
    };

    return {
        customer: state.customer,
        setCustomer: (payload: Partial<CustomerState>) => dispatch({ type: 'SET_CUSTOMER', payload }),
        exchangeValue: state.exchangeValue,
        setExchangeValue: (val: number) => dispatch({ type: 'SET_EXCHANGE_VALUE', payload: val }),
        cart: state.cart,
        setCart: (cart: CartItem[]) => dispatch({ type: 'SET_CART', payload: cart }),
        extraDiscount: state.extraDiscount,
        setExtraDiscount: (val: number) => dispatch({ type: 'SET_EXTRA_DISCOUNT', payload: val }),
        advance: state.advance,
        setAdvance: (val: number) => dispatch({ type: 'SET_ADVANCE', payload: val }),
        itemInput,
        setItemInput,
        isFetching,
        fetchItem,
        clearSession,
        removeItem: (idx: number) => dispatch({ type: 'REMOVE_CART_ITEM', payload: idx }),
        updateItemDetail: (index: number, section: keyof CartItem, field: string, value: any) =>
            dispatch({ type: 'UPDATE_ITEM_DETAIL', payload: { index, section, field, value } }),
        updateNestedDetail: (itemIndex: number, section: 'stoneDetails' | 'diamondDetails', detailIndex: number, field: string, value: any) =>
            dispatch({ type: 'UPDATE_NESTED_DETAIL', payload: { itemIndex, section, detailIndex, field, value } }),
        silverRate: Number(rateSilver) || 0,
        platinumRate: Number(ratePlatinum) || 0,
        palladiumRate: Number(ratePalladium) || 0,
        itemDiscountsSum,
        itemAdvancesSum,
        discount: formatFinancial(itemDiscountsSum + state.extraDiscount),
        totalAdvance: formatFinancial(itemAdvancesSum + state.advance),
        calculateItemPrice,
        calculateAddons,
        subTotal,
        finalTotal,
    };
};