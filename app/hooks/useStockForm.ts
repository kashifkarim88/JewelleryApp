"use client"
import { useState, useEffect, useMemo, useRef } from 'react';

export function useStockLogic(stoneTrigger?: number) {
    const [mounted, setMounted] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoadingCats, setIsLoadingCats] = useState(true);
    const [workers, setWorkers] = useState<any[]>([]);
    const [isLoadingWorkers, setIsLoadingWorkers] = useState(true);
    const [nextItemCode, setNextItemCode] = useState<string>("Loading...");

    // Multi-item States (Diamonds & Stones)
    const [diamondList, setDiamondList] = useState<any[]>([]);
    const [stoneList, setStoneList] = useState<any[]>([]);

    const [selectedMetal, setSelectedMetal] = useState("Gold");
    const [selectedCarat, setSelectedCarat] = useState("21K");
    const [catSearch, setCatSearch] = useState("");
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [workerSearch, setWorkerSearch] = useState("");
    const [isWorkerOpen, setIsWorkerOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<'category' | 'worker' | 'diamond' | null>(null);
    const [prodDescription, setProdDescription] = useState("");
    const [prodCode, setProdCode] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showStone, setShowStone] = useState(false);
    const [showBeads, setShowBeads] = useState(false);
    const [showDiamond, setShowDiamond] = useState(false);

    const [errors, setErrors] = useState<{ cat?: boolean; weight?: boolean }>({});

    const [stoneTypes, setStoneTypes] = useState<any[]>([]);
    const [isLoadingStones, setIsLoadingStones] = useState(false);

    // Initialized palladiumPercentage with default "33" and added bQty to beads state
    const [vals, setVals] = useState({
        worker: "", making: "", netWeight: "", WastageGram: "", wastage: "", palladiumPercentage: "33",
        // Stone Buffer
        sName: "", sWgt: "", sQty: "", sPrice: "",
        // Beads
        bName: "", bWgt: "", bQty: "", bPrice: "",
        // Diamond Buffer
        dName: "", dCut: "", dColor: "", dClarity: "", dWgt: "", dRate: "", dQty: "", dPrice: "",
    });

    const refs = {
        catRef: useRef<HTMLDivElement>(null),
        workerRef: useRef<HTMLDivElement>(null),
        modalRef: useRef<HTMLDivElement>(null),
        WastageGramRef: useRef<HTMLInputElement>(null),
        wastageRef: useRef<HTMLInputElement>(null),
        makingRef: useRef<HTMLInputElement>(null),
        sWgtRef: useRef<HTMLInputElement>(null),
        sPriceRef: useRef<HTMLInputElement>(null),
        bPriceRef: useRef<HTMLInputElement>(null),
        dWgtRef: useRef<HTMLInputElement>(null),
        sQtyRef: useRef<HTMLInputElement>(null),
        dColorRef: useRef<HTMLInputElement>(null),
        dPriceRef: useRef<HTMLInputElement>(null),
        bWgtRef: useRef<HTMLInputElement>(null),
        bQtyRef: useRef<HTMLInputElement>(null),
        dRateRef: useRef<HTMLInputElement>(null),
        dQtyRef: useRef<HTMLInputElement>(null),
    };

    const fetchStones = async () => {
        try {
            setIsLoadingStones(true);
            const res = await fetch('/api/stones', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setStoneTypes(data);
            }
        } catch (err) {
            console.error("Error fetching stones:", err);
        } finally {
            setIsLoadingStones(false);
        }
    };

    useEffect(() => {
        fetchStones();
    }, [stoneTrigger ?? 0]);

    // --- List Handlers ---
    const handleAddStone = () => {
        if (!vals.sName || !vals.sWgt) return;
        const newStone = {
            id: Date.now(),
            name: vals.sName, weight: vals.sWgt, qty: vals.sQty, price: vals.sPrice
        };
        setStoneList(prev => [...prev, newStone]);
        setVals(prev => ({ ...prev, sName: "", sWgt: "", sQty: "", sPrice: "" }));
    };

    const handleRemoveStone = (id: number) => {
        setStoneList(prev => prev.filter(s => s.id !== id));
    };

    const handleAddDiamond = () => {
        if (!vals.dName || !vals.dWgt) return;
        const newDiamond = {
            id: Date.now(),
            name: vals.dName, cut: vals.dCut, color: vals.dColor, clarity: vals.dClarity,
            weight: vals.dWgt, rate: vals.dRate, qty: vals.dQty, price: vals.dPrice,
        };
        setDiamondList(prev => [...prev, newDiamond]);
        setVals(prev => ({ ...prev, dName: "", dCut: "", dColor: "", dClarity: "", dWgt: "", dRate: "", dQty: "", dPrice: "" }));
    };

    const handleRemoveDiamond = (id: number) => {
        setDiamondList(prev => prev.filter(d => d.id !== id));
    };

    // --- Logical Checks ---
    const isStoneDirty = useMemo(() => !!(vals.sName || vals.sWgt || vals.sPrice) || stoneList.length > 0, [vals, stoneList]);
    const isBeadsDirty = useMemo(() => !!((vals as any).bWgt || (vals as any).beadsWgt || (vals as any).bQty || (vals as any).beadsQty || (vals as any).bPrice || (vals as any).beadsPrice), [vals]);
    const isDiamondDirty = useMemo(() => !!(vals.dName || vals.dWgt || vals.dColor || vals.dCut || vals.dClarity || vals.dRate || vals.dPrice) || diamondList.length > 0, [vals, diamondList]);

    // --- Error Clearing Effects ---
    useEffect(() => {
        if (catSearch && errors.cat) setErrors(prev => ({ ...prev, cat: false }));
    }, [catSearch, errors.cat]);

    useEffect(() => {
        if (vals.netWeight && errors.weight) setErrors(prev => ({ ...prev, weight: false }));
    }, [vals.netWeight, errors.weight]);

    // --- Fetchers ---
    const fetchNextCode = async (prefix: string) => {
        if (!prefix) return;
        try {
            setNextItemCode("Generating...");
            const res = await fetch(`/api/stocks/next-code?prefix=${prefix}`);
            if (res.ok) {
                const data = await res.json();
                setNextItemCode(data.nextCode);
            }
        } catch (err) { setNextItemCode("Error"); }
    };

    const fetchCategories = async () => {
        try {
            setIsLoadingCats(true);
            const res = await fetch('/api/category');
            if (res.ok) setCategories(await res.json());
        } finally { setIsLoadingCats(false); }
    };

    const fetchWorkers = async () => {
        try {
            setIsLoadingWorkers(true);
            const res = await fetch('/api/workers');
            if (res.ok) setWorkers(await res.json());
        } finally { setIsLoadingWorkers(false); }
    };

    useEffect(() => {
        setMounted(true);
        fetchCategories();
        fetchWorkers();
        const handleClickOutside = (event: MouseEvent) => {
            if (refs.catRef.current && !refs.catRef.current.contains(event.target as Node)) setIsCatOpen(false);
            if (refs.workerRef.current && !refs.workerRef.current.contains(event.target as Node)) setIsWorkerOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCategories = useMemo(() => {
        return categories.filter(c => (c.product_name || "").toLowerCase().includes(catSearch.toLowerCase()) || (c.Abbreviation || "").toLowerCase().includes(catSearch.toLowerCase())).sort((a, b) => a.product_name.localeCompare(b.product_name));
    }, [categories, catSearch]);

    const filteredWorkers = useMemo(() => {
        return workers.filter(w => (w.name || "").toLowerCase().includes(workerSearch.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
    }, [workers, workerSearch]);

    // --- Final Save Logic ---
    const handleSave = async () => {
        const newErrors = { cat: !catSearch, weight: !vals.netWeight };
        if (newErrors.cat || newErrors.weight) { setErrors(newErrors); return; }

        setIsSubmitting(true);
        try {
            let finalDescription = prodDescription;
            if (vals.bName) finalDescription += ` | Beads: ${vals.bName}`;

            const totalSQty = stoneList.length > 0 ? stoneList.reduce((acc, cur) => acc + Number(cur.qty || 0), 0).toString() : vals.sQty;
            const totalDQty = diamondList.length > 0 ? diamondList.reduce((acc, cur) => acc + Number(cur.qty || 0), 0).toString() : vals.dQty;

            const formattedCarat = selectedCarat ? selectedCarat.replace(/ct/gi, 'K').trim() : null;

            const purityValue = selectedMetal.toLowerCase() === "palladium"
                ? (vals.palladiumPercentage || "33")
                : null;

            const payload = {
                itemCode: nextItemCode,
                metal: selectedMetal,
                carat: selectedMetal.toLowerCase() === "gold" ? formattedCarat : null,
                purity: purityValue,
                categoryName: catSearch,
                productCode: prodCode,
                description: finalDescription,
                workerName: vals.worker,
                netWeight: vals.netWeight,
                wastageGram: vals.WastageGram,
                wastagePercent: vals.wastage,
                quantity: "1",
                squantity: totalSQty,
                dquantity: totalDQty,
                making: vals.making,
                imageUrl: imagePreview,
                stoneData: stoneList.length > 0
                    ? stoneList.map(s => ({ name: s.name, weight: s.weight, qty: s.qty, price: s.price }))
                    : (isStoneDirty ? [{ name: vals.sName, weight: vals.sWgt, qty: vals.sQty, price: vals.sPrice }] : null),
                beadData: isBeadsDirty ? {
                    weight: (vals as any).bWgt || (vals as any).beadsWgt || "0",
                    quantity: (vals as any).bQty || (vals as any).beadsQty || "0",
                    price: (vals as any).bPrice || (vals as any).beadsPrice || "0"
                } : null,
                diamondData: diamondList.length > 0
                    ? diamondList.map(d => ({ name: d.name, weight: d.weight, color: d.color, cut: d.cut, clarity: d.clarity, rate: d.rate, qty: d.qty, price: d.price }))
                    : (isDiamondDirty ? [{ name: vals.dName, weight: vals.dWgt, color: vals.dColor, cut: vals.dCut, clarity: vals.dClarity, rate: vals.dRate, qty: vals.dQty, price: vals.dPrice }] : null),
            };

            const res = await fetch('/api/stocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Inventory Updated Successfully!");
                setVals({
                    worker: "", making: "", netWeight: "", WastageGram: "", wastage: "", palladiumPercentage: "33",
                    sName: "", sWgt: "", sQty: "", sPrice: "",
                    bName: "", bWgt: "", bQty: "", bPrice: "",
                    dName: "", dCut: "", dColor: "", dClarity: "", dWgt: "", dRate: "", dQty: "", dPrice: ""
                });
                setStoneList([]);
                setDiamondList([]);
                setProdDescription("");
                setImagePreview(null);
                setCatSearch("");
                setProdCode("");
                setErrors({});
                setShowStone(false);
                setShowBeads(false);
                setShowDiamond(false);
            }
        } catch (e) {
            console.error("Critical entry save failure:", e);
        } finally { setIsSubmitting(false); }
    };

    useEffect(() => {
        if (prodCode) fetchNextCode(prodCode);
        else setNextItemCode("Select Category");
    }, [prodCode]);

    return {
        mounted, nextItemCode, selectedMetal, setSelectedMetal, selectedCarat, setSelectedCarat,
        catSearch, setCatSearch, isCatOpen, setIsCatOpen, workerSearch, setWorkerSearch,
        isWorkerOpen, setIsWorkerOpen, activeModal, setActiveModal, prodDescription, setProdDescription,
        prodCode, setProdCode, imagePreview, setImagePreview, isSubmitting, vals, setVals,
        showStone, setShowStone, showBeads, setShowBeads, showDiamond, setShowDiamond,
        isStoneDirty, isBeadsDirty, isDiamondDirty, filteredCategories, filteredWorkers,
        refs, handleSave, fetchCategories, fetchWorkers, isLoadingCats, isLoadingWorkers, errors,
        diamondList, handleAddDiamond, handleRemoveDiamond, stoneList, handleAddStone, handleRemoveStone, stoneTypes,
        isLoadingStones, fetchStones,
    };
}