"use client";

import { useEffect, useState } from "react";

interface Props {
  rate: number; // 0–100
}

export function RingChart({ rate }: Props) {
  const [animated, setAnimated] = useState(false);
  const r       = 40;
  const stroke  = 7;
  const nr      = r - stroke / 2;
  const circ    = 2 * Math.PI * nr;
  const offset  = circ * (1 - (animated ? rate / 100 : 0));

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={r * 2}
        height={r * 2}
        style={{ transform: "rotate(-90deg)" }}
        aria-label={`${rate}% positivo`}
      >
        <circle
          cx={r} cy={r} r={nr}
          fill="none"
          stroke="#dcfce7"
          strokeWidth={stroke}
        />
        <circle
          cx={r} cy={r} r={nr}
          fill="none"
          stroke="#16a34a"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-bold text-brand-700 leading-none">{rate}%</span>
        <span className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">positivo</span>
      </div>
    </div>
  );
}
