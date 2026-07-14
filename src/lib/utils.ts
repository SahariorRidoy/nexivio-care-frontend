import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Resolve an asset path returned by the backend into a usable URL.
 * Absolute URLs (http/https) and data URIs are returned unchanged;
 * relative `/uploads/...` paths are prefixed with the API origin.
 */
export function assetUrl(path?: string | null): string {
  if (!path) return "";
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
  const origin = api.replace(/\/api(\/v\d+)?\/?$/, "");
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}
