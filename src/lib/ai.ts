// AI utility functions for the application
// These call our API routes which can be connected to any AI provider

export async function aiWrite(prompt: string, context?: string): Promise<string> {
  const res = await fetch("/api/ai/write", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, context }),
  });
  const data = await res.json();
  return data.result;
}

export async function aiSummarize(content: string): Promise<string> {
  const res = await fetch("/api/ai/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  return data.result;
}

export async function aiChat(
  message: string,
  context?: string,
  history?: { role: string; content: string }[]
): Promise<string> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context, history }),
  });
  const data = await res.json();
  return data.result;
}

export async function aiAutoTag(content: string, title: string): Promise<{ name: string; color: string }[]> {
  const res = await fetch("/api/ai/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, title }),
  });
  const data = await res.json();
  return data.tags;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
