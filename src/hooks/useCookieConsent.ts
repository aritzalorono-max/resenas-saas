"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ACCEPT_ALL,
  REJECT_ALL,
  ConsentPreferences,
  StoredConsent,
  getStoredConsent,
  hasValidConsent,
  saveConsent,
} from "@/lib/cookie-consent";

interface UseCookieConsentReturn {
  consent: StoredConsent | null;
  showBanner: boolean;
  showSettings: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  saveCustom: (prefs: ConsentPreferences) => void;
}

export function useCookieConsent(): UseCookieConsentReturn {
  const [consent, setConsent]           = useState<StoredConsent | null>(null);
  const [showBanner, setShowBanner]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted]           = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasValidConsent()) {
      setShowBanner(true);
    } else {
      setConsent(getStoredConsent());
    }
  }, []);

  const apply = useCallback((prefs: ConsentPreferences) => {
    saveConsent(prefs);
    setConsent(getStoredConsent());
    setShowBanner(false);
    setShowSettings(false);
  }, []);

  return {
    consent: mounted ? consent : null,
    showBanner: mounted && showBanner,
    showSettings,
    openSettings:  () => setShowSettings(true),
    closeSettings: () => setShowSettings(false),
    acceptAll:     () => apply(ACCEPT_ALL),
    rejectAll:     () => apply(REJECT_ALL),
    saveCustom:    (prefs) => apply(prefs),
  };
}
