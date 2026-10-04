import { text, list, cents, date, ref, check, pair } from "./index.mjs";

const families = new Set(["bio", "label_rouge", "aop", "igp", "stg", "hve"]);
export function prepare(x) {
  const purchases = list(x.purchases, "purchases");
  const proofs = Array.isArray(x.proofs) ? x.proofs : [];
  const checks = [],
    pairs = [];
  for (const l of purchases) {
    text(l.id);
    text(l.product);
    cents(l.amountCents);
    date(l.date);
    const p = proofs.find((p) => p.id === l.proofId);
    const refs = ref(l.docId, p?.docId);
    const category = p?.family;
    checks.push(
      check(
        l.id + "-qualite",
        "Famille documentée : " + l.id,
        p
          ? families.has(category)
            ? true
            : category === "local"
              ? false
              : null
          : null,
        refs,
        "Demander un justificatif de qualité ; la proximité géographique seule ne suffit pas.",
      ),
    );
    checks.push(
      check(
        l.id + "-periode",
        "Période et fournisseur : " + l.id,
        p
          ? date(p.from) <= l.date &&
              l.date <= date(p.to) &&
              p.supplierId === l.supplierId
          : null,
        refs,
      ),
    );
    pairs.push(
      pair(
        l.id + "-produit",
        "Produit couvert : " + l.id,
        l.product,
        p?.scope,
        refs,
        "La preuve à droite couvre-t-elle le produit acheté à gauche, sans confondre origine locale et signe de qualité ?",
      ),
    );
  }
  return {
    checks,
    pairs,
    outputs: {
      schemaAchats:
        "Tableau de travail ; ne constitue pas le format de télétransmission ma cantine.",
      localNeProuvePasQualite: true,
    },
  };
}
export function finalize(x, findings) {
  const byFamily = Object.fromEntries([...families].map((k) => [k, 0]));
  let total = 0,
    proved = 0;
  for (const l of x.purchases) {
    total += l.amountCents;
    const fs = findings.filter((f) =>
      [l.id + "-qualite", l.id + "-periode", l.id + "-produit"].includes(f.id),
    );
    if (fs.length === 3 && fs.every((f) => f.status === "etaye")) {
      const p = x.proofs.find((p) => p.id === l.proofId);
      byFamily[p.family] += l.amountCents;
      proved += l.amountCents;
    }
  }
  if (!Number.isSafeInteger(total)) throw new RangeError("Total trop grand");
  return {
    totalCents: total,
    documentedCents: proved,
    unprovedCents: total - proved,
    byFamily,
    documentedRatio: total ? proved / total : null,
  };
}

function requiredDoc(o) {
  if (!o || typeof o !== "object") throw new TypeError("Objet métier requis");
  text(o.docId, "docId requis");
}
export function validateInput(x) {
  for (const l of list(x.purchases, "purchases")) requiredDoc(l);
  for (const p of x.proofs ?? []) {
    requiredDoc(p);
    if (date(p.from) > date(p.to)) throw new TypeError("Période inversée");
  }
}
