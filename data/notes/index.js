// Registre des notes de cours affichées dans l'app (écran « Notes de cours »).
// Chaque note vit dans son propre fichier data/notes/<id>.js et exporte `note`.
// Le skill /notes-de-cours ajoute ici l'import et l'entrée correspondante.
// Format complet : .claude/skills/notes-de-cours/format.md

import { note as bigData } from "./big-data.js";
import { note as daxPowerPivot } from "./dax-power-pivot.js";
import { note as scalaParExemple } from "./scala-par-exemple.js";
import { note as pysparkPratique } from "./pyspark-pratique.js";
import { note as transformers } from "./transformers.js";
import { note as dataMining } from "./data-mining.js";
import { note as python } from "./python.js";
import { note as fichesVisuelles } from "./fiches-visuelles.js";
import { note as ecosystemeHadoop } from "./ecosysteme-hadoop.js";
import { note as mlPreparation } from "./ml-preparation.js";

export const NOTES = [
  fichesVisuelles,
  bigData,
  ecosystemeHadoop,
  daxPowerPivot,
  scalaParExemple,
  pysparkPratique,
  transformers,
  dataMining,
  python,
  mlPreparation,
];
