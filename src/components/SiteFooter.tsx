import { TransitionLink as Link } from "@/components/TransitionLink";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

/** Same four links as the header — /team and /hall-of-fame stay out until ready. */
const nav = [
  { href: "/", label: "home" },
  { href: "/schedule", label: "schedule" },
  { href: "/resources", label: "resources" },
  { href: "/templates", label: "templates" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-baseline sm:justify-between">
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
        <div className="mt-7 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <SocialLinks />
          {/* fg-muted, not fg-faint: 12px mono at faint fails WCAG AA (2.9:1
              light / 3.5:1 dark); muted passes in both themes. */}
          <p className="font-mono text-[12px] text-fg-muted">
            © {new Date().getFullYear()} {site.name} · student-run club
          </p>
        </div>
      </div>
    </footer>
  );
}
