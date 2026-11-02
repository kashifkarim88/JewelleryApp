import type { CartItem, ProcessedCartItem, PageFinancialSummary } from "./types";
import { sumDetailsPrice, sumDetailsWeight } from "./invoiceUtils";

export const processCartItems = (cart: CartItem[]): ProcessedCartItem[] =>
  cart.map((item) => {
    const netW = Number(item.netWeight) || 0;
    const wasteW =
      item.wastageGram !== undefined &&
        item.wastageGram !== null &&
        item.wastageGram !== ""
        ? Number(item.wastageGram) || 0
        : (netW * (Number(item.wastagePercent) || 0)) / 100;

    const grossMetalWeight = netW + wasteW;
    const stonePrice =
      sumDetailsPrice(item.stoneDetails) +
      sumDetailsPrice(item.diamondDetails) +
      sumDetailsPrice(item.beadDetails);
    const itemTotal = Number(item.peritemTotal ?? item.itemTotal) || 0;
    const absoluteMetalPrice = itemTotal - stonePrice;
    const structuralAccentsWeight =
      sumDetailsWeight(item.diamondDetails) +
      sumDetailsWeight(item.stoneDetails) +
      sumDetailsWeight(item.beadDetails);

    return {
      ...item,
      netW,
      wasteW,
      grossMetalWeight,
      stonePrice,
      absoluteMetalPrice,
      structuralAccentsWeight,
    };
  });

export const paginateCartItems = (
  items: ProcessedCartItem[],
  itemsPerPage = 2
): ProcessedCartItem[][] => {
  const pages: ProcessedCartItem[][] = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }
  return pages;
};

export const calculatePageFinancialSummaries = (
  pages: ProcessedCartItem[][],
  advance: number,
  discount: number
): PageFinancialSummary[] => {
  let remainingAdvance = Math.max(Number(advance) || 0, 0);
  let remainingDiscount = Math.max(Number(discount) || 0, 0);

  return pages.map((pageItems) => {
    const pageTotalAmount = pageItems.reduce(
      (sum, item) => sum + (Number(item.peritemTotal || item.itemTotal) || 0),
      0
    );
    const pageAdvance = Math.min(remainingAdvance, pageTotalAmount);
    remainingAdvance -= pageAdvance;

    const amountAfterAdvance = Math.max(pageTotalAmount - pageAdvance, 0);
    const pageDiscount = Math.min(remainingDiscount, amountAfterAdvance);
    remainingDiscount -= pageDiscount;

    const pageNetBalance = Math.floor(
      Math.max(amountAfterAdvance - pageDiscount, 0)
    );

    return {
      pageTotalAmount,
      pageAdvance,
      pageDiscount,
      pageNetBalance,
      remainingAdvance,
      remainingDiscount,
    };
  });
};
