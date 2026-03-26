import { useState } from 'react';

export interface DetailSection {
    id?: string; name?: string; weight?: number; price?: number;
    color?: string; clarity?: string; cut?: string; rate?: number;
}

export interface CartItem {
    id: string; itemCode: string; categoryName: string; carat: string;
    metal: string; netWeight: number; wastagePercent: number;
    making: number;
    diamondDetails?: DetailSection | null;
    stoneDetails?: DetailSection | null;
    beadDetails?: DetailSection | null;
}

export const useBilling = () => {
    const [customer, setCustomer] = useState({ name: '', phone: '' });
    const [goldRate, setGoldRate] = useState<number>(245000);
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
            // We fetch the exact string typed to avoid Case-Sensitivity 404s
            const res = await fetch(`/api/stocks?itemCode=${query}`);
            const data = await res.json();

            if (res.ok && data) {
                if (!cart.some(item => item.itemCode === data.itemCode)) {
                    setCart(prev => [data, ...prev]);
                }
                setItemInput("");
            } else {
                alert(`Item "${query}" not found in database.`);
            }
        } catch (err) {
            alert("Network error. Please check your API.");
        } finally {
            setIsFetching(false);
        }
    };

    const updateItemDetail = (index: number, section: keyof CartItem, field: string, value: any) => {
        setCart(prevCart => {
            const newCart = [...prevCart];
            const item = { ...newCart[index] };

            // Ensure we are cloning the nested object correctly
            const sectionData = { ...(item[section] as any) };
            sectionData[field] = value;

            (item as any)[section] = sectionData;
            newCart[index] = item;
            return newCart;
        });
    };

    const removeItem = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const calculateItemPrice = (item: CartItem) => {
        const ratePerGram = (goldRate || 0) / 11.664;
        const metalValue = (Number(item.netWeight) || 0) * ratePerGram;
        return (
            metalValue +
            (Number(item.making) || 0) +
            (Number(item.stoneDetails?.price) || 0) +
            (Number(item.beadDetails?.price) || 0) +
            (Number(item.diamondDetails?.price) || 0)
        );
    };

    const subTotal = cart.reduce((a, b) => a + calculateItemPrice(b), 0);
    const finalTotal = subTotal - discount;

    return {
        customer, setCustomer, goldRate, setGoldRate,
        discount, setDiscount, itemInput, setItemInput,
        isFetching, cart, fetchItem, updateItemDetail,
        removeItem, subTotal, finalTotal
    };
};