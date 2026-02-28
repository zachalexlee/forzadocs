"use client";

import { useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Editor from "@/components/editor/Editor";
import AIChat from "@/components/ai/AIChat";
import { useStore } from "@/store/useStore";

export default function Home() {
  const { pages, activePageId, setActivePage } = useStore();

  // Set first page as active on mount if none selected
  useEffect(() => {
    if (!activePageId && pages.length > 0) {
      setActivePage(pages[0].id);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Editor />
      <AIChat />
    </div>
  );
}
