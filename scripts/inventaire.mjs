// Inventaire de tout le contenu existant (cartes + notes), pour éviter les doublons.
// Usage : node scripts/inventaire.mjs [--json] [--deck <id>] [--cherche "mot1 mot2"]
//   sans option : liste compacte de toutes les questions par deck + concepts de chaque note
//   --cherche     : n'affiche que les cartes / notes contenant au moins un des mots (sans accents ni casse)
import { ALL_CARDS, LANGUES } from "../data/index.js";
import { NOTES } from "../data/notes/index.js";

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const norm = (s) => String(s ?? "").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const deckFilter = opt("--deck");
const words = (opt("--cherche") || "").split(/\s+/).filter(Boolean).map(norm);
const hit = (text) => !words.length || words.some((w) => norm(text).includes(w));

const cards = ALL_CARDS.filter((c) => (!deckFilter || c.langue === deckFilter));
const notes = NOTES.map((n) => ({
  id: n.id, titre: n.titre, deck: n.deck, source: n.source,
  concepts: n.concepts || [],
  chapitres: (n.chapitres || []).map((c) => c.id + " · " + c.titre),
}));

if (args.includes("--json")) {
  console.log(JSON.stringify({
    decks: LANGUES.map((l) => ({ ...l, cartes: ALL_CARDS.filter((c) => c.langue === l.id).length })),
    cartes: cards.filter((c) => hit(c.front + " " + (c.back || c.explain || ""))).map((c) => ({ id: c.id, deck: c.langue, niveau: c.niveau, type: c.type, question: c.front })),
    notes: notes.filter((n) => hit(n.titre + " " + n.concepts.join(" ") + " " + n.chapitres.join(" "))),
  }, null, 1));
  process.exit(0);
}

console.log(`# Inventaire : ${ALL_CARDS.length} cartes, ${LANGUES.length} decks, ${NOTES.length} notes de cours\n`);
console.log("## Decks");
for (const l of LANGUES) console.log(`- ${l.id} (${l.label}) : ${ALL_CARDS.filter((c) => c.langue === l.id).length} cartes`);

console.log("\n## Notes de cours");
if (!notes.length) console.log("(aucune)");
for (const n of notes) {
  if (!hit(n.titre + " " + n.concepts.join(" ") + " " + n.chapitres.join(" "))) continue;
  console.log(`- note:${n.id} « ${n.titre} » — deck ${n.deck || "—"} — ${n.source || ""}`);
  console.log(`  chapitres : ${n.chapitres.join(" | ")}`);
  console.log(`  concepts  : ${n.concepts.join(", ")}`);
}

console.log("\n## Questions des cartes" + (words.length ? ` (filtre : ${words.join(", ")})` : ""));
let deck = null;
for (const c of cards) {
  if (!hit(c.front + " " + (c.back || c.explain || ""))) continue;
  if (c.langue !== deck) { deck = c.langue; console.log(`\n### ${deck}`); }
  console.log(`- [${c.id}] ${c.front}`);
}
