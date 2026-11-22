import markdownIt from "markdown-it";
import markdownItFootnote from "markdown-it-footnote";
import markdownItAnchor from "markdown-it-anchor";
import { HtmlBasePlugin } from "@11ty/eleventy";
import { validerDossiers } from "./scripts/valider-dossiers.js";
import { extraireSources } from "./scripts/sources.js";
import themes from "./src/_data/themes.js";
import statuts from "./src/_data/statuts.js";

const slugifier = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function (eleventyConfig) {
  // --- Markdown : notes de bas de page + ancres -----------------------------
  const md = markdownIt({ html: true, typographer: true, linkify: true })
    .use(markdownItFootnote)
    .use(markdownItAnchor, { slugify: slugifier, tabIndex: false });

  // Guillemets français pour la typographie automatique.
  md.options.quotes = ["«\u00A0", "\u00A0»", "“", "”"];

  // Rendu des notes : liste sobre, titre en français.
  md.renderer.rules.footnote_block_open = () =>
    '<section class="notes" aria-labelledby="notes-titre">\n' +
    '<h2 id="notes-titre">Sources et notes</h2>\n<ol class="notes-liste">\n';
  md.renderer.rules.footnote_block_close = () => "</ol>\n</section>\n";
  md.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
    let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    if (tokens[idx].meta.subId > 0) id += ":" + tokens[idx].meta.subId;
    return ` <a href="#fnref${id}" class="retour" aria-label="Revenir au texte">↩︎</a>`;
  };
  md.renderer.rules.footnote_caption = (tokens, idx) => Number(tokens[idx].meta.id + 1).toString();

  // Un lien brut (<https://…>) s'affiche sous la forme de son domaine : plus
  // lisible, et l'adresse complète reste dans le href.
  md.core.ruler.push("liens_courts", (state) => {
    for (const bloc of state.tokens) {
      if (bloc.type !== "inline" || !bloc.children) continue;
      const t = bloc.children;
      for (let i = 0; i < t.length - 2; i++) {
        if (t[i].type !== "link_open" || t[i + 1].type !== "text" || t[i + 2].type !== "link_close") continue;
        const href = t[i].attrGet("href") || "";
        if (t[i + 1].content !== href && t[i + 1].content !== decodeURI(href)) continue;
        try {
          const u = new URL(href);
          const ext = (u.pathname.match(/\.(pdf)$/i) || [])[1];
          t[i + 1].content = u.hostname.replace(/^www\./i, "").toLowerCase() + (ext ? " (PDF)" : "");
          t[i].attrSet("class", "lien-source");
        } catch {}
      }
    }
  });
  // Typographie française : espaces insécables à l'intérieur des guillemets
  // et fines insécables avant ; : ! ?, pour éviter « orphelins en fin de ligne.
  md.core.ruler.push("espaces_insecables", (state) => {
    for (const bloc of state.tokens) {
      if (bloc.type !== "inline" || !bloc.children) continue;
      for (const t of bloc.children) {
        if (t.type !== "text") continue;
        t.content = t.content
          .replace(/« /g, "«\u00A0")
          .replace(/ »/g, "\u00A0»")
          .replace(/ ([;:!?])(?=\s|$)/g, "\u202F$1");
      }
    }
  });
  // Liens externes : pas de referrer, nouvel onglet non forcé.
  const defaultLinkOpen =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet("href") || "";
    if (/^https?:\/\//.test(href)) {
      tokens[idx].attrSet("rel", "noopener noreferrer external");
    }
    return defaultLinkOpen(tokens, idx, options, env, self);
  };
  eleventyConfig.setLibrary("md", md);

  // --- Fichiers statiques ---------------------------------------------------
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource/spectral/files/spectral-latin-400-normal.woff2": "assets/fonts/spectral-400.woff2",
    "node_modules/@fontsource/spectral/files/spectral-latin-400-italic.woff2": "assets/fonts/spectral-400-italic.woff2",
    "node_modules/@fontsource/spectral/files/spectral-latin-600-normal.woff2": "assets/fonts/spectral-600.woff2",
    "node_modules/@fontsource/spectral/files/spectral-latin-700-normal.woff2": "assets/fonts/spectral-700.woff2",
    "node_modules/@fontsource/spectral/files/spectral-latin-ext-400-normal.woff2": "assets/fonts/spectral-ext-400.woff2",
    "node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2": "assets/fonts/archivo-wdth.woff2",
    "node_modules/@fontsource-variable/archivo/files/archivo-latin-ext-wdth-normal.woff2": "assets/fonts/archivo-ext-wdth.woff2",
  });

  // --- Collections ----------------------------------------------------------
  const trierParDate = (a, b) =>
    a.data.debut - b.data.debut ||
    (a.data.fin ?? a.data.debut) - (b.data.fin ?? b.data.debut) ||
    a.data.title.localeCompare(b.data.title, "fr");

  eleventyConfig.addCollection("dossiers", (api) =>
    api.getFilteredByGlob("src/dossiers/*.md").sort(trierParDate)
  );

  eleventyConfig.addCollection("parTheme", (api) => {
    const tous = api.getFilteredByGlob("src/dossiers/*.md").sort(trierParDate);
    return themes.map((t) => ({
      ...t,
      dossiers: tous.filter((d) => d.data.theme === t.slug || (d.data.themesSecondaires || []).includes(t.slug)),
      principaux: tous.filter((d) => d.data.theme === t.slug),
    }));
  });

  eleventyConfig.addCollection("sources", (api) =>
    extraireSources(api.getFilteredByGlob("src/dossiers/*.md"))
  );

  // --- Filtres --------------------------------------------------------------
  eleventyConfig.addFilter("periode", (d) => {
    if (d.fin === undefined || d.fin === null || d.fin === d.debut) return String(d.debut);
    if (d.fin === "…" || d.fin === "en cours") return `${d.debut} – …`;
    return `${d.debut} – ${d.fin}`;
  });
  eleventyConfig.addFilter("theme", (slug) => themes.find((t) => t.slug === slug));
  eleventyConfig.addFilter("statut", (slug) => statuts.find((s) => s.slug === slug));
  eleventyConfig.addFilter("dateFr", (d) =>
    new Date(d).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Brussels" })
  );
  eleventyConfig.addFilter("dateIso", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("md", (s) => (s ? md.renderInline(String(s)) : ""));
  eleventyConfig.addFilter("mdBloc", (s) => (s ? md.render(String(s)) : ""));
  eleventyConfig.addFilter("slug", slugifier);
  eleventyConfig.addFilter("nbNotes", (item) => (item.rawInput?.match(/^\[\^[^\]]+\]:/gm) || []).length);
  eleventyConfig.addFilter("enListe", (arr) => {
    if (!arr || !arr.length) return "";
    if (arr.length === 1) return arr[0];
    return arr.slice(0, -1).join(", ") + " et " + arr.at(-1);
  });
  eleventyConfig.addFilter("groupBy", (arr, key) => {
    const m = new Map();
    for (const x of arr) {
      const k = key.split(".").reduce((o, p) => o?.[p], x);
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(x);
    }
    return [...m.entries()];
  });
  eleventyConfig.addFilter("decennie", (an) => Math.floor(an / 10) * 10);
  eleventyConfig.addFilter("parDecennie", (coll) => {
    const m = new Map();
    for (const d of coll) {
      const dec = Math.floor(Number(d.data.debut) / 10) * 10;
      if (!m.has(dec)) m.set(dec, []);
      m.get(dec).push(d);
    }
    return [...m.entries()].map(([decennie, dossiers]) => ({ decennie, dossiers }));
  });
  eleventyConfig.addFilter("nbNotesPage", (page, coll) => {
    const it = coll.find((d) => d.url === page.url);
    return (it?.rawInput?.match(/^\[\^[^\]]+\]:/gm) || []).length;
  });
  eleventyConfig.addFilter("totalNotes", (coll) =>
    coll.reduce((n, d) => n + (d.rawInput?.match(/^\[\^[^\]]+\]:/gm) || []).length, 0)
  );

  // Frise : place chaque dossier sur une piste sans chevauchement.
  const FRISE_DEBUT = 1880;
  const FRISE_FIN = 2030;
  eleventyConfig.addFilter("frise", (coll) => {
    const anneeCourante = new Date().getFullYear();
    const pistes = []; // fin occupée (en %) par piste
    const etendue = FRISE_FIN - FRISE_DEBUT;
    return coll.map((d) => {
      const debut = Number(d.data.debut);
      const finBrute = d.data.fin;
      const fin = typeof finBrute === "number" ? finBrute : finBrute ? anneeCourante : debut;
      const gauche = ((debut - FRISE_DEBUT) / etendue) * 100;
      const largeur = Math.max(((fin - debut + 1) / etendue) * 100, 0.9);
      let piste = pistes.findIndex((occupe) => occupe <= gauche - 0.4);
      if (piste === -1) {
        piste = pistes.length;
        pistes.push(0);
      }
      pistes[piste] = gauche + largeur;
      return { d, gauche, largeur, piste, enCours: typeof finBrute === "string" };
    });
  });
  eleventyConfig.addFilter("pistes", (items) => Math.max(...items.map((i) => i.piste)) + 1);
  eleventyConfig.addFilter("positionAnnee", (an) => ((an - FRISE_DEBUT) / (FRISE_FIN - FRISE_DEBUT)) * 100);

  // --- Préfixe de chemin (/diatribe/) appliqué à toutes les URL du HTML ----
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // --- Garde-fou éditorial : la build échoue si un dossier est mal sourcé ----
  eleventyConfig.on("eleventy.before", async () => {
    await validerDossiers("src/dossiers");
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    pathPrefix: process.env.PATH_PREFIX ?? "/diatribe/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
