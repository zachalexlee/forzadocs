"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { X, Plus } from "lucide-react";
import type { TagColor } from "@/types";

const tagColorClasses: Record<TagColor, { bg: string; text: string }> = {
  blue: { bg: "bg-tag-blue", text: "text-tag-text-blue" },
  green: { bg: "bg-tag-green", text: "text-tag-text-green" },
  purple: { bg: "bg-tag-purple", text: "text-tag-text-purple" },
  orange: { bg: "bg-tag-orange", text: "text-tag-text-orange" },
  pink: { bg: "bg-tag-pink", text: "text-tag-text-pink" },
};

export default function TagBar() {
  const { activePageId, pages, addTag, removeTag } = useStore();
  const activePage = pages.find((p) => p.id === activePageId);
  const [showInput, setShowInput] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState<TagColor>("blue");

  if (!activePage) return null;

  const handleAddTag = () => {
    if (!newTagName.trim() || !activePageId) return;
    addTag(activePageId, newTagName.trim(), selectedColor);
    setNewTagName("");
    setShowInput(false);
  };

  const colors: TagColor[] = ["blue", "green", "purple", "orange", "pink"];

  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {activePage.tags.map((tag) => (
        <span
          key={tag.id}
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            tagColorClasses[tag.color]?.bg || tagColorClasses.blue.bg
          } ${tagColorClasses[tag.color]?.text || tagColorClasses.blue.text}`}
        >
          {tag.name}
          <button
            onClick={() => removeTag(activePage.id, tag.id)}
            className="hover:opacity-70"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {showInput ? (
        <div className="flex items-center gap-2 animate-fade-in">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tag name"
            className="px-2 py-0.5 rounded-md bg-background border border-border text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent w-24"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTag();
              if (e.key === "Escape") setShowInput(false);
            }}
            autoFocus
          />
          <div className="flex gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedColor === color ? "border-white" : "border-transparent"
                }`}
                style={{
                  backgroundColor:
                    color === "blue" ? "#3b82f6"
                    : color === "green" ? "#22c55e"
                    : color === "purple" ? "#a855f7"
                    : color === "orange" ? "#f97316"
                    : "#ec4899",
                }}
              />
            ))}
          </div>
          <button
            onClick={handleAddTag}
            className="text-xs text-accent hover:text-accent-hover"
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-text-muted hover:text-text-secondary hover:bg-surface-hover transition-colors"
        >
          <Plus size={12} />
          Add tag
        </button>
      )}
    </div>
  );
}
