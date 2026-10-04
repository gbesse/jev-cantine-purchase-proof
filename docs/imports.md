# Importer des données

`importPurchaseCsv` accepte un CSV UTF-8 à séparateur `;` avec `id;produit;montant_ht;date;fournisseur;preuve`. Les virgules décimales sont admises, sans flottants pour les montants. Un JSON distinct fournit les preuves (`id`, `family`, `supplierId`, `from`, `to`, `scope`). Les familles implémentées sont bio, Label Rouge, AOP, IGP, STG et HVE ; ce sous-ensemble ne couvre pas toute la réglementation EGalim. Une preuve privée complète doit être contrôlée par l’opérateur. Le bilan reste un tableau de travail, aucune télétransmission ma cantine n’est exécutée.

```sh
npm run demo:import
```

[Code complet de l’import](../examples/import.mjs). Ce parcours passe réellement du format source au rapport JSON/HTML. Les fichiers générés ne contiennent que des données synthétiques. Pour des documents réels confidentiels, écrire les rapports dans `reports/private/` (ignoré par Git), contrôler les droits de fichier et informer les personnes concernées avant un envoi externe.
