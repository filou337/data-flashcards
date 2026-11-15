// Registre des notes de cours affichées dans l'app (écran « Notes de cours »).
// Chaque note vit dans son propre fichier data/notes/<id>.js et exporte `note`.
// Le skill /notes-de-cours ajoute ici l'import et l'entrée correspondante.
// Format complet : .claude/skills/notes-de-cours/format.md

import { note as bigData } from "./big-data.js";
import { note as daxPowerPivot } from "./dax-power-pivot.js";
import { note as scalaParExemple } from "./scala-par-exemple.js";

export const NOTES = [
  bigData,
  daxPowerPivot,
  scalaParExemple,
];
