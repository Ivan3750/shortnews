"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  id: number;
  name: string;
  email: string;
  exp: number;
}

interface UserDashboardData {
  readCount: number;
  userName: string;
  userEmail: string;
}

const levels = [
  { level: 1, threshold: 0, title: "Nybegynder" },
  { level: 2, threshold: 250, title: "Opdagelsesrejsende" },
  { level: 3, threshold: 750, title: "Journalist" },
  { level: 4, threshold: 1500, title: "Redaktør" },
  { level: 5, threshold: 2500, title: "Medie-Mester" },
];

const UserDashboard = () => {
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Отримуємо користувача з токену + завантажуємо його дані
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      fetchUserData(decoded.id, token, decoded.name, decoded.email);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      setLoading(false);
    }
  }, []);

  // 🔹 Запит до API (отримати кількість прочитаних новин)
  const fetchUserData = async (
    userId: number,
    token: string,
    name: string,
    email: string
  ) => {
    try {
      const res = await fetch(`/api/read`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to fetch");

      setData({
        readCount: json.readCount,
        userName: name,
        userEmail: email,
      });
    } catch (e) {
      console.error("Error loading user data:", e);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Логіка рівнів
  const getCurrentLevel = (count: number) => {
    const achievedLevels = levels.filter((l) => count >= l.threshold);
    const currentLevel = achievedLevels.slice(-1)[0] || levels[0];
    const nextLevel = levels.find((l) => l.level === currentLevel.level + 1);

    let progress = 1;
    if (nextLevel) {
      progress =
        (count - currentLevel.threshold) /
        (nextLevel.threshold - currentLevel.threshold);
      progress = Math.min(Math.max(progress, 0), 1);
    }

    return { currentLevel, nextLevel, progress };
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // або /, залежно від маршруту
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
        Indlæser brugerdata...
      </div>
    );

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <p>Du er ikke logget ind.</p>
        <a
          href="/login"
          className="mt-3 text-gray-900 underline hover:text-gray-700"
        >
          Log ind her
        </a>
      </div>
    );

  const { currentLevel, nextLevel, progress } = getCurrentLevel(data.readCount);

  return (
    <div className="w-screen min-h-[80vh] bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-8 flex flex-col gap-8">
        {/* --- Профіль --- */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center text-3xl font-semibold text-white">
              {data.userName[0]}
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-800">
                {data.userName}
              </p>
              <p className="text-gray-500 text-sm">{data.userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-full bg-gray-700 text-white font-medium hover:bg-gray-800 transition"
          >
            Log ud
          </button>
        </div>

        {/* --- Статистика --- */}
        <div className="flex flex-col sm:flex-row justify-around items-center gap-6">
          <div className="text-center">
            <p className="text-gray-600 text-base">Læste nyheder</p>
            <p className="text-2xl font-bold text-gray-800">
              {data.readCount}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-base">Nuværende niveau</p>
            <p className="text-2xl font-bold text-gray-800">
              {currentLevel.title}
            </p>
          </div>
        </div>

        {/* --- Прогрес бар --- */}
        {nextLevel && (
          <div className="w-full">
            <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden shadow-inner">
              <div
                className="h-5 bg-gray-700 transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-sm mt-2 text-center">
              {nextLevel.threshold - data.readCount} nyheder til næste niveau (
              {nextLevel.title})
            </p>
          </div>
        )}

        {/* --- Рівні --- */}
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          {levels.map((l) => (
            <div
              key={l.level}
              className={`px-4 py-2 rounded-full font-medium border transition-all duration-300 ${
                data.readCount >= l.threshold
                  ? "bg-gray-200 border-gray-400 text-gray-800 shadow-md"
                  : "bg-gray-100 border-gray-300 text-gray-500"
              }`}
            >
              {l.title}
            </div>
          ))}
        </div>

        {/* --- Повідомлення --- */}
        <div className="text-center mt-6 text-gray-600">
          <p>Fortsæt med at læse nyheder for at stige i niveau!</p>
          <p>Hver ny læst artikel tæller mod dit næste niveau.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
