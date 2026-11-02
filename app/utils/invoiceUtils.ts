import type { DetailItem } from "./types";

export const getDetailsArray = (
  details: DetailItem | DetailItem[] | undefined | null
): DetailItem[] => {
  if (!details) return [];
  return Array.isArray(details) ? details : [details];
};

export const sumDetailsWeight = (
  details: DetailItem | DetailItem[] | undefined | null
): number =>
  getDetailsArray(details).reduce(
    (total, item) => total + (Number(item?.weight) || 0),
    0
  );

export const sumDetailsPrice = (
  details: DetailItem | DetailItem[] | undefined | null
): number =>
  getDetailsArray(details).reduce(
    (total, item) => total + (Number(item?.price) || 0),
    0
  );

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
