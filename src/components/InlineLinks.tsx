import { isReal } from "@/lib/placeholders";

/**
 * Row of mono "[label]" links - the site-wide pattern for secondary links
 * on cards (slides, problems, profiles, sources...). Links whose URL is
 * still a [PLACEHOLDER] are dropped so users never hit a dead link.
 */
export function InlineLinks({
  links,
  className = "",
}: {
  links: { label: string; url: string }[];
  className?: string;
}) {
  const real = links.filter((link) => isReal(link.url));
  if (real.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] ${className}`}>
      {real.map((link) => (
        <a
          key={link.label + link.url}
          href={link.url}
          className="text-fg-muted underline underline-offset-2 decoration-fg-faint hover:text-fg"
        >
          [{link.label}]
        </a>
      ))}
    </div>
  );
}
