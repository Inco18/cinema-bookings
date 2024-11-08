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
