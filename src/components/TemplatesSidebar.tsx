"use client";

import { ChevronDown, Search } from "lucide-react";
import { ArticleLink as Link } from "@/components/TransitionLink";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { NavGroup, NavLeaf } from "@/content/templates";

/**
 * Docs-style navigator for /templates with progressive disclosure
 * (MkDocs-Material behavior): the 7 topic headers are always visible, the
 * topic containing the current page is always expanded, others expand on
 * click. Typing in the filter searches all templates regardless of collapse
 * state. One client component holding one filter/disclosure state - the
 * templates layout stays mounted across navigations, so it all survives
 * moving between templates. On mobile the whole panel collapses behind a
 * toggle. Receives only names + slugs (NavGroup) - template code never
 * ships to the client.
 */

export function TemplatesSidebar({
  nav,
  total,
}: {
  nav: NavGroup[];
  total: number;
}) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [openTopics, setOpenTopics] = useState<ReadonlySet<string>>(new Set());

  // Close the mobile drawer on navigation - render-time, same idiom as
  // SiteHeader, so the old state never paints on the new page.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  const q = query.trim().toLowerCase();
  const activeSlug = pathname.startsWith("/templates/")
    ? pathname.slice("/templates/".length)
    : null;

  const containsActive = (group: NavGroup): boolean =>
    (group.leaves ?? []).some((leaf) => leaf.slug === activeSlug) ||
    (group.children ?? []).some(containsActive);

  const countLeaves = (group: NavGroup): number =>
    (group.leaves?.length ?? 0) +
    (group.children ?? []).reduce((n, child) => n + countLeaves(child), 0);

  const toggleTopic = (name: string) =>
    setOpenTopics((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  // A leaf shows when it matches, or when one of its ancestor group names
  // matched (searching "graph" should surface every graph template).
  const filterLeaves = (group: NavGroup, matched: boolean): NavLeaf[] =>
    (group.leaves ?? []).filter(
      (leaf) =>
        q === "" ||
        matched ||
        leaf.name.toLowerCase().includes(q) ||
        leaf.slug.includes(q),
    );

  const leafList = (leaves: NavLeaf[]) => (
    <ul className="mt-2">
      {leaves.map((leaf) => {
        const active = leaf.slug === activeSlug;
        return (
          <li key={leaf.slug}>
            <Link
              href={`/templates/${leaf.slug}`}
              aria-current={active ? "page" : undefined}
              className={`block border-l py-1 pl-3 text-[13px] transition-colors ${
                active
                  ? "border-accent font-semibold text-fg"
                  : "border-line text-fg-muted hover:border-fg-faint hover:text-fg"
              }`}
            >
              {leaf.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const renderSub = (group: NavGroup, inherited: boolean): ReactNode | null => {
    const matched =
      inherited || (q !== "" && group.name.toLowerCase().includes(q));
    const leaves = filterLeaves(group, matched);
    const children = (group.children ?? [])
      .map((child) => renderSub(child, matched))
      .filter((child): child is ReactNode => child !== null);
    if (leaves.length === 0 && children.length === 0) return null;
    return (
      <div key={group.name} className="pt-3">
        <p className="font-mono text-[11px] text-fg-faint">{group.name}</p>
        {leaves.length > 0 && leafList(leaves)}
        {children}
      </div>
    );
  };

  const renderTopic = (topic: NavGroup): ReactNode | null => {
    const matched = q !== "" && topic.name.toLowerCase().includes(q);
    const leaves = filterLeaves(topic, matched);
    const subs = (topic.children ?? [])
      .map((child) => renderSub(child, matched))
      .filter((child): child is ReactNode => child !== null);
    if (q !== "" && leaves.length === 0 && subs.length === 0) return null;

    // The active topic never collapses - you can't lose your place.
    const expanded =
      q !== "" || containsActive(topic) || openTopics.has(topic.name);

    return (
      <div key={topic.name} className="pt-4 first:pt-0">
        <button
          type="button"
          onClick={() => toggleTopic(topic.name)}
          aria-expanded={expanded}
          className="flex w-full items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-faint transition-colors hover:text-fg-muted"
        >
          <span className="text-left">{topic.name}</span>
          <span className="flex shrink-0 items-center gap-2">
            {countLeaves(topic)}
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${
                expanded ? "" : "-rotate-90"
              }`}
              aria-hidden="true"
            />
          </span>
        </button>
        {expanded && (
          <div>
            {leaves.length > 0 && leafList(leaves)}
            {subs}
          </div>
        )}
      </div>
    );
  };

  const groups = nav
    .map((topic) => renderTopic(topic))
    .filter((topic): topic is ReactNode => topic !== null);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="panel flex w-full items-center justify-between px-4 py-2 font-mono text-[13px] text-fg-muted transition-colors hover:text-fg lg:hidden"
      >
        browse templates ({total})
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <nav
        aria-label="Templates"
        className={`${open ? "mt-3 block" : "hidden"} lg:mt-0 lg:block`}
      >
        <div className="relative">
          <Search
            size={14}
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search"
            aria-label="Search templates"
            className="w-full rounded border border-line bg-surface py-2 pl-8 pr-3 font-mono text-[13px] text-fg placeholder:text-fg-faint focus:border-fg-faint focus:outline-none"
          />
        </div>

        {groups.length > 0 ? (
          <div className="pt-4">{groups}</div>
        ) : (
          <div className="pt-5">
            <p className="font-mono text-[12px] text-fg-faint">
              no matches for &ldquo;{query.trim()}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-1 font-mono text-[12px] text-accent transition-colors hover:text-accent-soft"
            >
              clear filter
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
