import type { ReactNode } from "react";

/**
 * Generic bordered table with mono headers. Used for the weekly rhythm,
 * templates, and problem set tables. Cells can be any ReactNode.
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
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-line bg-surface font-mono text-[12px] text-fg-faint">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
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
  );
}
