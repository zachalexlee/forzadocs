"use client";

import { useState, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { useStore } from "@/store/useStore";
import { aiWrite, aiSummarize, aiAutoTag, stripHtml } from "@/lib/ai";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Link,
  Image,
  TableIcon,
  Sparkles,
  Wand2,
  FileText,
  Tags,
  Upload,
  Youtube,
  Globe,
  Loader2,
} from "lucide-react";
import type { TagColor } from "@/types";

interface EditorToolbarProps {
  editor: Editor;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const { activePageId, pages, updatePage, addFile, addEmbed, setPageTags } = useStore();
  const activePage = pages.find((p) => p.id === activePageId);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [showEmbedMenu, setShowEmbedMenu] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ToolButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? "bg-accent text-white"
          : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );

  const handleAIWrite = async () => {
    if (!aiPrompt.trim() || !activePageId) return;
    setAiLoading(true);
    try {
      const context = editor.getHTML();
      const result = await aiWrite(aiPrompt, stripHtml(context));
      editor.commands.insertContent(result);
      setAiPrompt("");
      setShowAIMenu(false);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAISummarize = async () => {
    if (!activePageId) return;
    setAiLoading(true);
    try {
      const content = editor.getHTML();
      const result = await aiSummarize(content);
      editor.commands.insertContent("<hr>" + result);
    } finally {
      setAiLoading(false);
      setShowAIMenu(false);
    }
  };

  const handleAutoTag = async () => {
    if (!activePageId || !activePage) return;
    setAiLoading(true);
    try {
      const content = editor.getHTML();
      const tags = await aiAutoTag(content, activePage.title);
      const newTags = tags.map((t) => ({
        id: crypto.randomUUID(),
        name: t.name,
        color: t.color as TagColor,
      }));
      setPageTags(activePageId, newTags);
    } finally {
      setAiLoading(false);
      setShowAIMenu(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !activePageId) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      addFile(activePageId, {
        name: file.name,
        size: file.size,
        type: file.type,
        url,
      });

      if (file.type.startsWith("image/")) {
        editor.commands.setImage({ src: url, alt: file.name });
      }
    });

    e.target.value = "";
  };

  const handleAddEmbed = () => {
    if (!embedUrl.trim() || !activePageId) return;

    const youtubeMatch = embedUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );

    if (youtubeMatch) {
      addEmbed(activePageId, { type: "youtube", url: embedUrl, title: "YouTube Video" });
    } else {
      addEmbed(activePageId, { type: "website", url: embedUrl, title: embedUrl });
    }

    setEmbedUrl("");
    setShowEmbedMenu(false);
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="border-b border-border bg-surface px-4 py-1.5 flex items-center gap-0.5 flex-wrap relative">
      {/* Text formatting */}
      <ToolButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Inline code"
      >
        <Code size={16} />
      </ToolButton>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Headings */}
      <ToolButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 size={16} />
      </ToolButton>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Lists & blocks */}
      <ToolButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <List size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Numbered list"
      >
        <ListOrdered size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        active={editor.isActive("taskList")}
        title="Task list"
      >
        <CheckSquare size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Quote"
      >
        <Quote size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Divider"
      >
        <Minus size={16} />
      </ToolButton>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Media */}
      <ToolButton
        onClick={() => {
          const url = prompt("Enter link URL:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        active={editor.isActive("link")}
        title="Link"
      >
        <Link size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => {
          const url = prompt("Enter image URL:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        title="Image from URL"
      >
        <Image size={16} />
      </ToolButton>
      <ToolButton onClick={addTable} title="Insert table">
        <TableIcon size={16} />
      </ToolButton>

      {/* File upload */}
      <ToolButton onClick={() => fileInputRef.current?.click()} title="Upload file">
        <Upload size={16} />
      </ToolButton>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Embed menu */}
      <div className="relative">
        <ToolButton
          onClick={() => {
            setShowEmbedMenu(!showEmbedMenu);
            setShowAIMenu(false);
          }}
          title="Embed content"
        >
          <Globe size={16} />
        </ToolButton>
        {showEmbedMenu && (
          <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg p-3 w-80 z-50 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Youtube size={16} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                Embed YouTube or Website
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="Paste URL here..."
                className="flex-1 px-3 py-1.5 rounded-md bg-background border border-border text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
                onKeyDown={(e) => e.key === "Enter" && handleAddEmbed()}
              />
              <button
                onClick={handleAddEmbed}
                className="px-3 py-1.5 rounded-md bg-accent text-white text-sm hover:bg-accent-hover"
              >
                Embed
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-border mx-1" />

      {/* AI Features */}
      <div className="relative">
        <button
          onClick={() => {
            setShowAIMenu(!showAIMenu);
            setShowEmbedMenu(false);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
            showAIMenu
              ? "bg-accent text-white"
              : "text-accent hover:bg-accent-light"
          }`}
          title="AI Features"
        >
          <Sparkles size={14} />
          <span className="font-medium">AI</span>
        </button>

        {showAIMenu && (
          <div className="absolute top-full right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg p-3 w-80 z-50 animate-fade-in">
            {/* AI Write */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 size={14} className="text-accent" />
                <span className="text-sm font-medium text-text-primary">AI Write</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="What should I write about?"
                  className="flex-1 px-3 py-1.5 rounded-md bg-background border border-border text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
                  onKeyDown={(e) => e.key === "Enter" && handleAIWrite()}
                />
                <button
                  onClick={handleAIWrite}
                  disabled={aiLoading}
                  className="px-3 py-1.5 rounded-md bg-accent text-white text-sm hover:bg-accent-hover disabled:opacity-50"
                >
                  {aiLoading ? <Loader2 size={14} className="animate-spin" /> : "Write"}
                </button>
              </div>
            </div>

            <div className="border-t border-border pt-2 space-y-1">
              <button
                onClick={handleAISummarize}
                disabled={aiLoading}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary disabled:opacity-50"
              >
                <FileText size={14} />
                {aiLoading ? "Summarizing..." : "Summarize this page"}
              </button>
              <button
                onClick={handleAutoTag}
                disabled={aiLoading}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary disabled:opacity-50"
              >
                <Tags size={14} />
                {aiLoading ? "Tagging..." : "Auto-tag this page"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
