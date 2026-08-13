import type { ExternalResource } from "@/types/content";

/** Editorial list entry for an external resource - hairline, no card box. */
export function ResourceCard({ resource }: { resource: ExternalResource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full border-t border-line py-4"
    >
      <h3 className="font-semibold tracking-tight transition-colors group-hover:text-accent">
        {resource.name}{" "}
        <span className="font-mono text-[13px] text-fg-faint transition-colors group-hover:text-accent">
          ↗
        </span>
      </h3>
      <p className="mt-1 text-sm text-fg-muted">{resource.description}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {resource.tags.map((tag) => (
          <span key={tag} className="font-mono text-[11px] text-fg-faint">
            #{tag}
          </span>
        ))}
      </div>
    </a>
  );
}
