/**
 * The sponsorship benefit-by-tier matrix, colored to match the prospectus
 * PDF table. Tier color lives in the header name, the column wash, and the
 * checks; the benefit column stays neutral.
 *
 * Below `sm` the matrix becomes stacked per-tier cards: five columns cannot
 * stack row-wise, and a sideways-scrolling table hides every tier past
 * bronze. The tiers are cumulative, so each card lists what the tier adds.
 */

const tierStyles: Record<string, { text: string; bg: string }> = {
  bronze: { text: "text-tier-bronze", bg: "bg-tier-bronze-bg" },
  silver: { text: "text-tier-silver", bg: "bg-tier-silver-bg" },
  gold: { text: "text-tier-gold", bg: "bg-tier-gold-bg" },
  platinum: { text: "text-tier-platinum", bg: "bg-tier-platinum-bg" },
};

export function TierTable({
  tiers,
  rows,
}: {
  tiers: { name: string; price: string }[];
  rows: { benefit: string; tiers: boolean[] }[];
}) {
  const added = tiers.map((_, i) =>
    rows.filter((r) => r.tiers[i] && (i === 0 || !r.tiers[i - 1])).map((r) => r.benefit),
  );

  return (
    <>
      <div className="space-y-4 sm:hidden">
        {tiers.map((t, i) => {
          const s = tierStyles[t.name];
          return (
            <div key={t.name} className="overflow-hidden rounded-lg border border-line">
              <div className={`flex items-baseline justify-between px-4 py-3 ${s.bg}`}>
                <span
                  className={`font-mono text-[12px] font-semibold uppercase tracking-wide ${s.text}`}
                >
                  {t.name}
                </span>
                <span className="font-mono text-[12px] text-fg-muted">{t.price}</span>
              </div>
              <ul className="space-y-2 px-4 py-3 text-base text-fg-muted">
                {i > 0 && (
                  <li className="font-mono text-[12px] text-fg-faint">
                    everything in {tiers[i - 1].name}, plus
                  </li>
                )}
                {added[i].map((benefit) => (
                  <li key={benefit} className="flex gap-2">
                    <span aria-hidden="true" className={s.text}>
                      ✓
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-line sm:block">
        <table className="w-full text-left text-base" style={{ minWidth: "680px" }}>
          <thead>
            <tr className="border-b border-line">
              <th className="px-4 py-3" />
              {tiers.map((t) => {
                const s = tierStyles[t.name];
                return (
                  <th
                    key={t.name}
                    className={`w-28 border-l border-line px-4 py-3 text-center font-mono text-[12px] ${s.bg}`}
                  >
                    <span
                      className={`block font-semibold uppercase tracking-wide ${s.text}`}
                    >
                      {t.name}
                    </span>
                    <span className="block font-normal text-fg-muted">{t.price}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.benefit} className="border-b border-line last:border-0">
                <td className="px-4 py-3 align-middle text-fg-muted">{row.benefit}</td>
                {row.tiers.map((included, i) => {
                  const s = tierStyles[tiers[i].name];
                  return (
                    <td
                      key={tiers[i].name}
                      className={`border-l border-line px-4 py-3 text-center align-middle ${
                        included ? s.bg : ""
                      }`}
                    >
                      {included && (
                        <span aria-hidden="true" className={s.text}>
                          ✓
                        </span>
                      )}
                      <span className="sr-only">
                        {included ? "included" : "not included"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
