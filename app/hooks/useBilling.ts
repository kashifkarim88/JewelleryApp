import { useState } from 'react';

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
    description?: string;
    workerName?: string;
    imageUrl?: string | null;
    diamondDetails?: DetailSection | null;
    stoneDetails?: DetailSection | null;
    beadDetails?: DetailSection | null;
}

export const useBilling = () => {
    const [customer, setCustomer] = useState({ name: '', phone: '' });
    const [goldRate, setGoldRate] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [itemInput, setItemInput] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);

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
                    setCart(prev => [data, ...prev]);
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

    // Helper to sum up Diamond + Stone + Bead prices
    const calculateAddons = (item: CartItem) => {
        return (Number(item.diamondDetails?.price) || 0) +
            (Number(item.stoneDetails?.price) || 0) +
            (Number(item.beadDetails?.price) || 0);
    };

    const calculateItemPrice = (item: CartItem) => {
        const ratePerGram = (goldRate || 0) / 11.664;
        const totalWeight = Number(item.netWeight || 0) + (Number(item.wastagePercent || 0) * Number(item.netWeight || 0) / 100);
        return (totalWeight * ratePerGram) + (Number(item.making) || 0) + calculateAddons(item);
    };

    const subTotal = cart.reduce((a, b) => a + calculateItemPrice(b), 0);

    return {
        customer, setCustomer, goldRate, setGoldRate, discount, setDiscount,
        itemInput, setItemInput, isFetching, cart, fetchItem,
        updateItemDetail, removeItem: (index: number) => setCart(prev => prev.filter((_, i) => i !== index)),
        calculateItemPrice, calculateAddons, subTotal, finalTotal: subTotal - discount
    };
};