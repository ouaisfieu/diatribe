# Diatribe

**Le dossier à charge du Royaume de Belgique.** Un site statique qui recense, sources à l'appui, ce que l'on peut reprocher à l'État belge, à sa monarchie et à ses dirigeants, de l'État indépendant du Congo à aujourd'hui.

Site publié : <https://ouaisfieu.github.io/diatribe/>

## Principes

- Toute affirmation est sourcée, avec au moins trois sources par dossier.
- Un soupçon n'est jamais présenté comme une condamnation : chaque dossier porte un tampon (condamné, constat officiel, fait historique, procédure en cours, non élucidé, acquitté ou classé, bilan).
- Chaque dossier donne la parole aux mis en cause (« Ce que répondent les intéressés »).
- Une page présente la meilleure défense de la Belgique : [l'avocat du diable](https://ouaisfieu.github.io/diatribe/avocat-du-diable/).
- Aucun traceur, aucune statistique de visite, aucune ressource chargée depuis un autre serveur.

La charte complète est sur la page [Méthode](https://ouaisfieu.github.io/diatribe/methode/). **La construction échoue si un dossier ne la respecte pas** : `scripts/valider-dossiers.js` vérifie les champs obligatoires, la section de réponse, le nombre de sources et la correspondance entre appels et notes.

## Contribuer

Corrections et droits de réponse passent par les [tickets](https://github.com/ouaisfieu/diatribe/issues/new/choose). Une correction sans source ne peut pas être appliquée.

Pour proposer un dossier, ajoutez un fichier `src/dossiers/mon-dossier.md` sur ce modèle :

```markdown
---
title: "Titre du dossier"
debut: 1996
fin: "en cours"            # ou une année
theme: justice             # voir src/_data/themes.js
themesSecondaires: [police]
statut: constat            # voir src/_data/statuts.js
chapeau: "Deux ou trois phrases qui résument le reproche."
acteurs: ["Nom (parti)", "Institution"]
verifie: 2026-11-22        # date de dernière vérification des sources
chiffres:
  - valeur: "300 000"
    texte: "personnes à la marche blanche"
---

## Les faits

Chaque affirmation renvoie à une note[^cle].

## Ce qui est reproché

## Ce que répondent les intéressés

## Où en est-on

[^cle]: « Titre de l'article », *Média*, date. <https://exemple.be/article>
```

## Développement

Node 20 ou plus récent.

```sh
npm ci
npm run dev        # serveur local sur http://localhost:8080
npm run valider    # vérifie la charte sans construire
npm run build      # construit _site/ et l'index de recherche
```

Le site est construit avec [Eleventy](https://www.11ty.dev/) et indexé par [Pagefind](https://pagefind.app/). Les polices (Spectral et Archivo) sont servies depuis le site. Chaque poussée sur `main` publie le site sur GitHub Pages ; chaque lundi, un robot vérifie que les liens des sources répondent encore.

```
src/
  dossiers/     un fichier Markdown par dossier
  _data/        thèmes, statuts, configuration du site
  _includes/    gabarits et fragments
  assets/       styles et favicon
scripts/        validation de la charte, index des sources
```

## Licence

Textes sous [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.fr), code sous licence MIT. Détails dans [LICENSE.md](LICENSE.md).
