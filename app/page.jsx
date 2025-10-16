"use client";
import React, { useState, useEffect } from "react";
import NewsPost from "@/app/components/NewsPost";

const categories = ["Alle", "Politik", "Økonomi", "Sport", "Miljø", "Teknologi"];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [points, setPoints] = useState(0);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch news from backend API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:4000/news");
        const data = await res.json();
        setNewsData(data);
        console.log("Fetched news:", data);
      } catch (err) {
        console.error("Error fetching news:", err);
        setNewsData([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    // Auto-refresh every 5 min
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  const filteredNews =
    selectedCategory === "Alle"
      ? newsData
      : newsData.filter((item) => item.category === selectedCategory);

  const handleRead = () => {
    setPoints((prev) => prev + 10);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-6">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Category Filters */}
        <section className="flex flex-wrap gap-2">
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
        </section>

        {/* Posts */}
        <section className="flex flex-col gap-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading news...</p>
          ) : filteredNews.length > 0 ? (
            filteredNews.map((n, idx) => (
              <NewsPost key={idx} item={n} onRead={handleRead} />
            ))
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
