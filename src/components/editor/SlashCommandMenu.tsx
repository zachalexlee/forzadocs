"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { Editor } from "@tiptap/react";
import { useStore } from "@/store/useStore";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Code2,
  TableIcon,
  Image,
  MessageSquare,
  Youtube,
  Globe,
  FileText,
  FilePlus,
} from "lucide-react";

interface SlashCommand {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  keywords: string[];
  command: (editor: Editor) => void;
}

interface SlashCommandMenuProps {
  editor: Editor;
  query: string;
  from: number;
  to: number;
  coords: { top: number; left: number };
  onClose: () => void;
  onSelect: () => void;
}

export default function SlashCommandMenu({
  editor,
  query,
  from,
  to,
  coords,
  onClose,
  onSelect,
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { activePageId, createPage, addEmbed, setActivePage } = useStore();

  const commands: SlashCommand[] = useMemo(
    () => [
      // --- Basic blocks ---
      {
        title: "Text",
        description: "Just start writing with plain text.",
        icon: <Type size={18} />,
        category: "Basic blocks",
        keywords: ["text", "paragraph", "plain", "p"],
        command: (editor: Editor) => {
          editor.chain().focus().setParagraph().run();
        },
      },
      {
        title: "Heading 1",
        description: "Big section heading.",
        icon: <Heading1 size={18} />,
        category: "Basic blocks",
        keywords: ["heading", "h1", "title", "big"],
        command: (editor: Editor) => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        },
      },
      {
        title: "Heading 2",
        description: "Medium section heading.",
        icon: <Heading2 size={18} />,
        category: "Basic blocks",
        keywords: ["heading", "h2", "subtitle", "medium"],
        command: (editor: Editor) => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        },
      },
      {
        title: "Heading 3",
        description: "Small section heading.",
        icon: <Heading3 size={18} />,
        category: "Basic blocks",
        keywords: ["heading", "h3", "small"],
        command: (editor: Editor) => {
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        },
      },
      {
        title: "Bullet List",
        description: "Create a simple bulleted list.",
        icon: <List size={18} />,
        category: "Basic blocks",
        keywords: ["bullet", "list", "unordered", "ul"],
        command: (editor: Editor) => {
          editor.chain().focus().toggleBulletList().run();
        },
      },
      {
        title: "Numbered List",
        description: "Create a list with numbering.",
        icon: <ListOrdered size={18} />,
        category: "Basic blocks",
        keywords: ["numbered", "list", "ordered", "ol", "number"],
        command: (editor: Editor) => {
          editor.chain().focus().toggleOrderedList().run();
        },
      },
      {
        title: "To-do List",
        description: "Track tasks with a to-do list.",
        icon: <CheckSquare size={18} />,
        category: "Basic blocks",
        keywords: ["todo", "task", "check", "checkbox"],
        command: (editor: Editor) => {
          editor.chain().focus().toggleTaskList().run();
        },
      },
      {
        title: "Quote",
        description: "Capture a quote.",
        icon: <Quote size={18} />,
        category: "Basic blocks",
        keywords: ["quote", "blockquote"],
        command: (editor: Editor) => {
          editor.chain().focus().toggleBlockquote().run();
        },
      },
      {
        title: "Callout",
        description: "Make writing stand out.",
        icon: <MessageSquare size={18} />,
        category: "Basic blocks",
        keywords: ["callout", "info", "warning", "tip", "note", "highlight"],
        command: (editor: Editor) => {
          editor
            .chain()
            .focus()
            .toggleBlockquote()
            .insertContent("💡 ")
            .run();
        },
      },
      {
        title: "Divider",
        description: "Visually divide blocks.",
        icon: <Minus size={18} />,
        category: "Basic blocks",
        keywords: ["divider", "hr", "line", "separator", "horizontal"],
        command: (editor: Editor) => {
          editor.chain().focus().setHorizontalRule().run();
        },
      },
      {
        title: "Code Block",
        description: "Capture a code snippet.",
        icon: <Code2 size={18} />,
        category: "Basic blocks",
        keywords: ["code", "codeblock", "snippet", "pre"],
        command: (editor: Editor) => {
          editor.chain().focus().toggleCodeBlock().run();
        },
      },

      // --- Media ---
      {
        title: "Image",
        description: "Upload or embed with a link.",
        icon: <Image size={18} />,
        category: "Media",
        keywords: ["image", "picture", "photo", "img", "upload"],
        command: (editor: Editor) => {
          const url = prompt("Enter image URL:");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        },
      },
      {
        title: "YouTube Video",
        description: "Embed a YouTube video.",
        icon: <Youtube size={18} />,
        category: "Media",
        keywords: ["youtube", "video", "embed", "media"],
        command: (_editor: Editor) => {
          const url = prompt("Paste a YouTube URL:");
          if (url && activePageId) {
            addEmbed(activePageId, {
              type: "youtube",
              url,
              title: "YouTube Video",
            });
          }
        },
      },
      {
        title: "Web Bookmark",
        description: "Embed a website link.",
        icon: <Globe size={18} />,
        category: "Media",
        keywords: [
          "website",
          "embed",
          "bookmark",
          "link",
          "web",
          "url",
          "integration",
        ],
        command: (_editor: Editor) => {
          const url = prompt("Paste a website URL:");
          if (url && activePageId) {
            addEmbed(activePageId, {
              type: "website",
              url,
              title: url,
            });
          }
        },
      },
      {
        title: "Table",
        description: "Add a simple table.",
        icon: <TableIcon size={18} />,
        category: "Media",
        keywords: ["table", "grid", "spreadsheet", "database"],
        command: (editor: Editor) => {
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
        },
      },

      // --- Pages ---
      {
        title: "New Sub-page",
        description: "Create a page inside this page.",
        icon: <FilePlus size={18} />,
        category: "Turn into",
        keywords: ["page", "subpage", "create", "new", "child", "nested"],
        command: (_editor: Editor) => {
          if (activePageId) {
            const newId = createPage(activePageId, "note");
            setActivePage(newId);
          }
        },
      },
      {
        title: "New Table Page",
        description: "Create a table database page.",
        icon: <TableIcon size={18} />,
        category: "Turn into",
        keywords: ["table", "database", "page", "create", "spreadsheet"],
        command: (_editor: Editor) => {
          if (activePageId) {
            const newId = createPage(activePageId, "table");
            setActivePage(newId);
          }
        },
      },
      {
        title: "Link to Page",
        description: "Insert a link to another page.",
        icon: <FileText size={18} />,
        category: "Turn into",
        keywords: ["link", "page", "mention", "reference"],
        command: (editor: Editor) => {
          const pageName = prompt("Enter page name to link:");
          if (pageName) {
            editor
              .chain()
              .focus()
              .insertContent(`📄 ${pageName}`)
              .run();
          }
        },
      },
    ],
    [activePageId, createPage, addEmbed, setActivePage]
  );

  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.keywords.some((k) => k.includes(q))
    );
  }, [commands, query]);

  // Group filtered commands by category
  const groupedCommands = useMemo(() => {
    const groups: { category: string; items: SlashCommand[] }[] = [];
    for (const cmd of filteredCommands) {
      const existing = groups.find((g) => g.category === cmd.category);
      if (existing) {
        existing.items.push(cmd);
      } else {
        groups.push({ category: cmd.category, items: [cmd] });
      }
    }
    return groups;
  }, [filteredCommands]);

  const executeCommand = useCallback(
    (index: number) => {
      const command = filteredCommands[index];
      if (!command) return;

      // Delete the slash and query text
      editor.chain().focus().deleteRange({ from, to }).run();

      // Execute the command
      command.command(editor);
      onSelect();
    },
    [editor, filteredCommands, from, to, onSelect]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredCommands.length) % filteredCommands.length
        );
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        executeCommand(selectedIndex);
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    // Capture phase to intercept before TipTap
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [selectedIndex, filteredCommands.length, executeCommand, onClose]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (filteredCommands.length === 0) {
    return (
      <div
        ref={menuRef}
        className="slash-menu fixed z-[100] bg-surface border border-border rounded-xl shadow-2xl py-2 w-72"
        style={{ top: coords.top, left: coords.left }}
      >
        <p className="px-3 py-2 text-sm text-text-muted">No results</p>
      </div>
    );
  }

  let flatIndex = 0;

  return (
    <div
      ref={menuRef}
      className="slash-menu fixed z-[100] bg-surface border border-border rounded-xl shadow-2xl py-1 w-72 max-h-[360px] overflow-y-auto"
      style={{ top: coords.top, left: coords.left }}
    >
      {groupedCommands.map((group) => {
        const groupItems = group.items.map((cmd) => {
          const currentFlatIndex = flatIndex;
          flatIndex++;
          return (
            <button
              key={cmd.title}
              ref={(el) => {
                itemRefs.current[currentFlatIndex] = el;
              }}
              onClick={() => executeCommand(currentFlatIndex)}
              onMouseEnter={() => setSelectedIndex(currentFlatIndex)}
              className={`flex items-center gap-3 w-full px-3 py-1.5 text-left transition-colors ${
                currentFlatIndex === selectedIndex
                  ? "bg-surface-hover text-text-primary"
                  : "text-text-secondary"
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border shrink-0">
                {cmd.icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{cmd.title}</div>
                <div className="text-xs text-text-muted truncate">
                  {cmd.description}
                </div>
              </div>
            </button>
          );
        });

        return (
          <div key={group.category}>
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-text-muted font-medium">
              {group.category}
            </div>
            {groupItems}
          </div>
        );
      })}
    </div>
  );
}
