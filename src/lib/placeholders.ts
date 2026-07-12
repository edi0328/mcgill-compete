/**
 * Content files use "[BRACKETED]" placeholders for values future execs will
 * fill in (rooms, links, emails). Nothing bracketed may ever reach a user:
 * components route through these helpers to hide or substitute placeholders.
 */

/** True for real values; false for undefined or "[ANYTHING_IN_BRACKETS]". */
export function isReal(value: string | undefined | null): value is string {
  return !!value && !/^\[.*\]$/.test(value.trim());
}

/** The value if real, otherwise the fallback. */
export function realOr(value: string | undefined | null, fallback: string): string {
  return isReal(value) ? value : fallback;
}
