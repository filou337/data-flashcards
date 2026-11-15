import { cardsSQL } from "./cards-sql.js";
import { cardsM } from "./cards-m.js";
import { cardsDAX } from "./cards-dax.js";
import { cardsPySpark } from "./cards-pyspark.js";
import { cardsScala } from "./cards-scala.js";
import { cardsCasPratique } from "./cards-cas-pratique.js";
import { cardsStats } from "./cards-stats.js";
import { cardsRegression } from "./cards-regression.js";
import { cardsAnalyse } from "./cards-analyse.js";
import { cardsDataEng } from "./cards-dataeng.js";
import { cardsTests } from "./cards-tests.js";
import { cardsBigData } from "./cards-big-data.js";
import { cardsDaxPowerPivot } from "./cards-dax-power-pivot.js";
import { cardsScalaParExemple } from "./cards-scala-par-exemple.js";
import { cardsPysparkPratique } from "./cards-pyspark-pratique.js";
import { extrasSQL } from "./extras-sql.js";
import { extrasM } from "./extras-m.js";
import { extrasDAX } from "./extras-dax.js";
import { extrasPySpark } from "./extras-pyspark.js";
import { extrasScala } from "./extras-scala.js";
import { extrasCasPratique } from "./extras-cas-pratique.js";

// Explications (detail) et exemples (example) ajoutés aux cartes, par id.
export const EXTRAS = { ...extrasSQL, ...extrasM, ...extrasDAX, ...extrasPySpark, ...extrasScala, ...extrasCasPratique };

const BASE_CARDS = [
  ...cardsSQL,
  ...cardsM,
  ...cardsDAX,
  ...cardsPySpark,
  ...cardsScala,
  ...cardsCasPratique,
  ...cardsStats,
  ...cardsRegression,
  ...cardsAnalyse,
  ...cardsDataEng,
  ...cardsTests,
  ...cardsBigData,
  ...cardsDaxPowerPivot,
  ...cardsScalaParExemple,
  ...cardsPysparkPratique,
];

export const ALL_CARDS = BASE_CARDS.map((c) => (EXTRAS[c.id] ? { ...c, ...EXTRAS[c.id] } : c));

export const LANGUES = [
  { id: "sql", label: "SQL", color: "#2a5db0" },
  { id: "m", label: "M (Power Query)", color: "#1e7a6e" },
  { id: "dax", label: "DAX", color: "#a6631e" },
  { id: "pyspark", label: "PySpark", color: "#c4491d" },
  { id: "scala", label: "Scala", color: "#a32a2a" },
  { id: "cas-pratique", label: "Cas pratiques", color: "#5b3fa0" },
  { id: "stats", label: "Stats & tests", color: "#3a7d2c" },
  { id: "regression", label: "Régression & modélisation", color: "#1f6f9a" },
  { id: "analyse", label: "Analyse de données", color: "#8a3f7a" },
  { id: "dataeng", label: "Data engineering", color: "#5a6170" },
  { id: "tests", label: "Tests & qualité", color: "#a8452f" },
  { id: "big-data", label: "Big Data", color: "#6b5a1e" },
];

export const NIVEAUX = ["fondamentaux", "intermediaire", "avance", "pro"];
