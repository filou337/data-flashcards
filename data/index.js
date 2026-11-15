import { cardsSQL } from "./cards-sql.js";
import { cardsM } from "./cards-m.js";
import { cardsDAX } from "./cards-dax.js";
import { cardsPySpark } from "./cards-pyspark.js";
import { cardsScala } from "./cards-scala.js";
import { cardsCasPratique } from "./cards-cas-pratique.js";
import { cardsStats } from "./cards-stats.js";

export const ALL_CARDS = [
  ...cardsSQL,
  ...cardsM,
  ...cardsDAX,
  ...cardsPySpark,
  ...cardsScala,
  ...cardsCasPratique,
  ...cardsStats,
];

export const LANGUES = [
  { id: "sql", label: "SQL", color: "#2a5db0" },
  { id: "m", label: "M (Power Query)", color: "#1e7a6e" },
  { id: "dax", label: "DAX", color: "#a6631e" },
  { id: "pyspark", label: "PySpark", color: "#c4491d" },
  { id: "scala", label: "Scala", color: "#a32a2a" },
  { id: "cas-pratique", label: "Cas pratiques", color: "#5b3fa0" },
  { id: "stats", label: "Stats & tests", color: "#3a7d2c" },
];

export const NIVEAUX = ["fondamentaux", "intermediaire", "avance", "pro"];
