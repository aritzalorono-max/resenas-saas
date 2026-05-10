"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [googleAccount, setGoogleAccount] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const redirectTo =
      (process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin) +
      "/api/auth/callback?next=/nueva-contrasena";

    const res = await fetch("/api/auth/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, redirectTo }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error al procesar la solicitud. Inténtalo de nuevo.");
      return;
    }

    const data = await res.json();
    if (data.googleAccount) {
      setGoogleAccount(true);
    } else {
      setSent(true);
    }
  }

  if (googleAccount) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Esta cuenta usa Google</h1>
        <p className="text-gray-500 text-sm mb-3 max-w-xs mx-auto">
          La cuenta <strong>{email}</strong> está vinculada a Google y no tiene contraseña propia, por lo que no es posible restablecerla.
        </p>
        <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
          Para acceder, usa el botón <strong>"Continuar con Google"</strong> en la pantalla de inicio de sesión.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
        >
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Revisa tu email</h1>
        <p className="text-gray-500 text-sm mb-3 max-w-xs mx-auto">
          Si existe una cuenta con <strong>{email}</strong>, recibirás un enlace para restablecer tu contraseña en breve.
        </p>
        <p className="text-gray-400 text-xs mb-6 max-w-xs mx-auto">
          Si no ves el email en unos minutos, revisa la carpeta de spam.
        </p>
        <Link href="/login" className="text-sm text-brand-600 font-medium hover:underline">
          ← Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar contraseña</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
            placeholder="tu@email.com"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
        >
          {loading ? "Enviando..." : "Enviar enlace de recuperación"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/login" className="text-brand-600 font-medium hover:underline">
          ← Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}
