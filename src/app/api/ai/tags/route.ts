import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { content, title } = await req.json();

  const plainText = (title + " " + content).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

  const tagRules: { keywords: string[]; tag: string; color: string }[] = [
    { keywords: ["meeting", "agenda", "attendees", "minutes", "discussion"], tag: "Meeting", color: "blue" },
    { keywords: ["todo", "task", "action item", "deadline", "done", "checklist"], tag: "Tasks", color: "green" },
    { keywords: ["idea", "brainstorm", "concept", "creative", "innovation"], tag: "Ideas", color: "purple" },
    { keywords: ["project", "milestone", "deliverable", "timeline", "roadmap"], tag: "Project", color: "orange" },
    { keywords: ["personal", "journal", "diary", "reflection", "goals"], tag: "Personal", color: "pink" },
    { keywords: ["research", "study", "analysis", "findings", "data"], tag: "Research", color: "blue" },
    { keywords: ["design", "ui", "ux", "mockup", "wireframe", "layout"], tag: "Design", color: "purple" },
    { keywords: ["code", "programming", "developer", "api", "function", "bug"], tag: "Engineering", color: "green" },
    { keywords: ["budget", "finance", "cost", "revenue", "expense"], tag: "Finance", color: "orange" },
    { keywords: ["marketing", "campaign", "brand", "social media", "content"], tag: "Marketing", color: "pink" },
    { keywords: ["learning", "tutorial", "course", "lesson", "education"], tag: "Learning", color: "blue" },
    { keywords: ["review", "feedback", "evaluation", "assessment"], tag: "Review", color: "purple" },
  ];

  const matchedTags: { name: string; color: string }[] = [];

  for (const rule of tagRules) {
    const matchCount = rule.keywords.filter((kw) => plainText.includes(kw)).length;
    if (matchCount >= 1) {
      matchedTags.push({ name: rule.tag, color: rule.color });
    }
    if (matchedTags.length >= 3) break;
  }

  // If no tags matched, add a generic one
  if (matchedTags.length === 0) {
    matchedTags.push({ name: "Note", color: "blue" });
  }

  return NextResponse.json({ tags: matchedTags });
}
