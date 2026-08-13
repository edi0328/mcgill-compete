import { Mail } from "lucide-react";
import { DiscordIcon, GitHubIcon, InstagramIcon } from "@/components/BrandIcons";
import { site } from "@/content/site";
import { isReal } from "@/lib/placeholders";

/**
 * Footer social row: naked 18px glyphs (no tiles - matches the site's
 * naked-icon convention), muted → ink on hover, with an invisible 36px hit
 * area. Email deliberately stays visible while `site.links.email` is a
 * [PLACEHOLDER] (July 2026 decision: pre-launch TODO, not gated) - fill it
 * in src/content/site.ts before launch.
 */
export function SocialLinks() {
  const socials = [
    { label: "Discord", href: site.links.discord, Icon: DiscordIcon },
    { label: "Instagram", href: site.links.instagram, Icon: InstagramIcon },
    { label: "GitHub", href: site.links.github, Icon: GitHubIcon },
    { label: "Email", href: `mailto:${site.links.email}`, Icon: Mail },
  ].filter((s) => s.label === "Email" || isReal(s.href));

  return (
    <div className="-mx-2 flex gap-2">
      {socials.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="flex h-9 w-9 items-center justify-center rounded text-fg-muted transition-colors hover:text-fg focus-visible:text-fg"
        >
          <Icon width={18} height={18} />
        </a>
      ))}
    </div>
  );
}
