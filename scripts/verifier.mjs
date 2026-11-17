// Vérifie la cohérence de toutes les cartes et notes de cours.
// Usage : node scripts/verifier.mjs            (exit 1 s'il y a des erreurs)
//         node scripts/verifier.mjs --doublons (affiche aussi les quasi-doublons entre decks)
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { ALL_CARDS, LANGUES, NIVEAUX } from "../data/index.js";
import { NOTES } from "../data/notes/index.js";

const errors = [], warnings = [];
const E = (m) => errors.push(m), W = (m) => warnings.push(m);
const ROOT = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, ROOT), "utf8");

// ---------- cartes ----------
const deckIds = new Set(LANGUES.map((l) => l.id));
const seen = new Set();
for (const c of ALL_CARDS) {
  if (seen.has(c.id)) E(`carte ${c.id} : id en double`);
  seen.add(c.id);
  if (!deckIds.has(c.langue)) E(`carte ${c.id} : deck « ${c.langue} » absent de LANGUES (data/index.js)`);
  if (!NIVEAUX.includes(c.niveau)) E(`carte ${c.id} : niveau « ${c.niveau} » invalide`);
  if (!c.front) E(`carte ${c.id} : front vide`);
  if (c.type === "qcm") {
    if (!Array.isArray(c.choices) || c.choices.length < 2) E(`carte ${c.id} : QCM sans choix`);
    if (!(c.answer >= 0 && c.answer < (c.choices || []).length)) E(`carte ${c.id} : answer hors limites`);
    if (!c.explain) E(`carte ${c.id} : QCM sans explain`);
  } else if (c.type === "flip" || c.type === "code") {
    if (!c.back) E(`carte ${c.id} : back vide`);
    if (c.type === "code" && !c.code) E(`carte ${c.id} : carte code sans champ code`);
  } else E(`carte ${c.id} : type « ${c.type} » inconnu`);
}
for (const l of LANGUES) if (!ALL_CARDS.some((c) => c.langue === l.id)) W(`deck ${l.id} : aucune carte`);

// ---------- notes ----------
const TYPES = new Set(["texte", "liste", "code", "definition", "exemple", "application", "attention", "formule", "schema", "tableau", "renvoi"]);
const noteIds = new Set(NOTES.map((n) => n.id));
const resolvable = (v) => (v.startsWith("note:") ? noteIds.has(v.slice(5).split("#")[0]) : deckIds.has(v));
const sw = read("sw.js"), index = read("data/notes/index.js");
for (const n of NOTES) {
  const where = `note ${n.id}`;
  for (const f of ["id", "titre", "source", "resume", "chapitres"]) if (!n[f] || (Array.isArray(n[f]) && !n[f].length)) E(`${where} : champ « ${f} » manquant`);
  if (!Array.isArray(n.concepts) || !n.concepts.length) E(`${where} : liste « concepts » vide (indispensable pour l'anti-doublon)`);
  if (n.deck && !deckIds.has(n.deck)) E(`${where} : deck « ${n.deck} » absent de LANGUES`);
  if (!existsSync(new URL(`data/notes/${n.id}.js`, ROOT))) E(`${where} : fichier data/notes/${n.id}.js introuvable (le nom du fichier doit être l'id)`);
  if (!sw.includes(`"data/notes/${n.id}.js"`)) E(`${where} : data/notes/${n.id}.js absent du PRECACHE de sw.js`);
  for (const v of n.prerequis || []) if (!resolvable(v)) E(`${where} : prérequis « ${v} » introuvable`);
  const chapIds = new Set();
  (n.chapitres || []).forEach((ch, i) => {
    const w = `${where} > chapitre ${ch.id || i}`;
    if (!ch.id || !ch.titre) E(`${w} : id ou titre manquant`);
    if (chapIds.has(ch.id)) E(`${w} : id de chapitre en double`);
    chapIds.add(ch.id);
    if (!ch.blocs || !ch.blocs.length) E(`${w} : aucun bloc`);
    (ch.blocs || []).forEach((b, j) => {
      const wb = `${w} > bloc ${j} (${b.type})`;
      if (!TYPES.has(b.type)) return E(`${wb} : type inconnu`);
      if (["texte", "code", "attention", "formule", "renvoi"].includes(b.type) && !b.contenu) E(`${wb} : contenu vide`);
      if (b.type === "liste" && !(b.items || []).length) E(`${wb} : liste vide`);
      if (b.type === "definition" && (!b.terme || !b.contenu)) E(`${wb} : terme ou contenu manquant`);
      if ((b.type === "exemple" || b.type === "application") && !b.contenu && !b.code && !b.resultat) E(`${wb} : ni contenu, ni code, ni résultat`);
      if (b.type === "tableau") {
        const k = (b.entetes || []).length;
        if (!k) E(`${wb} : entêtes manquantes`);
        (b.lignes || []).forEach((r, x) => { if (r.length !== k) E(`${wb} : ligne ${x} a ${r.length} cellules au lieu de ${k}`); });
      }
      if (b.type === "renvoi") { if (!b.vers) E(`${wb} : champ « vers » manquant`); else if (!resolvable(b.vers)) E(`${wb} : cible « ${b.vers} » introuvable`); }
      if (b.type === "schema") checkSvg(b, wb);
    });
  });
  (n.synthese || []).forEach((b, j) => checkSvg(b, `${where} > synthèse ${j}`));
  if (!(n.aRetenir || []).length) W(`${where} : pas de section « À retenir »`);
}
function checkSvg(b, wb) {
        const s = String(b.svg || "").trim();
        if (!s.startsWith("<svg") || !s.endsWith("</svg>")) E(`${wb} : svg doit commencer par <svg et finir par </svg>`);
        if (!/viewBox=/.test(s)) E(`${wb} : viewBox manquant`);
        if (/<script|<[^>]*\son\w+\s*=|javascript:|<foreignObject|href\s*=\s*["']https?:/i.test(s)) E(`${wb} : contenu interdit dans le svg (script, on*=, lien externe, foreignObject)`);
        if (/\b(width|height)="\d+(px)?"/.test(s.slice(0, s.indexOf(">")))) W(`${wb} : width/height fixes sur <svg> (préférer viewBox seul)`);
        const opens = (s.match(/<(svg|g|text|tspan|defs|marker|title)\b[^>]*?(?<!\/)>/g) || []).length;
        const closes = (s.match(/<\/(svg|g|text|tspan|defs|marker|title)>/g) || []).length;
        if (opens !== closes) E(`${wb} : balises svg mal fermées (${opens} ouvertes, ${closes} fermées)`);
        if (!/class="s-/.test(s)) W(`${wb} : aucune classe s-* (le schéma ne suivra pas le thème clair/sombre)`);
        if (!b.legende) W(`${wb} : schéma sans légende`);
}
// notes présentes sur disque mais non enregistrées
for (const f of readdirSync(new URL("data/notes/", ROOT))) {
  if (f === "index.js" || !f.endsWith(".js")) continue;
  if (!noteIds.has(f.replace(/\.js$/, ""))) E(`data/notes/${f} : fichier non enregistré dans data/notes/index.js`);
}
// fichiers de cartes non pré-cachés
for (const f of readdirSync(new URL("data/", ROOT))) {
  if (/^(cards|extras)-.*\.js$/.test(f) && !sw.includes(`"data/${f}"`)) E(`data/${f} absent du PRECACHE de sw.js`);
}
if (!index.includes("export const NOTES")) E("data/notes/index.js : export NOTES introuvable");

// ---------- quasi-doublons entre decks ----------
const STOP = new Set("le la les un une des de du d l et ou a au aux en dans pour par sur avec sans que qui quoi quel quelle quels quelles est sont ce cette ces se sa son ses on il elle ne pas plus moins comme entre vs y t s n qu c j m".split(" "));
const tokens = (s) => new Set(String(s).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9_]+/g, " ").split(" ").filter((w) => w.length > 2 && !STOP.has(w)));
const jacc = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); };
const pairs = [];
const toks = ALL_CARDS.map((c) => tokens(c.front));
for (let i = 0; i < ALL_CARDS.length; i++) for (let j = i + 1; j < ALL_CARDS.length; j++) {
  if (ALL_CARDS[i].langue === ALL_CARDS[j].langue) continue;
  const s = jacc(toks[i], toks[j]);
  if (s >= 0.5) pairs.push([s, ALL_CARDS[i], ALL_CARDS[j]]);
}
pairs.sort((a, b) => b[0] - a[0]);

console.log(`Cartes : ${ALL_CARDS.length} · decks : ${LANGUES.length} · notes : ${NOTES.length}`);
if (args().includes("--doublons") || pairs.length) {
  console.log(`\nQuasi-doublons entre decks (similarité des questions ≥ 0,5) : ${pairs.length}`);
  for (const [s, a, b] of pairs.slice(0, 30)) console.log(`  ${s.toFixed(2)}  [${a.id}] ${a.front}\n        [${b.id}] ${b.front}`);
}
if (warnings.length) { console.log(`\nAvertissements (${warnings.length}) :`); warnings.forEach((w) => console.log("  - " + w)); }
if (errors.length) { console.log(`\nERREURS (${errors.length}) :`); errors.forEach((e) => console.log("  - " + e)); process.exitCode = 1; }
else console.log("\nOK : aucune erreur.");
function args() { return process.argv.slice(2); }
