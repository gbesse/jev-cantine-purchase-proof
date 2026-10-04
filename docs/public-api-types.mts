import { analyze, toHtml, type Dossier, type Report } from "../src/index.mjs";
import { createJevClient } from "../src/jev.mjs";
import * as adapters from "../src/adapters.mjs";
const dossier: Dossier = {
  purchases: [
    {
      id: "L1",
      docId: "a",
      product: "Pommes issues de l’agriculture biologique.",
      amountCents: 25000,
      date: "2026-10-02",
      supplierId: "FERME-42",
      proofId: "P1",
    },
  ],
  proofs: [
    {
      id: "P1",
      docId: "b",
      family: "bio",
      supplierId: "FERME-42",
      from: "2026-01-01",
      to: "2026-12-31",
      scope: "Pommes cultivées selon les règles de l’agriculture biologique.",
    },
  ],
  id: "jev-cantine-purchase-proof-dev-paraphrase",
  documents: [
    {
      id: "a",
      text: 'dossier.purchases.0 : {"id": "L1", "product": "Pommes issues de l’agriculture biologique.", "amountCents": 25000, "date": "2026-10-02", "supplierId": "FERME-42", "proofId": "P1"}',
      source: {
        uri: "fixture:a",
        date: "2026-10-04",
        licence: "CC0",
        kind: "synthetique",
      },
    },
    {
      id: "b",
      text: 'dossier.proofs.0 : {"id": "P1", "family": "bio", "supplierId": "FERME-42", "from": "2026-01-01", "to": "2026-12-31", "scope": "Pommes cultivées selon les règles de l’agriculture biologique."}',
      source: {
        uri: "fixture:b",
        date: "2026-10-04",
        licence: "CC0",
        kind: "synthetique",
      },
    },
  ],
};
const report: Report = await analyze(dossier, {
  mode: "jev",
  provider: createJevClient({ apiKey: "exemple-de-type" }),
});
const html: string = toHtml(report);
void html;
void adapters;
// @ts-expect-error Un dossier vide ne respecte pas le contrat métier.
await analyze({ id: "incomplet", documents: [] });
