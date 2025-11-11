"use client";
import { useState } from "react";
import Link from "next/link";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          ...(mode === "register" ? { name } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Authentication failed");

      // ✅ Якщо API повертає токен — зберігаємо його
      if (data.token) {
        localStorage.setItem("token", data.token);
        // Можеш також встановити cookie (якщо хочеш SSR авторизацію)
        // document.cookie = `token=${data.token}; path=/; max-age=604800;`;
      }

      // ✅ Можна зберегти користувача в localStorage (якщо потрібно)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // ✅ Перенаправлення після успішного логіну
      window.location.href = "/";
    } catch (err: unknown) {
  console.error("Auth error:", err);
  if (err instanceof Error) {
    setError(err.message);
  } else if (typeof err === "string") {
    setError(err);
  } else {
    setError("Der opstod en fejl ved login/registrering.");
  }
} finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {mode === "register" ? "Opret en konto" : "Velkommen tilbage"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Navn</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border px-3 text-gray-600 mb-1 py-2 outline-none focus:ring-2 focus:ring-[#5F6560] transition"
                placeholder="Indtast dit navn"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-gray-600 mb-1 outline-none focus:ring-2 focus:ring-[#5F6560] transition"
              placeholder="din@email.dk"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Adgangskode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none text-gray-600 mb-1 focus:ring-2 focus:ring-[#5F6560] transition"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#5F6560] text-white py-2 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? "Vent venligst..."
              : mode === "register"
              ? "Opret konto"
              : "Log ind"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          {mode === "register" ? (
            <>
              Har du allerede en konto?{" "}
              <Link href="/login" className="underline text-[#5F6560]">
                Log ind
              </Link>
            </>
          ) : (
            <>
              Har du ikke en konto?{" "}
              <Link href="/register" className="underline text-[#5F6560]">
                Opret konto
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
