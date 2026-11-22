---
title: Méthode
chapeau: Un dossier à charge reste un dossier. Voici les règles que suit chaque page de ce site, et comment les contester.
layout: layouts/page.njk
permalink: /methode/
---

## Ce que fait ce site

Diatribe recense ce que l'on peut reprocher à l'État belge, à sa monarchie et à ses dirigeants, depuis l'État indépendant du Congo jusqu'à aujourd'hui. Le parti pris est assumé : on ne présente que l'accusation. Le ton se veut sec. Les faits suffisent, et l'ironie, quand il y en a, vient d'eux.

Un parti pris n'autorise pas l'approximation. Plus l'accusation est dure, plus la preuve doit l'être.

## La charte

Chaque dossier respecte six règles. Le site refuse de se construire si l'une d'elles n'est pas respectée : un script vérifie chaque dossier à chaque publication.

1. **Toute affirmation factuelle est sourcée.** Chaque chiffre, date, citation ou mise en cause renvoie à une note, et chaque note à un document consultable en ligne. Un dossier compte au moins trois sources.
2. **On ne confond jamais un soupçon et une condamnation.** Chaque dossier porte un tampon qui dit sur quoi repose le reproche (voir plus bas).
3. **La présomption d'innocence s'applique.** Une personne poursuivie, inculpée ou citée dans une enquête n'est pas coupable. Quand une procédure est en cours, le dossier le dit, et il dit aussi quand elle s'est soldée par un non-lieu ou un acquittement.
4. **Les mis en cause ont la parole.** Chaque dossier contient une section « Ce que répondent les intéressés », qui expose leur défense telle qu'ils l'ont formulée publiquement.
5. **Aucun parti n'est épargné.** Socialistes, libéraux, nationalistes flamands, démocrates-chrétiens, écologistes et extrême droite figurent tous parmi les mis en cause, chacun pour ce qui lui est reproché.
6. **Le défenseur aussi est entendu.** Une page entière, [l'avocat du diable](/avocat-du-diable/), présente la meilleure défense possible de la Belgique, sourcée avec la même exigence.

## Les tampons

Le tampon est l'information la plus importante d'un dossier. Il indique sur quoi repose le reproche, pas sa gravité morale.

<dl class="legende-liste">
{%- for s in statuts %}
<div>
<dt><span class="tampon tampon--{{ s.slug }}">{{ s.tampon }}</span></dt>
<dd>{{ s.description }}</dd>
</div>
{%- endfor %}
</dl>

## Les sources

Par ordre de préférence :

- les documents officiels : rapports de commissions d'enquête, documents parlementaires, arrêts et jugements, rapports de la Cour des comptes, d'organes de contrôle ou d'institutions internationales ;
- les travaux scientifiques : articles de revues, thèses, publications universitaires ;
- la presse : agences, quotidiens et rédactions publiques belges et internationales.

Les sources sont citées telles quelles, avec leur titre et leur date. La page [Sources](/sources/) les regroupe par média. Un robot vérifie chaque semaine que les liens répondent encore et ouvre un ticket quand l'un d'eux est mort. Le lien est alors remplacé par une copie archivée ou par une autre source.

Les citations sont brèves et entre guillemets. Le reste est reformulé.

Chaque dossier indique sa date de dernière vérification. Les faits postérieurs ne sont pas couverts tant que le dossier n'a pas été mis à jour.

## Droit de réponse et corrections

Une erreur, une source mal lue, une information dépassée, une réponse des intéressés oubliée ? Ouvrez un ticket sur [le dépôt du site](https://github.com/ouaisfieu/diatribe/issues/new/choose). Deux modèles existent : l'un pour signaler une erreur, l'autre pour exercer un droit de réponse.

Toute correction est publique. L'historique complet des modifications est consultable sur le dépôt, ligne par ligne. Rien n'est effacé en silence.

## Qui écrit

L'auteur ou l'autrice de ce site reste anonyme. Le contenu ne demande pas qu'on lui fasse confiance : il demande qu'on vérifie ses sources, et toutes sont à un clic.

Les textes ont été rédigés avec l'aide d'un modèle d'intelligence artificielle, Claude, d'Anthropic, qui apparaît comme auteur des modifications sur le dépôt. Cela ne change rien à la règle : une affirmation sans source n'a pas sa place ici. Si vous en trouvez une, signalez-la.

## Licence et vie privée

Les textes sont publiés sous licence [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.fr) : vous pouvez les reprendre et les modifier, à condition de citer la source et de partager sous la même licence. Le code est sous licence MIT.

Le site ne contient aucun traceur, aucune statistique de visite, aucun script ni aucune police chargés depuis un autre serveur. La recherche fonctionne entièrement dans votre navigateur. Les liens externes sont ouverts sans transmettre l'adresse de la page d'origine.
