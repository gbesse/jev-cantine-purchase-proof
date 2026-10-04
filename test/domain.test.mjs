import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { analyze } from "../src/index.mjs";
const base = JSON.parse(
  await readFile(new URL("../examples/dossier.json", import.meta.url), "utf8"),
);
const clone = structuredClone;

import { importPurchaseCsv } from "../src/adapters.mjs";
test("Local seul n’est pas une qualité justifiée", async () => {
  const x = clone(base);
  x.proofs[0].family = "local";
  x.proofs[0].scope = x.purchases[0].product;
  const r = await analyze(x);
  assert.equal(r.outputs.documentedCents, 0);
  assert.equal(r.status, "ecart");
});
test("Une preuve absente ne compte pas dans le bilan", async () => {
  const x = clone(base);
  x.proofs = [];
  const r = await analyze(x);
  assert.equal(r.outputs.totalCents, 25000);
  assert.equal(r.outputs.documentedCents, 0);
  assert.equal(r.status, "a_revoir");
});
test("CSV protège les montants et les produits contenant le séparateur", () => {
  const x = importPurchaseCsv(
    'id;produit;montant_ht;date;fournisseur;preuve\nL1;"Pommes; poires";100,01;2026-10-02;X;P1',
    base.proofs,
  );
  assert.equal(x.purchases[0].amountCents, 10001);
  assert.equal(x.purchases[0].product, "Pommes; poires");
});
