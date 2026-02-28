import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, context } = await req.json();

  // Built-in AI writing assistant - generates helpful content
  // In production, connect this to your preferred AI API (OpenAI, Anthropic, etc.)
  const contextInfo = context ? `\n\nContext from the document:\n${context}` : "";

  const result = generateWritingResponse(prompt, contextInfo);

  return NextResponse.json({ result });
}

function generateWritingResponse(prompt: string, context: string): string {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("email")) {
    return `<p>Subject: ${prompt}</p>
<p>Dear [Recipient],</p>
<p>I hope this message finds you well. I am writing to ${prompt.toLowerCase()}.</p>
<p>I would appreciate your prompt attention to this matter. Please don't hesitate to reach out if you have any questions or need further clarification.</p>
<p>Best regards,<br/>[Your Name]</p>`;
  }

  if (lowerPrompt.includes("blog") || lowerPrompt.includes("article")) {
    return `<h1>${prompt}</h1>
<p><em>A comprehensive guide to understanding and implementing key concepts.</em></p>
<h2>Introduction</h2>
<p>In today's fast-paced world, ${prompt.toLowerCase()} has become increasingly important. This article explores the key aspects and provides actionable insights.</p>
<h2>Key Points</h2>
<ul>
<li><strong>Point 1:</strong> Start with a clear understanding of the fundamentals</li>
<li><strong>Point 2:</strong> Build upon established best practices</li>
<li><strong>Point 3:</strong> Iterate and improve continuously</li>
</ul>
<h2>Conclusion</h2>
<p>By following these guidelines, you can effectively ${prompt.toLowerCase()} and achieve meaningful results.</p>`;
  }

  if (lowerPrompt.includes("list") || lowerPrompt.includes("ideas")) {
    return `<h2>${prompt}</h2>
<ul>
<li>Idea 1: Research and analyze current trends</li>
<li>Idea 2: Identify key stakeholders and their needs</li>
<li>Idea 3: Develop a phased implementation plan</li>
<li>Idea 4: Create feedback loops for continuous improvement</li>
<li>Idea 5: Document learnings and share knowledge</li>
</ul>
<p><em>Tip: Prioritize these ideas based on impact and feasibility.</em></p>`;
  }

  if (lowerPrompt.includes("meeting") || lowerPrompt.includes("agenda")) {
    return `<h2>Meeting Notes: ${prompt}</h2>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Attendees:</strong> [Add attendees]</p>
<h3>Agenda</h3>
<ol>
<li>Review of previous action items</li>
<li>Discussion: ${prompt}</li>
<li>Next steps and action items</li>
</ol>
<h3>Notes</h3>
<p>[Add meeting notes here]</p>
<h3>Action Items</h3>
<ul>
<li>[ ] Action item 1 — Owner: [Name] — Due: [Date]</li>
<li>[ ] Action item 2 — Owner: [Name] — Due: [Date]</li>
</ul>`;
  }

  return `<h2>${prompt}</h2>
<p>${context ? "Based on the existing content, here is a draft:" : "Here is a draft to get you started:"}</p>
<p>${prompt}. This is an AI-generated starting point that you can customize and expand upon. Consider the following aspects:</p>
<ul>
<li><strong>Context:</strong> Set the stage and provide necessary background</li>
<li><strong>Details:</strong> Elaborate on key points with specific examples</li>
<li><strong>Action:</strong> Include clear next steps or calls to action</li>
</ul>
<p><em>Edit this content to match your voice and add specific details.</em></p>`;
}
