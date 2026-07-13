import { ViewTransition, type ReactNode } from "react";
import { TemplatesSidebar } from "@/components/TemplatesSidebar";
import { sidebarNav, templates } from "@/content/templates";

/**
 * Docs-style shell for the template library: persistent sidebar (sticky,
 * independently scrollable) beside the content column. The layout stays
 * mounted across template navigations, so sidebar filter/scroll survive.
 * `minmax(0,1fr)` + `min-w-0` are load-bearing — without them the Shiki
 * <pre> blocks blow out the grid track. `top-14` matches the h-14 header;
 * when the header retracts on scroll, the sidebar keeps its calm offset.
 */
export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
      <aside className="pt-8 lg:pt-0">
        <div className="lg:sticky lg:top-14 lg:max-h-[calc(100dvh-3.5rem)] lg:overflow-y-auto lg:py-10 [scrollbar-width:thin]">
          <TemplatesSidebar nav={sidebarNav} total={templates.length} />
        </div>
      </aside>
      {/* Templates-internal navigations (ArticleLink) settle only this
          column; the sidebar sits outside the boundary and stays still.
          Cross-section navigations animate at the root <main> boundary
          instead, and untyped transitions play nothing. */}
      <ViewTransition
        default={{ "navigate-article": "page-shell", default: "none" }}
      >
        <div className="min-w-0">{children}</div>
      </ViewTransition>
    </div>
  );
}
