"use client";

import type { ReactNode } from "react";

type SilverMessageContentProps = {
  content: string;
};

function renderInline(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const matches = text.split(pattern).filter(Boolean);

  return matches.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`bold-${index}`} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;

      return (
        <a
          key={`link-${index}`}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-cyan-300 underline decoration-cyan-300/40 underline-offset-4 transition hover:text-cyan-200"
        >
          {label}
        </a>
      );
    }

    return part;
  });
}

export default function SilverMessageContent({
  content,
}: SilverMessageContentProps) {
  const lines = content.split(/\r?\n/);
  const elements: ReactNode[] = [];
  let listItems: string[] = [];
  let paragraphLines: string[] = [];
  let listMode: "ordered" | "unordered" | null = null;

  const flushParagraph = () => {
    if (!paragraphLines.length) {
      return;
    }

    const text = paragraphLines.join(" ").trim();
    if (text) {
      elements.push(
        <p key={`p-${elements.length}`} className="leading-7 text-zinc-100">
          {renderInline(text)}
        </p>
      );
    }

    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) {
      return;
    }

    const ordered = listMode === "ordered";
    const Tag = ordered ? "ol" : "ul";
    elements.push(
      <Tag
        key={`list-${elements.length}`}
        className={
          ordered
            ? "ml-5 list-decimal space-y-1.5 text-zinc-100"
            : "ml-5 list-disc space-y-1.5 text-zinc-100"
        }
      >
        {listItems.map((item, index) => (
          <li key={`item-${index}`}>{renderInline(item)}</li>
        ))}
      </Tag>
    );

    listItems = [];
    listMode = null;
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    if (/^---+$/.test(line)) {
      flushParagraph();
      flushList();
      elements.push(
        <div
          key={`divider-${elements.length}`}
          className="my-2 border-t border-white/8"
        />
      );
      return;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listMode && listMode !== "ordered") {
        flushList();
      }
      listMode = "ordered";
      listItems.push(orderedMatch[1]);
      return;
    }

    const bulletMatch = line.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      if (listMode && listMode !== "unordered") {
        flushList();
      }
      listMode = "unordered";
      listItems.push(bulletMatch[1]);
      return;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      elements.push(
        <h4
          key={`h4-${elements.length}`}
          className="pt-1 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300"
        >
          {renderInline(line.slice(4))}
        </h4>
      );
      return;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="pt-2 text-base font-semibold text-white"
        >
          {renderInline(line.slice(3))}
        </h3>
      );
      return;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="pt-2 text-lg font-semibold text-white"
        >
          {renderInline(line.slice(2))}
        </h2>
      );
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();

  return <div className="space-y-3">{elements}</div>;
}
