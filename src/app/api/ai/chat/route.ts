import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, context, history } = await req.json();

  const lowerMessage = message.toLowerCase();

  // Smart contextual responses based on user's message and document context
  let result: string;

  if (lowerMessage.includes("summarize") || lowerMessage.includes("summary")) {
    if (context) {
      const plainText = context.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      const sentences = plainText.split(/[.!?]+/).filter((s: string) => s.trim().length > 5);
      result = `Here's a summary of your document:\n\n${sentences.slice(0, 3).join(". ").trim()}.\n\nThe document covers ${sentences.length} key points across approximately ${plainText.split(/\s+/).length} words.`;
    } else {
      result = "I don't see any document content to summarize. Please open a note first, then ask me to summarize it.";
    }
  } else if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
    result = `I can help you with several things:

• **Summarize** your current document — just ask "summarize this"
• **Write content** — tell me what you'd like to write about
• **Brainstorm ideas** — ask me for ideas on any topic
• **Explain concepts** — ask me to explain something
• **Edit suggestions** — ask me how to improve your writing
• **Organize** — ask me to help organize or structure your notes

Just ask naturally and I'll do my best to help!`;
  } else if (lowerMessage.includes("improve") || lowerMessage.includes("edit") || lowerMessage.includes("rewrite")) {
    if (context) {
      result = `Here are some suggestions to improve your document:

1. **Structure**: Consider adding clear headings to break up sections
2. **Clarity**: Some sentences could be made more concise
3. **Details**: Adding specific examples would strengthen your points
4. **Conclusion**: Consider adding a summary or next-steps section

Would you like me to help with any of these specifically?`;
    } else {
      result = "Please open a document first, then I can suggest improvements for it.";
    }
  } else if (lowerMessage.includes("idea") || lowerMessage.includes("brainstorm")) {
    result = `Here are some ideas related to "${message}":

1. Start with a clear problem statement or goal
2. Research existing approaches and what works
3. Identify unique angles or perspectives
4. Create an outline or mind map
5. Draft a rough version without worrying about perfection

Would you like me to dive deeper into any of these?`;
  } else if (context) {
    const wordCount = context.replace(/<[^>]*>/g, " ").split(/\s+/).length;
    result = `I see your document has about ${wordCount} words. Based on your question "${message}", here's my response:

I can help you work with this document. Try asking me to:
- Summarize the content
- Suggest improvements
- Brainstorm related ideas
- Help extend or rewrite sections

What would you like to do?`;
  } else {
    const prevMessages = history?.length || 0;
    result = prevMessages > 0
      ? `Continuing our conversation: "${message}" — that's a great point. Let me help you explore this further. Could you tell me more about what specifically you'd like to accomplish?`
      : `Thanks for your message! I'm your AI assistant in ForzaDocs. I can help you write, edit, summarize, and organize your notes. What would you like to work on?`;
  }

  return NextResponse.json({ result });
}
