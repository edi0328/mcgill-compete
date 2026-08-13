import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * next/link tagged with a view-transition type so route changes animate
 * (see the page-transition block in globals.css). Untyped transitions -
 * initial load, Suspense/lazy reveals - resolve every boundary to "none"
 * and play nothing, so ALL internal navigation must go through these
 * wrappers to get the page-settle animation.
 *
 * TransitionLink ("navigate"): cross-section navigation; the root <main>
 * boundary animates. Template destinations are the exception: their full
 * static payload is prefetched and swapped without a view-transition delay.
 * ArticleLink does the same for templates-internal navigation.
 */
type LinkProps = Omit<ComponentProps<typeof NextLink>, "transitionTypes">;

export function TransitionLink(props: LinkProps) {
  const href = typeof props.href === "string" ? props.href : props.href.pathname;
  if (href?.startsWith("/templates")) {
    return <NextLink prefetch={true} {...props} />;
  }
  return <NextLink transitionTypes={["navigate"]} {...props} />;
}

export function ArticleLink(props: LinkProps) {
  return <NextLink prefetch={true} {...props} />;
}
