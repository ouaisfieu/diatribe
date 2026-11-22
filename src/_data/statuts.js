// Le statut d’un dossier dit sur quoi repose le reproche. C’est la donnée la
// plus importante du site : on ne confond jamais un soupçon et une condamnation.
export default [
  {
    slug: "condamnation",
    tampon: "Condamné",
    nom: "Condamnation",
    description:
      "Une juridiction a tranché : condamnation pénale définitive d’une ou de plusieurs personnes, ou condamnation de l’État belge par un tribunal belge ou international.",
    gravite: 1,
  },
  {
    slug: "constat",
    tampon: "Constat officiel",
    nom: "Constat officiel",
    description:
      "Les faits sont établis par une commission d’enquête parlementaire, la Cour des comptes, un organe de contrôle, une institution internationale ou un rapport commandé par l’État lui-même.",
    gravite: 2,
  },
  {
    slug: "histoire",
    tampon: "Fait historique",
    nom: "Fait historique établi",
    description:
      "Les faits font l’objet d’un large consensus parmi les historiens, documenté par des travaux scientifiques et des archives.",
    gravite: 3,
  },
  {
    slug: "procedure",
    tampon: "Procédure en cours",
    nom: "Procédure en cours",
    description:
      "Une enquête ou un procès est en cours. Les personnes citées sont présumées innocentes tant qu’elles n’ont pas été définitivement condamnées.",
    gravite: 4,
  },
  {
    slug: "non-elucide",
    tampon: "Non élucidé",
    nom: "Non élucidé",
    description:
      "Les faits sont avérés mais leurs auteurs n’ont jamais été identifiés ou jugés, souvent à cause des défaillances de l’enquête elle-même.",
    gravite: 5,
  },
  {
    slug: "acquitte",
    tampon: "Acquitté ou non-lieu",
    nom: "Acquittement ou non-lieu",
    description:
      "La justice n’a pas retenu de faute pénale. Le dossier figure ici pour ce qu’il révèle du système, pas pour accuser les personnes blanchies.",
    gravite: 6,
  },
  {
    slug: "bilan",
    tampon: "Bilan politique",
    nom: "Bilan politique",
    description:
      "Rien d’illégal : des choix politiques assumés, mesurables par des chiffres publics, et qu’on peut juger sévèrement.",
    gravite: 7,
  },
];
