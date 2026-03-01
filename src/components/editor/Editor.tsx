"use client";

import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
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
import SlashCommandMenu from "./SlashCommandMenu";
import CoverImage from "./CoverImage";
import Breadcrumbs from "./Breadcrumbs";

interface SlashMenuState {
  query: string;
  from: number;
  to: number;
  coords: { top: number; left: number };
}

export default function Editor() {
  const { activePageId, pages, updatePage } = useStore();
  const activePage = pages.find((p) => p.id === activePageId);
  const [slashMenu, setSlashMenu] = useState<SlashMenuState | null>(null);
  const activePageIdRef = useRef(activePageId);

  useEffect(() => {
    activePageIdRef.current = activePageId;
  }, [activePageId]);

  // Ref to communicate from ProseMirror plugin -> React
  const slashCallbackRef = useRef<(s: SlashMenuState | null) => void>(() => {});
  slashCallbackRef.current = setSlashMenu;

  // Create TipTap extension with a ProseMirror plugin for slash detection.
  // This is THE reliable way — ProseMirror guarantees plugin view.update() runs
  // on every state change.
  const slashExtension = useMemo(
    () =>
      Extension.create({
        name: "slashCommands",
        addProseMirrorPlugins() {
          const callbackRef = slashCallbackRef;
          return [
            new Plugin({
              key: new PluginKey("slashCommands"),
              view() {
                return {
                  update(view) {
                    const { state } = view;
                    const { selection } = state;

                    if (!selection.empty) {
                      callbackRef.current(null);
                      return;
                    }

                    const { $from } = selection;
                    const textContent = $from.parent.textContent;
                    const cursorPos = $from.parentOffset;
                    const textBefore = textContent.slice(0, cursorPos);

                    const match = textBefore.match(/(?:^|\s)\/([\w]*)$/);
                    if (match) {
                      const query = match[1];
                      const from = $from.pos - query.length - 1;
                      const to = $from.pos;

                      try {
                        const coords = view.coordsAtPos(from);
                        callbackRef.current({
                          query,
                          from,
                          to,
                          coords: {
                            top: coords.bottom + 4,
                            left: coords.left,
                          },
                        });
                      } catch {
                        callbackRef.current(null);
                      }
                    } else {
                      callbackRef.current(null);
                    }
                  },
                  destroy() {
                    callbackRef.current(null);
                  },
                };
              },
            }),
          ];
        },
      }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
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
      slashExtension,
    ],
    content: activePage?.content || "",
    onUpdate: ({ editor: ed }) => {
      const pageId = activePageIdRef.current;
      if (pageId) {
        updatePage(pageId, { content: ed.getHTML() });
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
    setSlashMenu(null);
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
    const icons = [
      "📄", "📝", "📋", "📌", "📎", "🗂️", "📑", "🔖", "💡", "⭐",
      "🎯", "🚀", "💻", "🎨", "📊", "🔬", "🏠", "📚", "🎵", "🌍",
    ];
    const current = activePage?.icon || "📄";
    const currentIndex = icons.indexOf(current);
    const nextIcon = icons[(currentIndex + 1) % icons.length];
    updatePage(activePageId, { icon: nextIcon });
  }, [activePageId, activePage?.icon, updatePage]);

  if (!activePage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">📝</div>
          <h2 className="text-2xl font-semibold text-text-primary mb-3">
            Welcome to ForzaDocs
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Your AI-powered workspace for notes, docs, and ideas.
            Select a page from the sidebar or create a new one to get started.
          </p>
          <div className="flex flex-col gap-2 text-left bg-surface rounded-xl p-5 border border-border">
            <div className="text-xs uppercase tracking-wider text-text-muted font-medium mb-1">
              Quick tips
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="text-base">⌨️</span>
              <span>
                Type{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-xs font-mono">
                  /
                </kbd>{" "}
                for the slash command menu
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="text-base">⭐</span>
              <span>Hover pages in the sidebar to favorite them</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="text-base">🎨</span>
              <span>Hover above a page title to add a cover image</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="text-base">✨</span>
              <span>Use the AI button in the toolbar for writing help</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Toolbar */}
      {editor && activePage.type !== "table" && (
        <EditorToolbar editor={editor} />
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Cover Image */}
        <CoverImage pageId={activePage.id} coverImage={activePage.coverImage} />

        <div className="max-w-3xl mx-auto px-8 py-6">
          {/* Breadcrumbs */}
          <Breadcrumbs pageId={activePage.id} />

          {/* Icon & Title */}
          <div className="flex items-start gap-3 mb-1">
            <button
              onClick={handleIconChange}
              className="text-5xl hover:bg-surface-hover rounded-xl p-1.5 transition-colors mt-0.5 active:scale-95"
              title="Click to change icon"
            >
              {activePage.icon}
            </button>
            <input
              type="text"
              value={activePage.title}
              onChange={handleTitleChange}
              placeholder="Untitled"
              className="text-4xl font-bold bg-transparent outline-none w-full text-text-primary placeholder:text-text-muted pt-2"
            />
          </div>

          {/* Tags */}
          <div className="ml-1">
            <TagBar />
          </div>

          {/* Editor or Table View */}
          <div className="mt-2 relative">
            {activePage.type === "table" ? (
              <TableView />
            ) : (
              <>
                <EditorContent
                  editor={editor}
                  className="min-h-[400px]"
                />
                {slashMenu && editor && (
                  <SlashCommandMenu
                    editor={editor}
                    query={slashMenu.query}
                    from={slashMenu.from}
                    to={slashMenu.to}
                    coords={slashMenu.coords}
                    onClose={() => setSlashMenu(null)}
                    onSelect={() => setSlashMenu(null)}
                  />
                )}
              </>
            )}
          </div>

          {/* Embeds Section */}
          {activePage.embeds.length > 0 && <EmbedSection />}

          {/* Files Section */}
          {activePage.files.length > 0 && <FileSection />}
        </div>
      </div>
    </div>
  );
}
