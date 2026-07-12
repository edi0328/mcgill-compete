import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono text-[13px] text-fg-muted">
          <span className="text-accent">&gt;</span> {site.name} · McGill University
        </p>
        <SocialLinks size="sm" />
      </div>
    </footer>
  );
}
