"use client";
import { useState } from "react";
import Link from "next/link";

export default function AuthForm({ mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/auth/${mode === "register" ? "register" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            ...(mode === "register" ? { name } : {}),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "auth_error");

      if (data.user && data.token) {
        localStorage.setItem("token", data.token);
      }

      window.location.href = "/";
    } catch (err) {
      setError(err?.message || "Der opstod en fejl ved login/registrering.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 ">
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
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#5F6560] transition"
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
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#5F6560] transition"
              placeholder="din@email.dk"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Adgangskode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#5F6560] transition"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

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
