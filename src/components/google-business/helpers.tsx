"use client";

import { useState } from "react";
import { Star, Copy, Check } from "lucide-react";

export function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}
        />
      ))}
    </span>
  );
}

export function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
        ${active
          ? "bg-gray-900 text-white"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
    >
      {children}
    </button>
  );
}

export function CopyButton({ text, copyLabel, copiedLabel }: { text: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const el = document.createElement("textarea");
          el.value = text;
          el.style.cssText = "position:fixed;opacity:0";
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          document.body.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
