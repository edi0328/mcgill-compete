import { TransitionLink as Link } from "@/components/TransitionLink";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

/**
 * Same links as the header - /team and /hall-of-fame stay out until ready.
 * /schedule and /resources were removed from the site (Aug 2026); the full
 * event list now lives on /sponsorship#events, and the resources content is
 * kept in src/content for a possible return.
 */
const nav = [
  { href: "/", label: "home" },
  { href: "/sponsorship", label: "sponsorship" },
  { href: "/templates", label: "templates" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-mono text-[13px] text-fg-muted">
            <span className="text-accent">&gt;</span> {site.name} · McGill
            University
          </p>
          <nav aria-label="Footer" className="-mx-2 flex flex-wrap gap-x-1 gap-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-2 py-2 font-mono text-[13px] text-fg-muted transition-colors hover:text-fg focus-visible:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-4 flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <SocialLinks />
          <p className="font-mono text-[13px] text-fg-muted">
            © {new Date().getFullYear()} {site.name} · student-run club
          </p>
        </div>
      </div>
    </footer>
  );
}
