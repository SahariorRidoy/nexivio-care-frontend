"use client";

import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  label?: string;
  message?: string;
  variant?: "floating" | "inline";
  className?: string;
}

export default function WhatsAppButton({
  label = "WhatsApp",
  message = "হ্যালো, আমাকে সেবা সম্পর্কে জানাতে চাই।",
  variant = "inline",
  className,
}: WhatsAppButtonProps) {
  const { whatsapp } = useSettings();
  const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center",
          "rounded-full bg-[#25d366] text-white shadow-xl",
          "hover:bg-[#20ba5a] transition-colors",
          className
        )}
      >
        {/* WhatsApp logo SVG */}
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.735 5.474 2.02 7.775L0 32l8.469-2.222A15.929 15.929 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.773-1.854l-.487-.289-5.027 1.318 1.342-4.897-.317-.502A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.273-9.987c-.397-.2-2.352-1.16-2.717-1.293-.364-.133-.63-.2-.895.2-.265.4-1.028 1.293-1.26 1.56-.232.267-.464.3-.862.1-.397-.2-1.677-.618-3.195-1.972-1.18-1.054-1.977-2.355-2.21-2.754-.232-.4-.025-.616.175-.815.18-.178.397-.464.596-.696.2-.232.265-.4.397-.664.133-.265.067-.497-.033-.697-.1-.2-.895-2.156-1.227-2.952-.322-.775-.648-.67-.895-.682-.232-.011-.497-.014-.762-.014a1.46 1.46 0 0 0-1.06.497c-.364.4-1.39 1.36-1.39 3.315s1.423 3.847 1.622 4.113c.2.265 2.8 4.275 6.782 5.993.948.41 1.688.655 2.265.838.952.303 1.818.26 2.502.158.763-.113 2.352-.962 2.683-1.89.332-.928.332-1.723.232-1.89-.1-.166-.364-.265-.762-.464z"/>
        </svg>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg bg-[#25d366] px-4 py-2",
        "text-sm font-medium text-white hover:bg-[#20ba5a] transition-colors",
        className
      )}
    >
      <svg viewBox="0 0 32 32" width="16" height="16" fill="white">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.824.735 5.474 2.02 7.775L0 32l8.469-2.222A15.929 15.929 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.273 19.346c-.397-.2-2.352-1.16-2.717-1.293-.364-.133-.63-.2-.895.2-.265.4-1.028 1.293-1.26 1.56-.232.267-.464.3-.862.1-.397-.2-1.677-.618-3.195-1.972-1.18-1.054-1.977-2.355-2.21-2.754-.232-.4-.025-.616.175-.815.18-.178.397-.464.596-.696.2-.232.265-.4.397-.664.133-.265.067-.497-.033-.697-.1-.2-.895-2.156-1.227-2.952-.322-.775-.648-.67-.895-.682-.232-.011-.497-.014-.762-.014a1.46 1.46 0 0 0-1.06.497c-.364.4-1.39 1.36-1.39 3.315s1.423 3.847 1.622 4.113c.2.265 2.8 4.275 6.782 5.993.948.41 1.688.655 2.265.838.952.303 1.818.26 2.502.158.763-.113 2.352-.962 2.683-1.89.332-.928.332-1.723.232-1.89-.1-.166-.364-.265-.762-.464z"/>
      </svg>
      {label}
    </a>
  );
}
