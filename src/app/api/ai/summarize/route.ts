import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  // Strip HTML tags for processing
  const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  if (!plainText || plainText.length < 10) {
    return NextResponse.json({
      result: "Not enough content to summarize. Add more text to your note first.",
    });
  }

  const sentences = plainText.split(/[.!?]+/).filter((s: string) => s.trim().length > 5);
  const wordCount = plainText.split(/\s+/).length;

  // Extract key topics (simple keyword extraction)
  const words: string[] = plainText.toLowerCase().split(/\s+/);
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
    "as", "into", "through", "during", "before", "after", "above", "below",
    "between", "out", "off", "over", "under", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "both",
    "each", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "and",
    "but", "or", "yet", "this", "that", "these", "those", "i", "you",
    "he", "she", "it", "we", "they", "what", "which", "who", "whom",
  ]);

  const wordFreq: Record<string, number> = {};
  words.forEach((w) => {
    const cleaned = w.replace(/[^a-z]/g, "");
    if (cleaned.length > 3 && !stopWords.has(cleaned)) {
      wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1;
    }
  });

  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  const summary = `<div>
<h3>📝 Summary</h3>
<p>This document contains <strong>${wordCount} words</strong> across <strong>${sentences.length} sentences</strong>.</p>
<h4>Key Topics</h4>
<ul>${topKeywords.map((k) => `<li>${k}</li>`).join("")}</ul>
<h4>Overview</h4>
<p>${sentences.slice(0, 3).join(". ").trim()}${sentences.length > 3 ? "..." : "."}</p>
${sentences.length > 5 ? `<h4>Key Points</h4><ul>${sentences.slice(0, 5).map((s: string) => `<li>${s.trim()}</li>`).join("")}</ul>` : ""}
</div>`;

  return NextResponse.json({ result: summary });
}
