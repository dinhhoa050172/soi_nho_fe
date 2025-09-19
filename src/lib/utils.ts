import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterOperationType } from "@chax-at/prisma-filter-common";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

type SortOrder = "asc" | "desc";

export type SearchFilter = {
  key: string;
  type: FilterOperationType;
  value: any;
};

export type OrderFilter = {
  field: string;
  dir: SortOrder;
};
