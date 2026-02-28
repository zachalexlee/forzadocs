"use client";

import { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { useStore } from "@/store/useStore";
import EditorToolbar from "./EditorToolbar";
import TagBar from "./TagBar";
import FileSection from "../files/FileSection";
import EmbedSection from "../embeds/EmbedSection";
import TableView from "../tables/TableView";

export default function Editor() {
  const { activePageId, pages, updatePage } = useStore();
  const activePage = pages.find((p) => p.id === activePageId);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start writing, or type '/' for commands...",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
    ],
    content: activePage?.content || "",
    onUpdate: ({ editor }) => {
      if (activePageId) {
        updatePage(activePageId, { content: editor.getHTML() });
      }
    },
    editorProps: {
      attributes: {
        class: "tiptap prose prose-invert max-w-none focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && activePage) {
      const currentContent = editor.getHTML();
      if (currentContent !== activePage.content) {
        editor.commands.setContent(activePage.content || "");
      }
    }
  }, [activePageId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (activePageId) {
        updatePage(activePageId, { title: e.target.value });
      }
    },
    [activePageId, updatePage]
  );

  const handleIconChange = useCallback(() => {
    if (!activePageId) return;
    const icons = ["📄", "📝", "📋", "📌", "📎", "🗂️", "📑", "🔖", "💡", "⭐", "🎯", "🚀", "💻", "🎨", "📊", "🔬"];
    const current = activePage?.icon || "📄";
    const currentIndex = icons.indexOf(current);
    const nextIcon = icons[(currentIndex + 1) % icons.length];
    updatePage(activePageId, { icon: nextIcon });
  }, [activePageId, activePage?.icon, updatePage]);

  if (!activePage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Welcome to ForzaDocs
          </h2>
          <p className="text-text-secondary text-sm max-w-md">
            Select a page from the sidebar or create a new one to get started.
            Use AI features to help you write, summarize, and organize your notes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Toolbar */}
      {editor && <EditorToolbar editor={editor} />}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          {/* Icon & Title */}
          <div className="flex items-start gap-3 mb-4">
            <button
              onClick={handleIconChange}
              className="text-4xl hover:bg-surface-hover rounded-lg p-1 transition-colors mt-1"
              title="Click to change icon"
            >
              {activePage.icon}
            </button>
            <input
              type="text"
              value={activePage.title}
              onChange={handleTitleChange}
              placeholder="Untitled"
              className="text-3xl font-bold bg-transparent outline-none w-full text-text-primary placeholder:text-text-muted"
            />
          </div>

          {/* Tags */}
          <TagBar />

          {/* Editor or Table View */}
          {activePage.type === "table" ? (
            <TableView />
          ) : (
            <EditorContent editor={editor} className="min-h-[300px]" />
          )}

          {/* Embeds Section */}
          {activePage.embeds.length > 0 && <EmbedSection />}

          {/* Files Section */}
          {activePage.files.length > 0 && <FileSection />}
        </div>
      </div>
    </div>
  );
}
