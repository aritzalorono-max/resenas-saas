"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { CookieSettingsModal } from "./CookieSettingsModal";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { REJECT_ALL } from "@/lib/cookie-consent";

export function ManageCookiesButton() {
  const [open, setOpen] = useState(false);
  const { consent, acceptAll, saveCustom } = useCookieConsent();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition underline underline-offset-2"
      >
        <Settings2 className="w-3.5 h-3.5" />
        Gestionar cookies
      </button>

      {open && (
        <CookieSettingsModal
          initialPrefs={consent ?? REJECT_ALL}
          onSave={(prefs) => { saveCustom(prefs); setOpen(false); }}
          onAcceptAll={() => { acceptAll(); setOpen(false); }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
