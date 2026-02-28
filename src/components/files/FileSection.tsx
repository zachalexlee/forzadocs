"use client";

import { useStore } from "@/store/useStore";
import { File, Image, Film, Music, FileText, Trash2, Download } from "lucide-react";

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <Image size={16} className="text-blue-400" />;
  if (type.startsWith("video/")) return <Film size={16} className="text-purple-400" />;
  if (type.startsWith("audio/")) return <Music size={16} className="text-green-400" />;
  if (type.includes("pdf") || type.includes("document"))
    return <FileText size={16} className="text-orange-400" />;
  return <File size={16} className="text-text-secondary" />;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function FileSection() {
  const { activePageId, pages, removeFile } = useStore();
  const activePage = pages.find((p) => p.id === activePageId);

  if (!activePage || activePage.files.length === 0) return null;

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
        <File size={16} />
        Attached Files ({activePage.files.length})
      </h3>
      <div className="grid gap-2">
        {activePage.files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface border border-border hover:border-border-light transition-colors group"
          >
            {getFileIcon(file.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate">{file.name}</p>
              <p className="text-xs text-text-muted">{formatSize(file.size)}</p>
            </div>
            <div className="hidden group-hover:flex items-center gap-1">
              <a
                href={file.url}
                download={file.name}
                className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-primary"
                title="Download"
              >
                <Download size={14} />
              </a>
              <button
                onClick={() => activePageId && removeFile(activePageId, file.id)}
                className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-error"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
