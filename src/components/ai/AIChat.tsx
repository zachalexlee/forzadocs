"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { aiChat, stripHtml } from "@/lib/ai";
import { X, Send, Trash2, Sparkles, Loader2, Bot, User } from "lucide-react";

export default function AIChat() {
  const {
    aiChatOpen,
    toggleAIChat,
    chatMessages,
    addChatMessage,
    clearChat,
    activePageId,
    pages,
  } = useStore();
  const activePage = pages.find((p) => p.id === activePageId);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  if (!aiChatOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    addChatMessage({ role: "user", content: userMessage });
    setLoading(true);

    try {
      const context = activePage ? stripHtml(activePage.content) : undefined;
      const history = chatMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const response = await aiChat(userMessage, context, history);
      addChatMessage({ role: "assistant", content: response });
    } catch {
      addChatMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 border-l border-border bg-surface flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <h2 className="font-semibold text-sm">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-1.5 hover:bg-surface-hover rounded-md text-text-muted hover:text-text-primary"
            title="Clear chat"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={toggleAIChat}
            className="p-1.5 hover:bg-surface-hover rounded-md text-text-muted hover:text-text-primary"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-8">
            <Bot size={32} className="mx-auto mb-3 text-text-muted" />
            <p className="text-sm text-text-secondary mb-1">AI Assistant</p>
            <p className="text-xs text-text-muted">
              Ask me anything about your notes, or get help writing and organizing.
            </p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 animate-fade-in ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-accent"
                  : "bg-surface-hover border border-border"
              }`}
            >
              {msg.role === "user" ? (
                <User size={14} className="text-white" />
              ) : (
                <Bot size={14} className="text-accent" />
              )}
            </div>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-white"
                  : "bg-surface-hover text-text-primary border border-border"
              }`}
            >
              {msg.content.split("\n").map((line, i) => (
                <p key={i} className={i > 0 ? "mt-1" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 animate-fade-in">
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-surface-hover border border-border shrink-0">
              <Bot size={14} className="text-accent" />
            </div>
            <div className="bg-surface-hover border border-border rounded-lg px-3 py-2">
              <Loader2 size={16} className="animate-spin text-accent" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Context indicator */}
      {activePage && (
        <div className="px-4 py-1.5 border-t border-border">
          <p className="text-xs text-text-muted truncate">
            Context: {activePage.icon} {activePage.title || "Untitled"}
          </p>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 bg-background rounded-lg border border-border px-3 py-2 focus-within:border-accent transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything..."
            className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-1 text-accent hover:text-accent-hover disabled:text-text-muted disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
