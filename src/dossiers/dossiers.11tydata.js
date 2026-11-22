export default {
  layout: "layouts/dossier.njk",
  permalink: "/dossiers/{{ page.fileSlug }}/",
  // Le Markdown des dossiers n'est pas interprété par Nunjucks : on évite ainsi
  // qu'une accolade dans une citation casse la build.
  templateEngineOverride: "md",
};
