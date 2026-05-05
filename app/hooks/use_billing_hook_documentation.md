# 📦 useBilling Hook Documentation

## Overview

`useBilling` is a custom React hook designed to manage a complete billing and cart system for a jewelry or product-based application. It handles customer data, cart operations, pricing calculations, discounts, advances, gold rate-based pricing, and session persistence using `sessionStorage`.

It is intended for dynamic invoice generation systems where product pricing depends on multiple nested components such as stones, diamonds, and beads.

---

# 🧩 Data Structures

## DetailSection
Represents additional product components (stones, diamonds, beads).

```ts
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
```

### Purpose
Used to store nested item components that contribute to final pricing.

---

## CartItem
Represents a single item in the billing cart.

```ts
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
```

---

# ⚙️ Hook: useBilling

## Purpose
Manages full billing lifecycle including:

- Cart state management
- Customer details
- Dynamic pricing calculation
- Discounts and advances
- Session persistence
- API-based item fetching

---

# 🧠 State Management

## Persistent State Loader

```ts
const getSaved = (key: string, fallback: any) => {
    if (typeof window === "undefined") return fallback;
    const saved = sessionStorage.getItem(key);
    try { return saved ? JSON.parse(saved) : fallback; } catch { return fallback; }
};
```

### Purpose
- Loads data from sessionStorage
- Ensures SSR safety
- Provides fallback values

---

## State Variables

| State | Type | Description |
|------|------|-------------|
| customer | object | Customer details |
| goldRate | number | Current gold rate |
| exchangeValue | number | Exchange deduction |
| cart | CartItem[] | Items in cart |
| extraDiscount | number | Global discount |
| advance | number | Global advance |
| itemInput | string | Item code input |
| isFetching | boolean | API loading state |

---

# 💾 Session Persistence

All key states are stored in sessionStorage:

```ts
sessionStorage.setItem('bill_customer', JSON.stringify(customer));
sessionStorage.setItem('bill_goldRate', JSON.stringify(goldRate));
sessionStorage.setItem('bill_exchangeValue', JSON.stringify(exchangeValue));
sessionStorage.setItem('bill_cart', JSON.stringify(cart));
sessionStorage.setItem('bill_extraDiscount', JSON.stringify(extraDiscount));
sessionStorage.setItem('bill_advance', JSON.stringify(advance));
```

### Purpose
- Prevents data loss on refresh
- Maintains billing session continuity

---

# 📊 Computed Values

## Item Discounts Sum
```ts
const itemDiscountsSum = useMemo(() =>
    cart.reduce((sum, item) => sum + (Number(item.discount) || 0), 0),
[cart]);
```

## Item Advances Sum
```ts
const itemAdvancesSum = useMemo(() =>
    cart.reduce((sum, item) => sum + (Number(item.advance) || 0), 0),
[cart]);
```

---

# 💰 Pricing Logic

## Addons Calculation
```ts
const calculateAddons = (item: CartItem) => {
    const stonesPrice = (item.stoneDetails || []).reduce((sum, s) => sum + (Number(s.price) || 0), 0);
    const diamondsPrice = (item.diamondDetails || []).reduce((sum, d) => sum + (Number(d.price) || 0), 0);
    const beadsPrice = Number(item.beadDetails?.price) || 0;
    return stonesPrice + diamondsPrice + beadsPrice;
};
```

---

## Base Price Calculation
```ts
const calculateItemBasePrice = (item: CartItem) => {
    const ratePerGram = (goldRate || 0) / 11.664;
    const totalWeight = Number(item.netWeight || 0) +
        (Number(item.wastagePercent || 0) * Number(item.netWeight || 0) / 100);

    return (totalWeight * ratePerGram)
        + (Number(item.making) || 0)
        + calculateAddons(item);
};
```

### Formula
Base Price = (Weight + Wastage) × Gold Rate + Making + Addons

---

## Subtotal
```ts
const subTotal = useMemo(() =>
    cart.reduce((a, b) => a + calculateItemBasePrice(b), 0),
[cart, goldRate]);
```

---

## Final Total
```ts
const finalTotal =
    subTotal
    - itemDiscountsSum
    - extraDiscount
    - exchangeValue
    - itemAdvancesSum
    - advance;
```

---

## Item Display Price
```ts
const calculateItemPrice = (item: CartItem) => {
    const base = calculateItemBasePrice(item);
    const final = base - Number(item.discount || 0) - Number(item.advance || 0);
    return final > 0 ? final : 0;
};
```

---

# 🌐 API Integration

## Fetch Item
```ts
const res = await fetch(`/api/stocks?itemCode=${query}`);
```

### Flow
1. User enters item code
2. API fetches product
3. Item is added to cart if not exists
4. Ensures nested arrays are initialized

---

# ✏️ Cart Operations

## Update Item Detail
Updates top-level or nested fields.

## Update Nested Detail
Updates stone/diamond arrays by index.

## Remove Item
Removes item from cart.

## Clear Session
Clears sessionStorage and reloads page.

---

# 📤 Hook Output

The hook returns:

- State variables (customer, cart, rates)
- Setters
- Pricing functions
- Computed totals
- Cart manipulation functions

---

# 🧾 Business Logic Summary

### Pricing Includes:
- Gold rate-based calculation
- Wastage percentage
- Making charges
- Stones, diamonds, beads

### Deductions Include:
- Item discounts
- Global discounts
- Exchange value
- Item advances
- Global advance

---

# 🚀 Strengths

- Fully dynamic pricing system
- Persistent session state
- Supports nested product structures
- Real-time calculations
- API-driven cart population

---

# ⚠️ Improvements (Suggested)

- Convert to `useReducer` for scalability
- Add currency formatting layer
- Add unit tests for pricing logic
- Optimize memoization of base calculations
- Backend validation for financial integrity

---

# 📌 Conclusion

`useBilling` is a complete billing engine designed for jewelry or high-precision product pricing systems. It combines dynamic pricing, nested item structures, and persistent state management into a single reusable hook.

