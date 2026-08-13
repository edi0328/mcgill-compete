"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/**
 * Code box in the site theme, with language tabs and a copy button.
 * `html` is shiki-highlighted markup produced at build time by the server
 * component (see /templates/[slug]); `code` stays raw for the clipboard.
 */
export function CodeBlock({
  variants,
}: {
  variants: { label: string; code: string; html: string }[];
}) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(variants[active].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable (http, old browser) - nothing sensible to do
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-2 py-2">
        <div className="flex">
          {variants.map((v, i) => (
            <button
              key={v.label}
              onClick={() => {
                setActive(i);
                setCopied(false);
              }}
              className={`rounded px-3 py-2 font-mono text-[12px] transition-colors ${
                i === active
                  ? "bg-paper-deep text-fg"
                  : "text-fg-faint hover:text-fg-muted"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          aria-label="Copy code"
          className="flex items-center gap-2 rounded px-3 py-2 font-mono text-[12px] text-fg-faint transition-colors hover:text-fg"
        >
          {copied ? (
            <>
              <Check size={13} className="text-ac" />
              <span className="text-ac">copied</span>
            </>
          ) : (
            <>
              <Copy size={13} /> copy
            </>
          )}
        </button>
      </div>
      <div
        className="[&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[12px] [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: variants[active].html }}
      />
    </div>
  );
}
