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

const reactions = [
  { icon: ThumbsUp, label: "Like" },
  { icon: Heart, label: "Love" },
  { icon: Flame, label: "Hot" },
  { icon: Laugh, label: "Funny" },
  { icon: Frown, label: "Sad" },
  { icon: Angry, label: "Angry" },
  { icon: Sparkles, label: "Clap" },
  { icon: Eye, label: "View" },
  { icon: HelpCircle, label: "Think" },
  { icon: CheckCircle, label: "100" },
];

const NewsPost = ({ item, onRead }) => {
  const [activeReaction, setActiveReaction] = useState(null);

  const handleReaction = (label) => {
    setActiveReaction(label);
    onRead?.();
  };

  return (
    <article className="bg-[#efefef] rounded-2xl p-6 shadow-sm">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h2>

      {/* Summary text */}
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
      <div className="flex items-center justify-between text-sm text-gray-700 pt-3">
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
  {/*     <div className="mt-5 flex flex-wrap gap-2">
        {reactions.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => handleReaction(label)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border text-[6px] transition-all duration-200 
              ${
                activeReaction === label
                  ? "border-gray-600 bg-gray-100 scale-105"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:scale-105"
              }`}
          >
            <Icon size={18} />
            <span className="text-[12px]">{label}</span>
          </button>
        ))}
      </div> */}
    </article>
  );
};

export default NewsPost;
