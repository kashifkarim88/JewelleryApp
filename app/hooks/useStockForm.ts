"use client"
import { useState, useEffect, useMemo, useRef } from 'react';

export function useStockLogic() {
    const [mounted, setMounted] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoadingCats, setIsLoadingCats] = useState(true);
    const [workers, setWorkers] = useState<any[]>([]);
    const [isLoadingWorkers, setIsLoadingWorkers] = useState(true);
    const [nextItemCode, setNextItemCode] = useState<string>("Loading...");

    const [selectedMetal, setSelectedMetal] = useState("Gold");
    const [selectedCarat, setSelectedCarat] = useState("21K");
    const [catSearch, setCatSearch] = useState("");
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [workerSearch, setWorkerSearch] = useState("");
    const [isWorkerOpen, setIsWorkerOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<'category' | 'worker' | null>(null);
    const [prodDescription, setProdDescription] = useState("");
    const [prodCode, setProdCode] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showStone, setShowStone] = useState(false);
    const [showBeads, setShowBeads] = useState(false);
    const [showDiamond, setShowDiamond] = useState(false);

    const [errors, setErrors] = useState<{ cat?: boolean; weight?: boolean }>({});

    const [vals, setVals] = useState({
        worker: "",
        making: "",
        netWeight: "",
        WastageGram: "",
        wastage: "",
        palladiumPercentage: "",
        sName: "", sWgt: "", sPrice: "",
        bWgt: "", bPrice: "",
        dName: "", dWgt: "", dColor: "", dCut: "", dClarity: "", dRate: "", dPrice: ""
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
        dColorRef: useRef<HTMLInputElement>(null),
    };

    useEffect(() => {
        if (catSearch && errors.cat) setErrors(prev => ({ ...prev, cat: false }));
    }, [catSearch, errors.cat]);

    useEffect(() => {
        if (vals.netWeight && errors.weight) setErrors(prev => ({ ...prev, weight: false }));
    }, [vals.netWeight, errors.weight]);

    const fetchNextCode = async (prefix: string) => {
        if (!prefix) return;
        try {
            setNextItemCode("Generating...");
            const res = await fetch(`/api/stocks/next-code?prefix=${prefix}`);
            if (res.ok) {
                const data = await res.json();
                setNextItemCode(data.nextCode);
            }
        } catch (err) {
            console.error(err);
            setNextItemCode("Error");
        }
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
            if (refs.modalRef.current && !refs.modalRef.current.contains(event.target as Node)) setActiveModal(null);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isStoneDirty = useMemo(() => !!(vals.sName || vals.sWgt || vals.sPrice), [vals]);
    const isBeadsDirty = useMemo(() => !!(vals.bWgt || vals.bPrice), [vals]);
    const isDiamondDirty = useMemo(() => !!(vals.dName || vals.dWgt || vals.dColor || vals.dCut || vals.dClarity || vals.dRate || vals.dPrice), [vals]);

    const filteredCategories = useMemo(() => {
        return categories.filter(c => (c.product_name || "").toLowerCase().includes(catSearch.toLowerCase()) || (c.Abbreviation || "").toLowerCase().includes(catSearch.toLowerCase())).sort((a, b) => a.product_name.localeCompare(b.product_name));
    }, [categories, catSearch]);

    const filteredWorkers = useMemo(() => {
        return workers.filter(w => (w.name || "").toLowerCase().includes(workerSearch.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
    }, [workers, workerSearch]);

    const handleSave = async () => {
        const newErrors = { cat: !catSearch, weight: !vals.netWeight };
        if (newErrors.cat || newErrors.weight) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                itemCode: nextItemCode,
                metal: selectedMetal,
                carat: selectedMetal === "Gold" ? selectedCarat : null,
                // UPDATED: Mapping palladiumPercentage state to 'purity' field for API
                purity: selectedMetal === "Palladium" ? vals.palladiumPercentage : null,
                categoryName: catSearch,
                productCode: prodCode,
                description: prodDescription,
                workerName: vals.worker,
                netWeight: vals.netWeight,
                wastageGram: vals.WastageGram,
                wastagePercent: vals.wastage,
                making: vals.making,
                imageUrl: imagePreview,
                stoneData: isStoneDirty ? { name: vals.sName, weight: vals.sWgt, price: vals.sPrice } : null,
                beadData: isBeadsDirty ? { weight: vals.bWgt, price: vals.bPrice } : null,
                diamondData: isDiamondDirty ? { name: vals.dName, weight: vals.dWgt, color: vals.dColor, cut: vals.dCut, clarity: vals.dClarity, rate: vals.dRate, price: vals.dPrice } : null,
            };

            const res = await fetch('/api/stocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Inventory Updated Successfully!");
                setVals({
                    worker: "", making: "", netWeight: "", WastageGram: "", wastage: "",
                    palladiumPercentage: "",
                    sName: "", sWgt: "", sPrice: "", bWgt: "", bPrice: "",
                    dName: "", dWgt: "", dColor: "", dCut: "", dClarity: "", dRate: "", dPrice: ""
                });
                setProdDescription("");
                setImagePreview(null);
                setCatSearch("");
                setProdCode("");
                setErrors({});
            }
        } finally { setIsSubmitting(false); }
    };

    useEffect(() => {
        if (prodCode) {
            fetchNextCode(prodCode);
        } else {
            setNextItemCode("Select Category");
        }
    }, [prodCode]);

    return {
        mounted, nextItemCode, selectedMetal, setSelectedMetal, selectedCarat, setSelectedCarat,
        catSearch, setCatSearch, isCatOpen, setIsCatOpen, workerSearch, setWorkerSearch,
        isWorkerOpen, setIsWorkerOpen, activeModal, setActiveModal, prodDescription, setProdDescription,
        prodCode, setProdCode, imagePreview, setImagePreview, isSubmitting, vals, setVals,
        showStone, setShowStone, showBeads, setShowBeads, showDiamond, setShowDiamond,
        isStoneDirty, isBeadsDirty, isDiamondDirty, filteredCategories, filteredWorkers,
        refs, handleSave, fetchCategories, fetchWorkers, isLoadingCats, isLoadingWorkers, errors
    };
}