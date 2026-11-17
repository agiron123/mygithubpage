/**
 * Proactive content negotiation for the two representations this site
 * produces. Ranking follows RFC 9110 §12.5.1: q-values first, then the
 * most specific matching range, then the client's listed order.
 * `q=0` rejects a type even when a wildcard would otherwise allow it.
 */

const PRODUCES = ["text/html", "text/markdown"] as const;

export type ProducedType = (typeof PRODUCES)[number];

type AcceptEntry = {
  type: string;
  q: number;
  specificity: number;
};

export function parseAccept(header: string): AcceptEntry[] {
  const entries: AcceptEntry[] = [];

  for (const raw of header.split(",")) {
    const parts = raw
      .trim()
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean);
    const type = parts[0]?.toLowerCase() ?? "";
    if (!type) continue;

    let q = 1;
    for (const param of parts.slice(1)) {
      const [name, value] = param.split("=").map((part) => part.trim());
      if (name?.toLowerCase() !== "q") continue;
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
    }

    const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;
    entries.push({ type, q, specificity });
  }

  return entries;
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === "*/*") return true;
  if (entry.type.endsWith("/*")) {
    return candidate.startsWith(entry.type.slice(0, -1));
  }
  return entry.type === candidate;
}

/** The representation to send, or null when none of them are acceptable. */
export function preferredType(header: string | null): ProducedType | null {
  if (!header || header.trim() === "") return PRODUCES[0];

  const entries = parseAccept(header);
  if (entries.length === 0) return PRODUCES[0];

  let best: ProducedType | null = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of PRODUCES) {
    let matched: AcceptEntry | null = null;
    let matchedPosition = Infinity;

    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      if (!entry || !matches(entry, candidate)) continue;
      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && index < matchedPosition)
      ) {
        matched = entry;
        matchedPosition = index;
      }
    }

    if (!matched || matched.q <= 0) continue;

    if (
      matched.q > bestQ ||
      (matched.q === bestQ && matchedPosition < bestPosition)
    ) {
      bestQ = matched.q;
      bestPosition = matchedPosition;
      best = candidate;
    }
  }

  return best;
}
