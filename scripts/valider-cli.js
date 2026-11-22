import { validerDossiers } from "./valider-dossiers.js";

try {
  await validerDossiers("src/dossiers");
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
