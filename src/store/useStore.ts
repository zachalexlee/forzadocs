import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type {
  Page,
  Tag,
  TagColor,
  ChatMessage,
  FileAttachment,
  Embed,
  TableColumn,
  TableRow,
  PageType,
} from "@/types";

interface AppState {
  pages: Page[];
  activePageId: string | null;
  sidebarOpen: boolean;
  aiChatOpen: boolean;
  chatMessages: ChatMessage[];
  searchQuery: string;

  // Page actions
  createPage: (parentId?: string | null, type?: PageType) => string;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  setActivePage: (id: string | null) => void;
  getActivePage: () => Page | undefined;

  // Sidebar
  toggleSidebar: () => void;

  // AI Chat
  toggleAIChat: () => void;
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChat: () => void;

  // Search
  setSearchQuery: (query: string) => void;

  // Tags
  addTag: (pageId: string, name: string, color: TagColor) => void;
  removeTag: (pageId: string, tagId: string) => void;
  setPageTags: (pageId: string, tags: Tag[]) => void;

  // Files
  addFile: (pageId: string, file: Omit<FileAttachment, "id" | "uploadedAt">) => void;
  removeFile: (pageId: string, fileId: string) => void;

  // Embeds
  addEmbed: (pageId: string, embed: Omit<Embed, "id">) => void;
  removeEmbed: (pageId: string, embedId: string) => void;

  // Table
  addTableColumn: (pageId: string, column: Omit<TableColumn, "id">) => void;
  removeTableColumn: (pageId: string, columnId: string) => void;
  addTableRow: (pageId: string) => void;
  updateTableCell: (
    pageId: string,
    rowId: string,
    columnId: string,
    value: string | number | boolean
  ) => void;
  removeTableRow: (pageId: string, rowId: string) => void;
}

const defaultPage: () => Page = () => ({
  id: uuidv4(),
  title: "Untitled",
  content: "",
  icon: "📄",
  tags: [],
  parentId: null,
  children: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  type: "note",
  files: [],
  embeds: [],
});

export const useStore = create<AppState>((set, get) => ({
  pages: [
    {
      ...defaultPage(),
      title: "Welcome to ForzaDocs",
      content: `<h1>Welcome to ForzaDocs! 🚀</h1><p>Your AI-powered workspace for notes, files, tables, and more.</p><h2>Getting Started</h2><ul><li><strong>Create pages</strong> using the + button in the sidebar</li><li><strong>Rich text editing</strong> with headings, lists, code blocks, and more</li><li><strong>Embed content</strong> from YouTube and websites</li><li><strong>AI features</strong> to help you write, summarize, and organize</li></ul><h2>AI Features</h2><ul><li>✍️ <strong>AI Writing Assistant</strong> — Help draft and edit your notes</li><li>📝 <strong>AI Summarization</strong> — Get summaries of your notes</li><li>💬 <strong>AI Chat</strong> — Chat with AI about your content</li><li>🏷️ <strong>Auto-tagging</strong> — Automatically organize your notes</li></ul><p>Click the ✨ AI button in the toolbar to get started!</p>`,
      icon: "🚀",
    },
  ],
  activePageId: null,
  sidebarOpen: true,
  aiChatOpen: false,
  chatMessages: [],
  searchQuery: "",

  createPage: (parentId = null, type = "note") => {
    const newPage: Page = {
      ...defaultPage(),
      parentId,
      type,
      tableData:
        type === "table"
          ? {
              columns: [
                { id: uuidv4(), name: "Name", type: "text" },
                { id: uuidv4(), name: "Status", type: "select", options: ["Todo", "In Progress", "Done"] },
                { id: uuidv4(), name: "Date", type: "date" },
              ],
              rows: [{ id: uuidv4(), cells: {} }],
            }
          : undefined,
    };
    set((state) => {
      const pages = [...state.pages, newPage];
      if (parentId) {
        const parentIndex = pages.findIndex((p) => p.id === parentId);
        if (parentIndex !== -1) {
          pages[parentIndex] = {
            ...pages[parentIndex],
            children: [...pages[parentIndex].children, newPage.id],
          };
        }
      }
      return { pages, activePageId: newPage.id };
    });
    return newPage.id;
  },

  updatePage: (id, updates) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    })),

  deletePage: (id) =>
    set((state) => {
      const page = state.pages.find((p) => p.id === id);
      if (!page) return state;

      const idsToDelete = new Set<string>();
      const collectChildren = (pageId: string) => {
        idsToDelete.add(pageId);
        const p = state.pages.find((pg) => pg.id === pageId);
        p?.children.forEach(collectChildren);
      };
      collectChildren(id);

      const pages = state.pages
        .filter((p) => !idsToDelete.has(p.id))
        .map((p) =>
          p.id === page.parentId
            ? { ...p, children: p.children.filter((c) => c !== id) }
            : p
        );

      return {
        pages,
        activePageId: state.activePageId === id ? null : state.activePageId,
      };
    }),

  setActivePage: (id) => set({ activePageId: id }),
  getActivePage: () => {
    const state = get();
    return state.pages.find((p) => p.id === state.activePageId);
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  toggleAIChat: () => set((state) => ({ aiChatOpen: !state.aiChatOpen })),
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        { ...message, id: uuidv4(), timestamp: new Date().toISOString() },
      ],
    })),
  clearChat: () => set({ chatMessages: [] }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  addTag: (pageId, name, color) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId
          ? { ...p, tags: [...p.tags, { id: uuidv4(), name, color }] }
          : p
      ),
    })),

  removeTag: (pageId, tagId) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId
          ? { ...p, tags: p.tags.filter((t) => t.id !== tagId) }
          : p
      ),
    })),

  setPageTags: (pageId, tags) =>
    set((state) => ({
      pages: state.pages.map((p) => (p.id === pageId ? { ...p, tags } : p)),
    })),

  addFile: (pageId, file) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId
          ? {
              ...p,
              files: [
                ...p.files,
                { ...file, id: uuidv4(), uploadedAt: new Date().toISOString() },
              ],
            }
          : p
      ),
    })),

  removeFile: (pageId, fileId) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId
          ? { ...p, files: p.files.filter((f) => f.id !== fileId) }
          : p
      ),
    })),

  addEmbed: (pageId, embed) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId
          ? { ...p, embeds: [...p.embeds, { ...embed, id: uuidv4() }] }
          : p
      ),
    })),

  removeEmbed: (pageId, embedId) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId
          ? { ...p, embeds: p.embeds.filter((e) => e.id !== embedId) }
          : p
      ),
    })),

  addTableColumn: (pageId, column) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId && p.tableData
          ? {
              ...p,
              tableData: {
                ...p.tableData,
                columns: [...p.tableData.columns, { ...column, id: uuidv4() }],
              },
            }
          : p
      ),
    })),

  removeTableColumn: (pageId, columnId) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId && p.tableData
          ? {
              ...p,
              tableData: {
                ...p.tableData,
                columns: p.tableData.columns.filter((c) => c.id !== columnId),
              },
            }
          : p
      ),
    })),

  addTableRow: (pageId) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId && p.tableData
          ? {
              ...p,
              tableData: {
                ...p.tableData,
                rows: [...p.tableData.rows, { id: uuidv4(), cells: {} }],
              },
            }
          : p
      ),
    })),

  updateTableCell: (pageId, rowId, columnId, value) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId && p.tableData
          ? {
              ...p,
              tableData: {
                ...p.tableData,
                rows: p.tableData.rows.map((r) =>
                  r.id === rowId
                    ? { ...r, cells: { ...r.cells, [columnId]: value } }
                    : r
                ),
              },
            }
          : p
      ),
    })),

  removeTableRow: (pageId, rowId) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId && p.tableData
          ? {
              ...p,
              tableData: {
                ...p.tableData,
                rows: p.tableData.rows.filter((r) => r.id !== rowId),
              },
            }
          : p
      ),
    })),
}));
