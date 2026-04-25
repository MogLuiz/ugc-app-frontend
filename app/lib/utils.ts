import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstName(name: string) {
  const t = name.trim().split(/\s+/)[0] ?? "";
  if (!t) return name.trim();
  return t.charAt(0).toLocaleUpperCase("pt-BR") + t.slice(1).toLowerCase();
}
