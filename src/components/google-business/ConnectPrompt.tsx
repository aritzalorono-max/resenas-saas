"use client";

import { MapPin } from "lucide-react";
import type { TFunction } from "./types";

export function ConnectPrompt({ onConnect, t }: { onConnect: () => void; t: TFunction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
        <MapPin size={32} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {t("connectTitle")}
      </h2>
      <p className="text-gray-500 max-w-md mb-8">
        {t("connectDesc")}
      </p>
      <button
        onClick={onConnect}
        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
      >
        <MapPin size={18} />
        {t("connectBtn")}
      </button>
      <p className="mt-4 text-xs text-gray-400">
        {t("connectNote")}
      </p>
    </div>
  );
}
