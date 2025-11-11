"use client";
import { useState, useEffect } from "react";
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

const reactions = [
  { icon: ThumbsUp, label: "Like", color: "#3b82f6", count: 0 },
  { icon: Heart, label: "Love", color: "#ef4444", count: 0 },
  { icon: Flame, label: "Hot", color: "#f97316", count: 0 },
  { icon: Laugh, label: "Funny", color: "#eab308", count: 0 },
  { icon: Frown, label: "Sad", color: "#64748b", count: 0 },
  { icon: Angry, label: "Angry", color: "#dc2626", count: 0 },
  { icon: Sparkles, label: "Clap", color: "#a855f7", count: 0 },
  { icon: Eye, label: "View", color: "#06b6d4", count: 0 },
  { icon: HelpCircle, label: "Think", color: "#0ea5e9", count: 0 },
  { icon: CheckCircle, label: "100%", color: "#16a34a", count: 0 },
];

interface NewsPostProps {
  item: any;
  onRead?: () => void;
}

// 🔹 Додаємо тип для об'єкта лічильників
type ReactionCounts = Record<string, number>;

const NewsPost = ({ item, onRead }: NewsPostProps) => {
  const [activeReaction, setActiveReaction] = useState<string | null>(null);

  // ✅ Типізований об’єкт
  const [reactionCounts, setReactionCounts] = useState<ReactionCounts>(
    reactions.reduce(
      (acc, r) => ({ ...acc, [r.label]: r.count }),
      {} as ReactionCounts
    )
  );

  const [isRead, setIsRead] = useState(false);

  const markAsRead = () => {
    if (!isRead) {
      setIsRead(true);
      onRead?.();
    }
  };

  const handleReaction = (label: string) => {
    setActiveReaction((prev) => (prev === label ? null : label));

    setReactionCounts((prev) => {
      const newCounts = { ...prev };
      if (activeReaction === label) {
        newCounts[label] = Math.max(0, newCounts[label] - 1);
      } else {
        newCounts[label] = (newCounts[label] || 0) + 1;
      }
      return newCounts;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          markAsRead();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const el = document.getElementById(`news-${item.id}`);
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [item.id]);

  return (
    <article
      id={`news-${item.id}`}
      className={`bg-[#efefef] rounded-2xl p-6 shadow-sm transition-all duration-200 ${
        isRead ? "opacity-85" : "opacity-100"
      }`}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h2>

      <div className="text-[16px] text-gray-900 leading-relaxed tracking-wide mb-5 font-serif">
        {item.shortText ? (
          item.shortText.split(". ").map((line: string, idx: number) => (
            <p key={idx} className="mb-2">
              {line.trim()}
              {line.endsWith(".") ? "" : "."}
            </p>
          ))
        ) : (
          <p className="text-gray-500 italic">Ingen tekst tilgængelig</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-700 pt-3 mb-3">
        <span className="flex flex-wrap items-center gap-1">
          <span>{new Date(item.pubDate).toLocaleString("da-DK")}</span>
          <span>·</span>
          <span className="font-semibold">{item.source}</span>
          <span>·</span>
          <span className="italic">{item.classified}</span>
        </span>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 font-medium underline-offset-2 hover:underline"
          onClick={markAsRead}
        >
          Læs mere
        </a>
      </div>

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
