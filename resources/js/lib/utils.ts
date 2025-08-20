import { User } from "@/types";
import { RoleType } from "@/types/enums";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function hasRole(user: User, role: RoleType) {
    return user?.roles?.some((r) => r.name === role);
}

export const translatedRoles: { [key in RoleType]: string } = {
    admin: "Admin",
    worker: "Pracownik",
    client: "Klient",
};

export function formatTime(time: number) {
    const seconds = time % 60;
    const minutes = Math.floor(time / 60);

    return (
        ("" + minutes).padStart(2, "0") +
        ":" +
        ("" + Math.abs(seconds)).padStart(2, "0")
    );
}

export function formatPrice(price: number | string) {
  if (price === 0 || price === null || price === undefined || price === '') {
    return '0,00 zł';
  }
  if (typeof price === 'string') {
    price = Number(price.replace(',', '.'));
  }
  const formattedPrice = price.toLocaleString('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currency: 'PLN',
    style: 'currency',
  });
  return formattedPrice;
}
