"use client";
import { useState } from "react";
import {
  ThumbsUp,
  Heart,
  Flame,
  Laugh,
  Frown,
  Angry,
  Eye,
  HelpCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";

// реакції + кольори + початкові кількості (для демо)
const reactions = [
  { icon: ThumbsUp, label: "Like", color: "#3b82f6", count: 12 },
  { icon: Heart, label: "Love", color: "#ef4444", count: 8 },
  { icon: Flame, label: "Hot", color: "#f97316", count: 5 },
  { icon: Laugh, label: "Funny", color: "#eab308", count: 9 },
  { icon: Frown, label: "Sad", color: "#64748b", count: 3 },
  { icon: Angry, label: "Angry", color: "#dc2626", count: 4 },
  { icon: Sparkles, label: "Clap", color: "#a855f7", count: 7 },
  { icon: Eye, label: "View", color: "#06b6d4", count: 20 },
  { icon: HelpCircle, label: "Think", color: "#0ea5e9", count: 2 },
  { icon: CheckCircle, label: "100", color: "#16a34a", count: 10 },
];

const NewsPost = ({ item, onRead }) => {
  const [activeReaction, setActiveReaction] = useState(null);
  const [reactionCounts, setReactionCounts] = useState(
    reactions.reduce((acc, r) => ({ ...acc, [r.label]: r.count }), {})
  );

  const handleReaction = (label) => {
    setActiveReaction((prev) => {
      // якщо клікаєш повторно — скасовує реакцію
      if (prev === label) {
        return null;
      }
      return label;
    });

    // оновлюємо лічильник
    setReactionCounts((prev) => {
      const newCounts = { ...prev };
      if (activeReaction === label) {
        // якщо зняв реакцію
        newCounts[label] = Math.max(0, newCounts[label] - 1);
      } else {
        // поставив реакцію
        newCounts[label] = (newCounts[label] || 0) + 1;
      }
      return newCounts;
    });

    onRead?.();
  };

  return (
    <article className="bg-[#efefef] rounded-2xl p-6 shadow-sm transition-all duration-200">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h2>

      {/* Summary */}
      <div className="text-[16px] max-w-none text-gray-900 leading-relaxed tracking-wide mb-5 font-serif">
        {item.shortText ? (
          item.shortText.split(". ").map((line, idx) => (
            <p key={idx} className="mb-2">
              {line.trim()}
              {line.endsWith(".") ? "" : "."}
            </p>
          ))
        ) : (
          <p className="text-gray-500 italic">Ingen tekst tilgængelig</p>
        )}
      </div>

      {/* Meta info */}
      <div className="flex items-center justify-between text-sm text-gray-700 pt-3 mb-3">
        <span className="flex flex-wrap items-center gap-1">
          <span>{new Date(item.pubDate).toLocaleString("da-DK")}</span>
          <span>·</span>
          <span className="font-semibold">{item.source}</span>
          <span>·</span>
          <span className="italic">{item.category}</span>
        </span>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 font-medium underline-offset-2 hover:underline"
          onClick={onRead}
        >
          Læs mere
        </a>
      </div>

      {/* Reactions */}
      <div className="mt-3 flex flex-wrap gap-2">
        {reactions.map(({ icon: Icon, label, color }) => {
          const isActive = activeReaction === label;
          const count = reactionCounts[label] || 0;

          return (
            <button
              key={label}
              onClick={() => handleReaction(label)}
              style={
                isActive
                  ? { borderColor: color, backgroundColor: `${color}20` }
                  : {}
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-200 ${
                isActive
                  ? "scale-105 text-gray-900"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:scale-105"
              }`}
            >
              <Icon
                size={18}
                style={{
                  color: isActive ? color : "#374151",
                  transition: "color 0.2s",
                }}
              />
              <span
                className={`text-[12px] font-medium ${
                  isActive ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {label}
              </span>
              <span className="text-[12px] text-gray-500 font-medium">
                · {count}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
};

export default NewsPost;
