"use client";

import { useStore } from "@/store/useStore";
import { X, ExternalLink, Youtube, Globe } from "lucide-react";

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  return match ? match[1] : null;
}

export default function EmbedSection() {
  const { activePageId, pages, removeEmbed } = useStore();
  const activePage = pages.find((p) => p.id === activePageId);

  if (!activePage || activePage.embeds.length === 0) return null;

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
        <Globe size={16} />
        Embeds ({activePage.embeds.length})
      </h3>
      <div className="space-y-4">
        {activePage.embeds.map((embed) => {
          const youtubeId = embed.type === "youtube" ? getYouTubeId(embed.url) : null;

          return (
            <div
              key={embed.id}
              className="rounded-lg border border-border overflow-hidden bg-surface group relative"
            >
              {/* Remove button */}
              <button
                onClick={() => activePageId && removeEmbed(activePageId, embed.id)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-background/80 backdrop-blur-sm text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove embed"
              >
                <X size={14} />
              </button>

              {embed.type === "youtube" && youtubeId ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={embed.title || "YouTube Video"}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                <div>
                  <div className="aspect-video bg-background">
                    <iframe
                      src={embed.url}
                      title={embed.title || "Embedded Website"}
                      className="w-full h-full"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
                    {embed.type === "youtube" ? (
                      <Youtube size={14} className="text-red-400" />
                    ) : (
                      <Globe size={14} className="text-text-muted" />
                    )}
                    <span className="text-xs text-text-secondary truncate flex-1">
                      {embed.url}
                    </span>
                    <a
                      href={embed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-text-primary"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
