// Rassemble toutes les sources citées dans les dossiers pour la page « Sources ».
// Une source = une définition de note de bas de page contenant un lien.

const domaineDe = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export function extraireSources(dossiers) {
  const parUrl = new Map();
  for (const d of dossiers) {
    const brut = d.rawInput || "";
    for (const [, , texte] of brut.matchAll(/^\[\^([^\]]+)\]:\s*(.*)$/gm)) {
      for (const [url] of texte.matchAll(/https?:\/\/[^\s<>)\]]+/g)) {
        const propre = url.replace(/[.,;]+$/, "");
        if (!parUrl.has(propre)) {
          const libelle = texte
            .replace(/<?https?:\/\/[^\s>]+>?/g, "")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/\s+[.,;:]?\s*$/, "")
            .trim();
          parUrl.set(propre, { url: propre, domaine: domaineDe(propre), libelle, dossiers: [] });
        }
        const s = parUrl.get(propre);
        if (!s.dossiers.some((x) => x.url === d.url)) s.dossiers.push({ url: d.url, titre: d.data.title });
      }
    }
  }
  const sources = [...parUrl.values()];
  const parDomaine = new Map();
  for (const s of sources) {
    if (!parDomaine.has(s.domaine)) parDomaine.set(s.domaine, []);
    parDomaine.get(s.domaine).push(s);
  }
  return [...parDomaine.entries()]
    .map(([domaine, liste]) => ({ domaine, liste: liste.sort((a, b) => a.libelle.localeCompare(b.libelle, "fr")) }))
    .sort((a, b) => b.liste.length - a.liste.length || a.domaine.localeCompare(b.domaine));
}
