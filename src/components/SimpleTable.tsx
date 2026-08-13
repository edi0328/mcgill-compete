import type { ReactNode } from "react";

/**
 * Generic bordered table with mono headers. Used for the weekly rhythm,
 * templates, and problem set tables. Cells can be any ReactNode.
 *
 * Below `sm` the table becomes stacked label/value rows (mono label column,
 * like the event timetable rows) - a horizontally scrolling table on a phone
 * just reads as cut off.
 */
export function SimpleTable({
  headers,
  rows,
  minWidth = "560px",
}: {
  headers: string[];
  rows: ReactNode[][];
  minWidth?: string;
}) {
  return (
    <>
      <div className="divide-y divide-line rounded-lg border border-line sm:hidden">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[10ch_1fr] gap-x-4 gap-y-2 p-4 text-base">
            {row.map((cell, j) => (
              <div key={j} className="col-span-2 grid grid-cols-subgrid">
                <span className="font-mono text-[12px] leading-6 text-fg-faint">
                  {headers[j]}
                </span>
                <div className="min-w-0">{cell}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-lg border border-line sm:block">
        <table className="w-full text-left text-base" style={{ minWidth }}>
          <thead>
            <tr className="border-b border-line bg-surface font-mono text-[12px] text-fg-faint">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-line last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
