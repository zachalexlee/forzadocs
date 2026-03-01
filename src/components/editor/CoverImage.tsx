"use client";

import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { useStore } from "@/store/useStore";

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  "linear-gradient(135deg, #0c0c0c 0%, #434343 100%)",
  "linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)",
  "linear-gradient(135deg, #2d1b69 0%, #6c63ff 100%)",
  "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
];

interface CoverImageProps {
  pageId: string;
  coverImage?: string;
}

export default function CoverImage({ pageId, coverImage }: CoverImageProps) {
  const { updatePage } = useStore();
  const [showPicker, setShowPicker] = useState(false);

  if (!coverImage) {
    return (
      <div className="group relative">
        <div className="h-2" />
        <button
          onClick={() => setShowPicker(true)}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 absolute top-2 left-24 px-2.5 py-1 rounded-md text-xs text-text-muted hover:bg-surface-hover hover:text-text-secondary transition-all"
        >
          <ImageIcon size={12} />
          Add cover
        </button>
        {showPicker && (
          <CoverPicker
            onSelect={(cover) => {
              updatePage(pageId, { coverImage: cover });
              setShowPicker(false);
            }}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        className="h-52 w-full transition-all"
        style={{ background: coverImage }}
      />
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 absolute bottom-3 right-4 transition-opacity">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="px-3 py-1.5 rounded-md bg-black/50 backdrop-blur-sm text-xs text-white/80 hover:text-white border border-white/10 transition-colors"
        >
          Change cover
        </button>
        <button
          onClick={() => updatePage(pageId, { coverImage: undefined })}
          className="p-1.5 rounded-md bg-black/50 backdrop-blur-sm text-white/80 hover:text-white border border-white/10 transition-colors"
        >
          <X size={12} />
        </button>
      </div>
      {showPicker && (
        <CoverPicker
          onSelect={(cover) => {
            updatePage(pageId, { coverImage: cover });
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

function CoverPicker({
  onSelect,
  onClose,
}: {
  onSelect: (cover: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 mb-12 bg-surface border border-border rounded-xl shadow-2xl p-4 z-50 animate-fade-in w-[340px]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-text-primary">
            Gallery
          </span>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <p className="text-[11px] text-text-muted mb-2 uppercase tracking-wider font-medium">
          Color & Gradient
        </p>
        <div className="grid grid-cols-4 gap-2">
          {COVER_GRADIENTS.map((gradient, i) => (
            <button
              key={i}
              onClick={() => onSelect(gradient)}
              className="h-12 rounded-lg border border-border hover:border-accent transition-colors hover:scale-105 active:scale-95"
              style={{ background: gradient }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
