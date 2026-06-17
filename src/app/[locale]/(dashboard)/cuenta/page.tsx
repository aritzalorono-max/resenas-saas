"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User, Lock, LogOut, Trash2, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CuentaPage() {
  const t = useTranslations("cuenta");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState<string>("email");
  const [loadingUser, setLoadingUser] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const confirmWord = t("deleteConfirmWord");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? "");
        const p = user.app_metadata?.provider ?? "email";
        setProvider(p);
      }
      setLoadingUser(false);
    }
    load();
  }, []);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 8) {
      setPasswordError(t("errorPasswordShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t("errorPasswordMatch"));
      return;
    }

    setPasswordLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(t("passwordUpdated"));
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  async function handleLogout() {
    setLogoutLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== confirmWord) return;
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setDeleteError(body.error ?? t("errorDeleteAccount"));
        return;
      }
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      setDeleteError(t("errorDeleteAccount"));
    } finally {
      setDeleteLoading(false);
    }
  }

  const isOAuth = provider !== "email";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      {/* Access information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-brand-600" />
          </div>
          <h2 className="font-semibold text-gray-900">{t("accessInfo")}</h2>
        </div>

        {loadingUser ? (
          <div className="h-6 bg-gray-100 rounded animate-pulse w-48" />
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{t("email")}</p>
              <p className="text-gray-800 font-medium">{email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{t("accessMethod")}</p>
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-lg ${
                isOAuth ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-700"
              }`}>
                {isOAuth ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    {t("emailPassword")}
                  </>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Change password (email users only) */}
      {!isOAuth && !loadingUser && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-brand-600" />
            </div>
            <h2 className="font-semibold text-gray-900">{t("changePassword")}</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("newPassword")}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder={t("newPasswordPlaceholder")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("confirmPasswordLabel")}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              />
            </div>

            {passwordError && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">
                {passwordSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition"
            >
              {passwordLoading ? t("updatingPassword") : t("updatePassword")}
            </button>
          </form>
        </div>
      )}

      {/* Sign out */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5 text-gray-500" />
          </div>
          <h2 className="font-semibold text-gray-900">{t("logout")}</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">{t("logoutDesc")}</p>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          {t("logout")}
        </button>
      </div>

      {/* Delete account */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="font-semibold text-red-700">{t("deleteAccount")}</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">{t("deleteDesc")}</p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium px-5 py-2.5 rounded-lg transition border border-red-200"
        >
          <Trash2 className="w-4 h-4" />
          {t("deleteBtn")}
        </button>
      </div>

      {/* Sign-out modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5 text-gray-600" aria-hidden="true" />
              </div>
              <h3 id="logout-modal-title" className="text-lg font-bold text-gray-900">{t("logoutModalTitle")}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">{t("logoutModalDesc")}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex-1 bg-gray-800 hover:bg-gray-900 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
              >
                {logoutLoading ? t("loggingOut") : t("logoutConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" aria-hidden="true" />
              </div>
              <h3 id="delete-modal-title" className="text-lg font-bold text-gray-900">{t("deleteModalTitle")}</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {t.rich("deleteModalDesc", { strong: (c) => <strong key="dmd">{c}</strong> })}
            </p>

            <p className="text-sm text-gray-700 mb-2 font-medium">
              {t.rich("deleteConfirmLabel", {
                code: (c) => <span key="dcl" className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-red-700">{c}</span>,
              })}
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={confirmWord}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent mb-4 font-mono"
            />

            {deleteError && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); setDeleteError(""); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== confirmWord || deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
              >
                {deleteLoading ? t("deleting") : t("deleteAccountBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
