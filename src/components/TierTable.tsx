/**
 * The sponsorship benefit-by-tier matrix, colored to match the prospectus
 * PDF table. Tier color lives in the header name, the column wash, and the
 * checks; the benefit column stays neutral. The matrix scrolls horizontally
 * on phones: five columns cannot stack meaningfully.
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
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-sm" style={{ minWidth: "680px" }}>
        <thead>
          <tr className="border-b border-line">
            <th className="px-4 py-3" />
            {tiers.map((t) => {
              const s = tierStyles[t.name];
              return (
                <th
                  key={t.name}
                  className={`w-28 px-4 py-3 text-center font-mono text-[12px] ${s.bg}`}
                >
                  <span className={`block font-semibold uppercase tracking-wide ${s.text}`}>
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
                    className={`px-4 py-3 text-center align-middle ${s.bg}`}
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
  );
}
