import { Mail } from "lucide-react";
import { DiscordIcon, InstagramIcon } from "@/components/BrandIcons";
import { site } from "@/content/site";
import { isReal } from "@/lib/placeholders";

/**
 * Discord, Instagram, and email links. The hero uses an equal-width contact
 * rail; compact placements use icon-only buttons with tooltips.
 * Email renders even while `site.links.email` is a [PLACEHOLDER] — fill it
 * in src/content/site.ts before launch.
 */
export function SocialLinks({
  size = "md",
  variant = "icons",
  exclude = [],
}: {
  size?: "md" | "sm";
  variant?: "icons" | "hero";
  exclude?: string[];
}) {
  const socials = [
    { label: "Discord", href: site.links.discord, Icon: DiscordIcon },
    { label: "Instagram", href: site.links.instagram, Icon: InstagramIcon },
    { label: "Email", href: `mailto:${site.links.email}`, Icon: Mail },
  ].filter((s) => isReal(s.href) && !exclude.includes(s.label));
  const box = size === "md" ? "h-11 w-11" : "h-9 w-9";
  const icon = size === "md" ? 19 : 16;

  if (variant === "hero") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-start sm:gap-3">
        {socials.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group inline-flex min-h-10 items-center gap-2 rounded-md border border-line/80 bg-surface/55 px-3 font-mono text-[11px] text-fg-muted transition-colors hover:border-accent/50 hover:bg-surface/85 hover:text-fg"
          >
            <Icon
              width={16}
              height={16}
              className="shrink-0 transition-colors group-hover:text-accent"
            />
            <span>{label.toLowerCase()}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {socials.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`flex ${box} items-center justify-center rounded-lg border border-line bg-surface text-fg-muted transition-colors hover:border-accent hover:text-fg`}
        >
          <Icon width={icon} height={icon} />
        </a>
      ))}
    </div>
  );
}
