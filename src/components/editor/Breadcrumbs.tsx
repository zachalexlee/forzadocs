"use client";

import { ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";

interface BreadcrumbsProps {
  pageId: string;
}

export default function Breadcrumbs({ pageId }: BreadcrumbsProps) {
  const { pages, setActivePage } = useStore();

  const buildBreadcrumbs = () => {
    const crumbs: { id: string; title: string; icon: string }[] = [];
    let currentPage = pages.find((p) => p.id === pageId);

    while (currentPage) {
      crumbs.unshift({
        id: currentPage.id,
        title: currentPage.title || "Untitled",
        icon: currentPage.icon,
      });
      currentPage = currentPage.parentId
        ? pages.find((p) => p.id === currentPage!.parentId)
        : undefined;
    }

    return crumbs;
  };

  const crumbs = buildBreadcrumbs();

  if (crumbs.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-text-muted px-1 pb-3">
      {crumbs.map((crumb, index) => (
        <div key={crumb.id} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRight size={10} className="text-text-muted shrink-0" />
          )}
          <button
            onClick={() => setActivePage(crumb.id)}
            className={`hover:text-text-secondary transition-colors truncate max-w-[140px] ${
              index === crumbs.length - 1 ? "text-text-secondary" : ""
            }`}
          >
            <span className="mr-0.5">{crumb.icon}</span>
            {crumb.title}
          </button>
        </div>
      ))}
    </div>
  );
}
