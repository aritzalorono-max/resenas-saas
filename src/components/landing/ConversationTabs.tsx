"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Shield, Star, ShoppingBag, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

type Tab = "positive" | "negative" | "incentive" | "ecommerce";

const DURATION = 4500;

const TAB_STYLES: {
  id: Tab;
  activeClass: string;
  inactiveClass: string;
  barColor: string;
  iconClass: string;
}[] = [
  {
    id: "positive",
    activeClass: "bg-green-50 text-green-700 border-green-200",
    inactiveClass: "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700",
    barColor: "bg-green-500",
    iconClass: "text-green-600",
  },
  {
    id: "negative",
    activeClass: "bg-red-50 text-red-600 border-red-200",
    inactiveClass: "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700",
    barColor: "bg-red-500",
    iconClass: "text-red-500",
  },
  {
    id: "incentive",
    activeClass: "bg-amber-50 text-amber-700 border-amber-200",
    inactiveClass: "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700",
    barColor: "bg-amber-500",
    iconClass: "text-amber-500",
  },
  {
    id: "ecommerce",
    activeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    inactiveClass: "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700",
    barColor: "bg-indigo-500",
    iconClass: "text-indigo-500",
  },
];

const TAB_LABELS: Record<Tab, {
  label: "tabPositive" | "tabNegative" | "tabIncentive" | "tabEcommerce";
  sub: "tabPositiveSub" | "tabNegativeSub" | "tabIncentiveSub" | "tabEcommerceSub";
}> = {
  positive:  { label: "tabPositive",  sub: "tabPositiveSub"  },
  negative:  { label: "tabNegative",  sub: "tabNegativeSub"  },
  incentive: { label: "tabIncentive", sub: "tabIncentiveSub" },
  ecommerce: { label: "tabEcommerce", sub: "tabEcommerceSub" },
};

export function ConversationTabs() {
  const t = useTranslations("home");
  const [active, setActive] = useState<Tab>("positive");
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const idx = TAB_STYLES.findIndex((tab) => tab.id === active);
      const next = TAB_STYLES[(idx + 1) % TAB_STYLES.length].id;
      setActive(next);
      setProgressKey((k) => k + 1);
    }, DURATION);
    return () => clearTimeout(timer);
  }, [active, progressKey]);

  const handleClick = (id: Tab) => {
    setActive(id);
    setProgressKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6">

      {/* Tab pills with progress bars */}
      <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full sm:w-auto">
        {TAB_STYLES.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`relative flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5
                px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold border transition overflow-hidden
                ${isActive ? tab.activeClass : tab.inactiveClass}`}
            >
              {tab.id === "positive"  && <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? tab.iconClass : ""}`} />}
              {tab.id === "negative"  && <Shield       className={`w-3.5 h-3.5 shrink-0 ${isActive ? tab.iconClass : ""}`} />}
              {tab.id === "incentive" && <Star         className={`w-3.5 h-3.5 shrink-0 fill-current ${isActive ? tab.iconClass : ""}`} />}
              {tab.id === "ecommerce" && <ShoppingBag  className={`w-3.5 h-3.5 shrink-0 ${isActive ? tab.iconClass : ""}`} />}
              <span>{t(TAB_LABELS[tab.id].label)}</span>
              <span className="hidden sm:inline text-[10px] font-normal opacity-60">{t(TAB_LABELS[tab.id].sub)}</span>

              {/* Progress bar track */}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200" />

              {/* Progress bar fill */}
              {isActive && (
                <ProgressBar key={progressKey} duration={DURATION} colorClass={tab.barColor} />
              )}
            </button>
          );
        })}
      </div>

      {/* Conversation panel */}
      <div className="w-full max-w-sm">
        {active === "positive" && (
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
            <p className="text-[11px] text-gray-400 text-center font-medium uppercase tracking-wide mb-1">{t("convPositiveHeader")}</p>
            <Bubble side="left" border>{t("convPositiveMsg1")}</Bubble>
            <Bubble side="right">{t("convPositiveMsg2")}</Bubble>
            <Bubble side="left" border>{t("convPositiveMsg3")}</Bubble>
            <p className="text-[11px] text-green-600 font-medium text-center pt-1">{t("convPositiveFooter")}</p>
          </div>
        )}

        {active === "negative" && (
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
            <p className="text-[11px] text-gray-400 text-center font-medium uppercase tracking-wide mb-1">{t("convNegativeHeader")}</p>
            <Bubble side="left" border>{t("convNegativeMsg1")}</Bubble>
            <Bubble side="right">{t("convNegativeMsg2")}</Bubble>
            <Bubble side="left" border>{t("convNegativeMsg3")}</Bubble>
            <p className="text-[11px] text-red-500 font-medium text-center pt-1">{t("convNegativeFooter")}</p>
          </div>
        )}

        {active === "incentive" && (
          <div className="bg-amber-50 rounded-2xl p-5 space-y-3 border border-amber-100">
            <p className="text-[11px] text-amber-600 text-center font-medium uppercase tracking-wide mb-1">{t("convIncentiveHeader")}</p>
            <Bubble side="left" borderAmber>{t("convIncentiveMsg1")}</Bubble>
            <Bubble side="right">{t("convIncentiveMsg2")}</Bubble>
            <Bubble side="left" borderAmber>{t("convIncentiveMsg3")}</Bubble>
            <Bubble side="right">{t("convIncentiveMsg4")}</Bubble>
            <Bubble side="left" borderAmber>{t("convIncentiveMsg5")}</Bubble>
            <p className="text-[11px] text-amber-600 font-medium text-center pt-1">{t("convIncentiveFooter")}</p>
          </div>
        )}

        {active === "ecommerce" && (
          <div className="bg-[#e5ddd5] rounded-2xl p-5 space-y-3">
            <p className="text-[11px] text-gray-500 text-center font-medium uppercase tracking-wide mb-1">{t("convEcomHeader")}</p>
            <Bubble side="right">
              <span className="flex items-center gap-2">
                <span className="text-base">📸</span>
                <span>{t("convEcomMsg1")}</span>
              </span>
            </Bubble>
            <div className="flex items-center gap-2 px-1">
              <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs text-gray-500 italic">{t("convEcomVerifying")}</p>
            </div>
            <Bubble side="left" borderIndigo>
              <p className="font-semibold text-green-600 text-xs mb-1.5">✅ {t("convEcomConfirmed")}</p>
              <p className="text-xs text-gray-700 mb-2">{t("convEcomReward")}</p>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 text-center">
                <p className="text-[10px] text-indigo-500 font-medium uppercase tracking-wide">{t("convEcomCodeLabel")}</p>
                <p className="text-base font-extrabold font-mono text-indigo-700 tracking-widest">GRACIAS25</p>
                <p className="text-[10px] text-indigo-400">{t("convEcomCodeDesc")}</p>
              </div>
            </Bubble>
            <Bubble side="right">{t("convEcomMsg2")}</Bubble>
            <p className="text-[11px] text-indigo-500 font-medium text-center pt-1">{t("convEcomFooter")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ duration, colorClass }: { duration: number; colorClass: string }) {
  return (
    <span
      className={`absolute bottom-0 left-0 h-0.5 ${colorClass}`}
      style={{
        animation: `progressFill ${duration}ms linear forwards`,
      }}
    />
  );
}

// ─── Chat bubble ──────────────────────────────────────────────────────────────

function Bubble({
  side, border, borderAmber, borderIndigo, children,
}: {
  side: "left" | "right";
  border?: boolean;
  borderAmber?: boolean;
  borderIndigo?: boolean;
  children: React.ReactNode;
}) {
  if (side === "right") {
    return (
      <div className="flex justify-end">
        <div className="bg-brand-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[260px] text-sm shadow-sm">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className={`rounded-2xl rounded-tl-none px-4 py-3 max-w-[260px] text-sm shadow-sm bg-white ${
        borderIndigo ? "border border-indigo-100" :
        borderAmber  ? "border border-amber-100"  :
        border       ? "border border-gray-100"   : ""
      }`}>
        {children}
      </div>
    </div>
  );
}
