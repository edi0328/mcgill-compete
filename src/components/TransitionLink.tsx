import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * next/link tagged with a view-transition type so route changes animate
 * (see the page-transition block in globals.css). Untyped transitions —
 * initial load, Suspense/lazy reveals — resolve every boundary to "none"
 * and play nothing, so ALL internal navigation must go through these
 * wrappers to get the page-settle animation.
 *
 * TransitionLink ("navigate"): cross-section navigation; the root <main>
 * boundary animates. ArticleLink ("navigate-article"): templates-internal
 * navigation (sidebar, breadcrumbs, prev/next); only the templates article
 * column animates while the sidebar stays perfectly still.
 */
type LinkProps = Omit<ComponentProps<typeof NextLink>, "transitionTypes">;

export function TransitionLink(props: LinkProps) {
  return <NextLink transitionTypes={["navigate"]} {...props} />;
}

export function ArticleLink(props: LinkProps) {
  return <NextLink transitionTypes={["navigate-article"]} {...props} />;
}
