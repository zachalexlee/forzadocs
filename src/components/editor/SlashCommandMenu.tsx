"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Editor } from "@tiptap/react";
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
} from "lucide-react";

interface SlashCommand {
  title: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
  command: (editor: Editor) => void;
}

const commands: SlashCommand[] = [
  {
    title: "Text",
    description: "Just start writing with plain text.",
    icon: <Type size={18} />,
    keywords: ["text", "paragraph", "plain", "p"],
    command: (editor) => {
      editor.chain().focus().setParagraph().run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    icon: <Heading1 size={18} />,
    keywords: ["heading", "h1", "title", "big"],
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    icon: <Heading2 size={18} />,
    keywords: ["heading", "h2", "subtitle", "medium"],
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    icon: <Heading3 size={18} />,
    keywords: ["heading", "h3", "small"],
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bulleted list.",
    icon: <List size={18} />,
    keywords: ["bullet", "list", "unordered", "ul"],
    command: (editor) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    icon: <ListOrdered size={18} />,
    keywords: ["numbered", "list", "ordered", "ol"],
    command: (editor) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    icon: <CheckSquare size={18} />,
    keywords: ["todo", "task", "check", "checkbox"],
    command: (editor) => {
      editor.chain().focus().toggleTaskList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    icon: <Quote size={18} />,
    keywords: ["quote", "blockquote", "callout"],
    command: (editor) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
  {
    title: "Callout",
    description: "Make writing stand out.",
    icon: <MessageSquare size={18} />,
    keywords: ["callout", "info", "warning", "tip", "note"],
    command: (editor) => {
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
    keywords: ["divider", "hr", "line", "separator"],
    command: (editor) => {
      editor.chain().focus().setHorizontalRule().run();
    },
  },
  {
    title: "Code Block",
    description: "Capture a code snippet.",
    icon: <Code2 size={18} />,
    keywords: ["code", "codeblock", "snippet", "pre"],
    command: (editor) => {
      editor.chain().focus().toggleCodeBlock().run();
    },
  },
  {
    title: "Table",
    description: "Add a simple table.",
    icon: <TableIcon size={18} />,
    keywords: ["table", "grid", "spreadsheet"],
    command: (editor) => {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
  },
  {
    title: "Image",
    description: "Upload or embed with a link.",
    icon: <Image size={18} />,
    keywords: ["image", "picture", "photo", "img"],
    command: (editor) => {
      const url = prompt("Enter image URL:");
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },
];

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

  const filteredCommands = commands.filter((cmd) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.keywords.some((k) => k.includes(q))
    );
  });

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

  if (filteredCommands.length === 0) {
    return (
      <div
        ref={menuRef}
        className="slash-menu fixed z-50 bg-surface border border-border rounded-xl shadow-2xl py-2 w-72"
        style={{ top: coords.top, left: coords.left }}
      >
        <p className="px-3 py-2 text-sm text-text-muted">No results</p>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="slash-menu fixed z-50 bg-surface border border-border rounded-xl shadow-2xl py-1 w-72 max-h-80 overflow-y-auto"
      style={{ top: coords.top, left: coords.left }}
    >
      <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-text-muted font-medium">
        Basic blocks
      </div>
      {filteredCommands.map((cmd, index) => (
        <button
          key={cmd.title}
          ref={(el) => { itemRefs.current[index] = el; }}
          onClick={() => executeCommand(index)}
          onMouseEnter={() => setSelectedIndex(index)}
          className={`flex items-center gap-3 w-full px-3 py-1.5 text-left transition-colors ${
            index === selectedIndex
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
      ))}
    </div>
  );
}
