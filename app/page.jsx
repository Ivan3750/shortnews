"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewsPost from "@/app/components/NewsPost";

const categories = ["Alle", "Politik", "Økonomi", "Sport", "Miljø", "Teknologi"];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readNewsIds, setReadNewsIds] = useState([]); // зберігаємо рядки
  const [lastReadIndex, setLastReadIndex] = useState(0);

  // --- Load progress on mount ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem("readNewsIds");
      const savedIndex = localStorage.getItem("lastReadIndex");
      if (saved) {
        // переконатися, що масив рядків
        const parsed = JSON.parse(saved).map((id) => String(id));
        setReadNewsIds(parsed);
      }
      if (savedIndex) setLastReadIndex(Number(savedIndex));
    } catch (e) {
      console.error("Error loading read state:", e);
    }
  }, []);

  useEffect(() => {
    // зберігати рядки в localStorage
    try {
      localStorage.setItem("readNewsIds", JSON.stringify(readNewsIds));
      localStorage.setItem("lastReadIndex", String(lastReadIndex));
    } catch (e) {
      console.error("Error saving read state:", e);
    }
  }, [readNewsIds, lastReadIndex]);

  // --- Fetch news from API ---
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/news");
        const data = await res.json();
      
        // Сортуємо за датою (нові зверху)
        const sorted = data.news.sort(
          (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
        );
        setNewsData(sorted);
      } catch (err) {
        console.error("Error fetching news:", err);
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // кожні 5 хв
    return () => clearInterval(interval);
  }, []);

  // --- Filter by category ---
  const filteredNews =
    selectedCategory === "Alle"
      ? newsData
      : newsData.filter((item) => item.category === selectedCategory);

  // --- Mark news as read ---
  const handleRead = (id, index) => {
    const idStr = String(id); // приведення до рядка
    setReadNewsIds((prev) => {
      if (prev.includes(idStr)) return prev;
      const next = [...prev, idStr];
      console.log("Marked read:", idStr, "total read:", next.length);
      return next;
    });

    // lastReadIndex зберігаємо як індекс у фільтрованому масиві
    // Якщо хочеш зберігати абсолютний індекс у newsData, можна змінити логіку.
    setLastReadIndex(index);
  };

  // --- Scroll to last unread ---
  const handleStartFromLast = () => {
    // lastReadIndex - це індекс у filteredNews
    const element = document.getElementById(`news-${lastReadIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-6">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Sticky Filter Bar */}
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

          {/* Кнопка "Start from last" */}
          {lastReadIndex > 0 && (
            <div className="flex justify-center mt-3">
              <button
                onClick={handleStartFromLast}
                className="text-sm text-blue-600 hover:underline"
              >
                Start fra hvor du stoppede 🔖
              </button>
            </div>
          )}
        </div>

        {/* News Feed */}
        <section className="flex flex-col gap-4 mt-2">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white h-24 rounded-2xl shadow-sm" />
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
                    {/* Позначка прочитаного */}
                    {!isRead && (
                      <span className="absolute top-3 left-3 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm"></span>
                    )}

                    {/* Передаємо onRead як функцію без параметрів; Home на своїй стороні передає id/idx */}
                    <NewsPost
                      item={n}
                      onRead={() => handleRead(n.id, idx)}
                    />
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
