"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import {
  Plus,
  Search,
  FileText,
  Table,
  ChevronRight,
  ChevronDown,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import type { Page, PageType } from "@/types";

export default function Sidebar() {
  const {
    pages,
    activePageId,
    sidebarOpen,
    searchQuery,
    createPage,
    deletePage,
    setActivePage,
    toggleSidebar,
    toggleAIChat,
    setSearchQuery,
  } = useStore();

  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [showNewMenu, setShowNewMenu] = useState(false);

  const toggleExpanded = (id: string) => {
    setExpandedPages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreate = (type: PageType) => {
    createPage(null, type);
    setShowNewMenu(false);
  };

  const rootPages = pages.filter((p) => !p.parentId);
  const filteredPages = searchQuery
    ? pages.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : rootPages;

  const renderPage = (page: Page, depth: number = 0) => {
    const hasChildren = page.children.length > 0;
    const isExpanded = expandedPages.has(page.id);
    const isActive = activePageId === page.id;
    const childPages = pages.filter((p) => page.children.includes(p.id));

    return (
      <div key={page.id}>
        <div
          className={`group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors ${
            isActive
              ? "bg-surface-active text-text-primary"
              : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => setActivePage(page.id)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(page.id);
              }}
              className="p-0.5 hover:bg-surface-hover rounded shrink-0"
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}

          <span className="shrink-0">{page.icon}</span>
          <span className="truncate flex-1">{page.title || "Untitled"}</span>

          <div className="hidden group-hover:flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                createPage(page.id);
              }}
              className="p-0.5 hover:bg-surface rounded text-text-muted hover:text-text-primary"
              title="Add sub-page"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deletePage(page.id);
              }}
              className="p-0.5 hover:bg-surface rounded text-text-muted hover:text-error"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>{childPages.map((child) => renderPage(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  if (!sidebarOpen) {
    return (
      <div className="flex flex-col items-center py-3 gap-2 border-r border-border bg-surface w-10">
        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-surface-hover rounded-md text-text-secondary hover:text-text-primary"
        >
          <PanelLeftOpen size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-border bg-surface flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        <h1 className="font-semibold text-sm tracking-wide">ForzaDocs</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleAIChat}
            className="p-1.5 hover:bg-surface-hover rounded-md text-text-secondary hover:text-accent"
            title="AI Chat"
          >
            <Sparkles size={16} />
          </button>
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-surface-hover rounded-md text-text-secondary hover:text-text-primary"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-background border border-border text-sm">
          <Search size={14} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Pages list */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {filteredPages.map((page) => renderPage(page))}

        {filteredPages.length === 0 && (
          <p className="text-text-muted text-xs text-center py-4">
            {searchQuery ? "No results found" : "No pages yet"}
          </p>
        )}
      </div>

      {/* New page button */}
      <div className="px-3 py-3 border-t border-border relative">
        {showNewMenu && (
          <div className="absolute bottom-full left-3 mb-1 bg-surface border border-border rounded-lg shadow-lg py-1 w-48 animate-fade-in">
            <button
              onClick={() => handleCreate("note")}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            >
              <FileText size={16} />
              New Note
            </button>
            <button
              onClick={() => handleCreate("table")}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            >
              <Table size={16} />
              New Table
            </button>
          </div>
        )}
        <button
          onClick={() => setShowNewMenu(!showNewMenu)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
        >
          <Plus size={16} />
          New Page
        </button>
      </div>
    </div>
  );
}
