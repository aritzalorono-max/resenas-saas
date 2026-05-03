import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-[11px] font-extrabold text-white tracking-tight leading-none select-none">RY</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ReseñasYa</span>
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
