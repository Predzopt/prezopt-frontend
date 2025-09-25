import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const btnStyle =
  "border-main/50 relative flex h-11 origin-center items-center gap-2 rounded-[10px] border px-4 py-3.5 opacity-100 shadow-[inset_0_0_16px_0_rgb(55,8,150)] will-change-auto [background:linear-gradient(rgba(20,9,43,0.51)_0%,rgba(20,9,43,0.51)_50%,rgba(20,9,43,0.51)_100%)_rgba(20,9,43,0.51)] hover:shadow-[inset_0_0_16px_0_rgb(95,35,217)] after:pointer-events-none after:absolute after:top-0 after:left-0 after:box-border after:h-full after:w-full after:rounded-[inherit] after:content-['']";

export const btnStyle2 =
  'h-11 rounded-[10px] px-4 py-3.5 opacity-100 shadow-[inset_0_0.6px_0.6px_-1.58px_rgba(255,255,255,0.894),inset_0_2.28px_2.28px_-3.16px_rgba(255,255,255,0.745),inset_0_10px_10px_-4.75px_rgba(255,255,255,0.05)] backdrop-blur-[5px] duration-300 will-change-auto [background:linear-gradient(rgba(28,28,28,0.1)_0%,rgba(18,18,18,0.2)_100%)_rgba(0,0,0,0)] hover:shadow-[inset_0_1px_16px_0_rgb(255,255,255,0.4)] hover:bg-transparent hover:text-white';
