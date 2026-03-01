"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Editor from "@/components/editor/Editor";
import AIChat from "@/components/ai/AIChat";
import { useStore } from "@/store/useStore";

export default function Home() {
  const { pages, activePageId, setActivePage } = useStore();
  const [mounted, setMounted] = useState(false);

  // Wait for client-side hydration (zustand persist)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set first page as active on mount if none selected
  useEffect(() => {
    if (mounted && !activePageId && pages.length > 0) {
      setActivePage(pages[0].id);
    }
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">📝</div>
          <p className="text-text-muted text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Editor />
      <AIChat />
    </div>
  );
}
