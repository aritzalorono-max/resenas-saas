export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">⭐</span>
            <span className="text-2xl font-bold text-brand-700">ReseñasYa</span>
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
