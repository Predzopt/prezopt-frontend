import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const btnStyle =
  "border-main/50 relative flex h-11 origin-center items-center gap-2 rounded-[10px] border px-4 py-3.5 opacity-100 shadow-[inset_0_0_16px_0_rgb(55,8,150)] will-change-auto [background:linear-gradient(rgba(20,9,43,0.51)_0%,rgba(20,9,43,0.51)_50%,rgba(20,9,43,0.51)_100%)_rgba(20,9,43,0.51)] hover:shadow-[inset_0_0_16px_0_rgb(95,35,217)] after:pointer-events-none after:absolute after:top-0 after:left-0 after:box-border after:h-full after:w-full after:rounded-[inherit] after:content-['']";
