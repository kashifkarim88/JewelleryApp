export interface ClientProfile {
  name: string;
  phone: string;
  seller?: string;
}

export interface DetailItem {
  weight?: string | number;
  name?: string;
  price?: string | number;
}

export interface CartItem {
  id: string;
  itemCode: string;
  productCode?: string;
  categoryName: string;
  carat: string;
  purity?: string | number;
  metal: string;
  netWeight: number;
  wastagePercent: number;
  making: number;
  discount?: number;
  advance?: number;
  diamondDetails?: DetailItem[] | null;
  stoneDetails?: DetailItem[] | null;
  beadDetails?: DetailItem | DetailItem[] | null;
  peritemTotal?: number;
  itemTotal?: string | number;
  stonesTotal?: string | number;
  stonePrice?: string | number;
  wastageGram?: string | number;
  imageUrl?: string;
}

export interface ProcessedCartItem extends CartItem {
  netW: number;
  wasteW: number;
  grossMetalWeight: number;
  stonePrice: number;
  absoluteMetalPrice: number;
  structuralAccentsWeight: number;
}

export interface PageFinancialSummary {
  pageTotalAmount: number;
  pageAdvance: number;
  pageDiscount: number;
  pageNetBalance: number;
  remainingAdvance: number;
  remainingDiscount: number;
}
