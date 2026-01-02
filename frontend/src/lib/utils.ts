import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MediaComponentProps } from "@/validation/valSchema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function capitalizeFirstLetter(string: any) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1)
}