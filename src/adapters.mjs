import { parse } from "csv-parse/sync";
import { decimalCents } from "./index.mjs";
import { document } from "./io.mjs";
export function importPurchaseCsv(
  csv,
  proofs,
  { delimiter = ";", at = new Date().toISOString().slice(0, 10) } = {},
) {
  if (typeof csv !== "string" || csv.length > 2e6)
    throw new TypeError("CSV trop grand");
  const rows = parse(csv, {
    columns: true,
    delimiter,
    bom: true,
    skip_empty_lines: true,
    relax_column_count: false,
  });
  if (!rows.length || rows.length > 200)
    throw new TypeError("1 à 200 achats par dossier");
  const purchases = rows.map((r, i) => ({
    id: r.id,
    docId: "achat" + i,
    product: r.produit,
    amountCents: decimalCents(r.montant_ht),
    date: r.date,
    supplierId: r.fournisseur,
    proofId: r.preuve,
  }));
  const normalized = proofs.map((p, i) => ({ ...p, docId: "preuve" + i }));
  const documents = rows.map((r, i) =>
    document("achat" + i, JSON.stringify(r), {
      uri: "fichier:achats.csv#ligne=" + String(i + 2),
      date: at,
      kind: "importe",
      licence: "Privé",
    }),
  );
  documents.push(
    ...normalized.map((p) =>
      document(p.docId, JSON.stringify(p), {
        uri: "fichier:qualites.json",
        date: at,
        kind: "importe",
        licence: "Privé",
      }),
    ),
  );
  return { id: "bilan-achats", purchases, proofs: normalized, documents };
}
