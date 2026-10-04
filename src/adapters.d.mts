import type { Dossier, Document } from "./index.mjs";
export function importPurchaseCsv(
  csv: string,
  proofs: Record<string, unknown>[],
  options?: { delimiter?: string; at?: string },
): Dossier;
