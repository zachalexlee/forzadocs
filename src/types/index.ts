export interface Page {
  id: string;
  title: string;
  content: string;
  icon: string;
  coverImage?: string;
  isFavorite?: boolean;
  tags: Tag[];
  parentId: string | null;
  children: string[];
  createdAt: string;
  updatedAt: string;
  type: PageType;
  files: FileAttachment[];
  embeds: Embed[];
  tableData?: TableData;
}

export type PageType = "note" | "table" | "board";

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
}

export type TagColor = "blue" | "green" | "purple" | "orange" | "pink";

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Embed {
  id: string;
  type: "youtube" | "website";
  url: string;
  title?: string;
}

export interface TableData {
  columns: TableColumn[];
  rows: TableRow[];
}

export interface TableColumn {
  id: string;
  name: string;
  type: "text" | "number" | "select" | "date" | "checkbox";
  options?: string[];
}

export interface TableRow {
  id: string;
  cells: Record<string, string | number | boolean>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIAction {
  type: "write" | "edit" | "summarize" | "chat" | "tag";
  prompt: string;
  context?: string;
}
