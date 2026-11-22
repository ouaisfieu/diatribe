// Garde-fou éditorial. Un dossier qui ne respecte pas la charte fait échouer
// la build : pas de statut, pas de droit de réponse ou moins de trois sources
// en ligne, et rien n'est publié.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import themes from "../src/_data/themes.js";
import statuts from "../src/_data/statuts.js";

const SOURCES_MIN = 3;
const champsRequis = ["title", "debut", "theme", "statut", "chapeau", "acteurs", "verifie"];

// Extraction minimaliste du front matter YAML (clés de premier niveau).
function lireFrontMatter(texte) {
  const m = texte.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const data = {};
  for (const ligne of m[1].split("\n")) {
    const kv = ligne.match(/^([A-Za-zÀ-ÿ_]+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { data, corps: texte.slice(m[0].length) };
}

export async function validerDossiers(dossier) {
  const fichiers = (await readdir(dossier)).filter((f) => f.endsWith(".md"));
  const erreurs = [];
  const slugsThemes = new Set(themes.map((t) => t.slug));
  const slugsStatuts = new Set(statuts.map((s) => s.slug));

  for (const f of fichiers) {
    const texte = await readFile(path.join(dossier, f), "utf8");
    const fm = lireFrontMatter(texte);
    const err = (msg) => erreurs.push(`${f} : ${msg}`);
    if (!fm) {
      err("front matter absent");
      continue;
    }
    const { data, corps } = fm;
    for (const c of champsRequis) if (!(c in data)) err(`champ « ${c} » manquant`);
    if (data.theme && !slugsThemes.has(data.theme)) err(`thème inconnu « ${data.theme} »`);
    if (data.statut && !slugsStatuts.has(data.statut)) err(`statut inconnu « ${data.statut} »`);
    if (data.debut && !/^\d{4}$/.test(data.debut)) err(`« debut » doit être une année (reçu « ${data.debut} »)`);

    if (!/^##\s+Ce que répondent les intéressés/m.test(corps))
      err("section « ## Ce que répondent les intéressés » manquante");

    const definitions = [...corps.matchAll(/^\[\^([^\]]+)\]:\s*(.*)$/gm)];
    const avecLien = definitions.filter(([, , t]) => /https?:\/\//.test(t));
    if (avecLien.length < SOURCES_MIN)
      err(`${avecLien.length} source(s) avec lien, minimum ${SOURCES_MIN}`);

    const appels = new Set([...corps.matchAll(/\[\^([^\]]+)\](?!:)/g)].map((m) => m[1]));
    const definies = new Set(definitions.map(([, id]) => id));
    for (const id of appels) if (!definies.has(id)) err(`note [^${id}] appelée mais jamais définie`);
    for (const id of definies) if (!appels.has(id)) err(`note [^${id}] définie mais jamais appelée`);
  }

  if (erreurs.length) {
    const msg = `\nCharte éditoriale non respectée (${erreurs.length} problème(s)) :\n  - ${erreurs.join("\n  - ")}\n`;
    throw new Error(msg);
  }
  console.log(`[diatribe] ${fichiers.length} dossiers conformes à la charte.`);
  return fichiers.length;
}
