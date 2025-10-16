"use client";

import { useState, useEffect } from "react";
import {
  Smartphone,
  Mail,
  MessageSquare,
  LogOut,
  User,
  Earth,
  Loader2,
  Star,
  Newspaper,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ShortNewsSettings = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/user", {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) throw new Error("Fetch profile failed");
        const data = await res.json();

        if (!data.error) {
          const storedLang = localStorage.getItem("lang");
          setUser({
            ...data,
            lang: storedLang || data.lang || "DA",
            points: data.points || 0,
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const saveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      if (!data.error) {
        setUser((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setUser((prev) => ({ ...prev, [key]: value }));
    if (key === "lang") {
      localStorage.setItem("lang", value);
    }
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await fetch("/api/user", {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    localStorage.removeItem("token");
    router.push("/login");
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    });
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
          <p className="text-gray-600 font-medium">Indlæser indstillinger...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Ingen bruger fundet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-[1200px] mx-auto p-2">
        {/* --- Profilheader --- */}
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Newspaper className="w-10 h-10 text-[#444]" />
              <div>
                <h2 className="text-xl font-semibold">Din ShortNews-profil</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* --- Points --- */}
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-2xl">
              <Star className="text-yellow-500 w-5 h-5" />
              <span className="text-lg font-bold text-gray-700">
                {user.points || 0} point
              </span>
            </div>
          </div>
        </div>

        {/* --- Profilinformation --- */}
        <div className="bg-white p-6 rounded-xl shadow space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Profiloplysninger</h2>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#444] text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Gemmer..." : "Gem ændringer"}
            </button>
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Fornavn</label>
            <input
              type="text"
              value={user.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">E-mail</label>
            <input
              type="email"
              value={user.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Køn</label>
            <select
              value={user.sex || ""}
              onChange={(e) => handleChange("sex", e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            >
              <option value="">Vælg køn</option>
              <option value="male">Mand</option>
              <option value="female">Kvinde</option>
            </select>
          </div>
        </div>

        {/* --- Notifikationer --- */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4 mt-6">
          <h2 className="text-lg font-semibold">Notifikationer</h2>
          {[
            {
              icon: <Smartphone className="h-4 w-4" />,
              label: "Push-notifikationer",
              key: "pushNotifications",
            },
            {
              icon: <Mail className="h-4 w-4" />,
              label: "E-mail-notifikationer",
              key: "emailNotifications",
            },
            {
              icon: <MessageSquare className="h-4 w-4" />,
              label: "SMS-notifikationer",
              key: "smsNotifications",
            },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
         
            </div>
          ))}
        </div>

        {/* --- Præferencer --- */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4 mt-6">
          <div className="flex gap-5 items-center">
            <Earth className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">Præferencer</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Sprog</label>
              <select
                value={user.lang || "DA"}
                onChange={(e) => handleChange("lang", e.target.value)}
                className="w-full rounded-xl border px-3 py-2"
              >
                <option value="DA">Dansk</option>
                <option value="EN">Engelsk</option>
                <option value="PL">Polsk</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- Konto handlinger --- */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4 mt-6">
          <h2 className="text-lg font-semibold">Konto handlinger</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-white rounded-2xl p-2 font-semibold"
            >
              <LogOut className="h-4 w-4" /> Log ud
            </button>
            <button
              onClick={deleteAccount}
              className="flex items-center gap-2 bg-[#C54B63] rounded-2xl p-2 text-white font-semibold"
            >
              <User className="h-4 w-4" /> Slet konto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortNewsSettings;
