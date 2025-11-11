"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewsPost from "@/app/components/NewsPost";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  id: number;
  name: string;
  email: string;
  exp: number;
}

const categories = ["Alle", "Politik", "Økonomi", "Sport", "Miljø", "Teknologi"];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [readNewsIds, setReadNewsIds] = useState<string[]>([]);
  const [lastReadIndex, setLastReadIndex] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);

  // --- Decode userId from token ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      setUserId(decoded.id);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
    }
  }, []);

  // --- Fetch news ---
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/news");
        const data = await res.json();
        const sorted = data.news.sort(
          (a: any, b: any) =>
            new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        );
        setNewsData(sorted);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // --- Fetch read news ---
  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchReadNews = async () => {
      try {
        const res = await fetch(`/api/read`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReadNewsIds(data.readNews || []);
        setLastReadIndex((data.readNews?.length || 0) - 1);
      } catch (e) {
        console.error("Error fetching read news:", e);
      }
    };
    fetchReadNews();
  }, [userId]);

  // --- Mark news as read ---
  const handleRead = async (id: string, index: number) => {
    const idStr = String(id);
    if (readNewsIds.includes(idStr)) return;

    setReadNewsIds((prev) => [...prev, idStr]);
    setLastReadIndex(index);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newsId: idStr }),
      });
      const data = await res.json();

      // Якщо сервер повернув оновлений readCount — можна синхронізувати
      if (data.readNews) {
        setReadNewsIds(data.readNews.map((id: number) => String(id)));
      }
    } catch (e) {
      console.error("Error saving read news:", e);
    }
  };

  const filteredNews =
    selectedCategory === "Alle"
      ? newsData
      : newsData.filter((item) => item.classified === selectedCategory);

  const handleStartFromLast = () => {
    const element = document.getElementById(`news-${lastReadIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-6">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Categories */}
        <div className="sticky top-0 bg-gray-50/80 backdrop-blur-md z-20 py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition cursor-pointer ${
                  selectedCategory === category
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-center">
            <button
              onClick={handleStartFromLast}
              className="px-4 py-1 rounded-md bg-gray-700 text-white text-sm hover:bg-gray-800 transition"
            >
              Start fra sidste ulæste
            </button>
          </div>
        </div>

        {/* News Feed */}
        <section className="flex flex-col gap-4 mt-2">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-2xl p-6 shadow-sm h-[400px]"
                />
              ))}
            </div>
          ) : filteredNews.length > 0 ? (
            <AnimatePresence>
              {filteredNews.map((n, idx) => {
                const isRead = readNewsIds.includes(String(n.id));
                return (
                  <motion.div
                    key={n.id}
                    id={`news-${idx}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`relative transition-all ${
                      isRead ? "opacity-80" : "opacity-100"
                    }`}
                  >
                    <NewsPost item={n} onRead={() => handleRead(n.id, idx)} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <p className="text-center text-gray-500">
              Ingen nyheder i denne kategori.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
