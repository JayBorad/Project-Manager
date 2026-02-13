import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserColorClass(color?: string) {
  const value = (color ?? "").toLowerCase();
  if (value.includes("emerald")) return "bg-emerald-500";
  if (value.includes("violet")) return "bg-violet-500";
  if (value.includes("amber")) return "bg-amber-500";
  if (value.includes("sky")) return "bg-sky-500";
  if (value.includes("rose")) return "bg-rose-500";
  if (value.includes("blue")) return "bg-blue-500";
  if (value.includes("green")) return "bg-green-500";
  if (value.includes("orange")) return "bg-orange-500";
  if (value.includes("red")) return "bg-red-500";
  if (value.includes("zinc")) return "bg-zinc-500";
  return "bg-slate-500";
}
