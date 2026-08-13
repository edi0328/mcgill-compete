import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

/**
 * Minimal footer: socials plus copyright. Navigation is not repeated here
 * because the sticky header always carries it.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <SocialLinks />
        <p className="font-mono text-[13px] text-fg-muted">
          © {new Date().getFullYear()} {site.name} · student-run club
        </p>
      </div>
    </footer>
  );
}
