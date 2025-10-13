import React from "react";

export default function EmojiPanel({
  title = "Pick an Emoji",
  categories = ["Smileys", "Animals", "Food", "Activities", "Travel", "Objects", "Symbols"],
  activeCategory = "Smileys",
  onCategoryChange,      // optional: (cat) => void
  emojis = ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","😘","🥰","😗","😙","🥲","🤔","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😖","😫","😩","🥺","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","😇","🤠","🤡","🤥"],
  onEmojiClick,          // optional: (emoji) => void
  className = "",
}) {
  return (
    <div className={`w-80 bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg border border-gray-600 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-600">
        <div className="flex items-center px-4 overflow-x-auto">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange?.(cat)}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 transition-colors ${
                  isActive
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-gray-400 hover:text-indigo-400"
                }`}
                title={cat}
                aria-pressed={isActive}
              >
                <span className="text-xs font-bold">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 h-64 overflow-y-auto">
        <div className="grid grid-cols-8 gap-2 text-2xl">
          {emojis.map((ch, idx) => (
            <button
              key={`${activeCategory}-${idx}`}
              type="button"
              className="rounded-lg p-1.5 hover:bg-indigo-600/20 transition-colors"
              onClick={() => onEmojiClick?.(ch)}
              title={ch}
              aria-label={ch}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}