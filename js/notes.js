// Rendu des notes de cours (data/notes/*.js) en DOM.
// Le texte est toujours échappé ; seul le champ `svg` des blocs « schema » est injecté tel quel
// (contenu local écrit par le skill, contrôlé par scripts/verifier.mjs : pas de <script> ni d'attribut on*).

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Mise en forme en ligne minimale : **gras**, *italique*, `code`.
export function inline(text) {
  return esc(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
}

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};
const para = (text, cls = "note-p") => {
  const frag = document.createDocumentFragment();
  String(text ?? "").split(/\n{2,}/).forEach((p) => frag.appendChild(el("p", cls, inline(p).replace(/\n/g, "<br>"))));
  return frag;
};
const codeBlock = (code) => { const pre = el("pre", "a-code note-code"); pre.textContent = code; return pre; };

const LABELS = {
  exemple: "Exemple", application: "Application", attention: "Attention", definition: "Définition",
  formule: "Formule", renvoi: "Déjà vu ailleurs",
};

function block(b, ctx) {
  switch (b.type) {
    case "texte": return para(b.contenu);
    case "liste": {
      const ul = el(b.ordonnee ? "ol" : "ul", "note-list");
      (b.items || []).forEach((it) => ul.appendChild(el("li", "", inline(it))));
      return ul;
    }
    case "code": return codeBlock(b.contenu);
    case "definition": {
      const box = el("div", "note-box note-def");
      box.appendChild(el("div", "note-box-label", LABELS.definition));
      box.appendChild(el("p", "note-p", `<strong>${esc(b.terme)}</strong> — ${inline(b.contenu)}`));
      return box;
    }
    case "exemple": case "application": case "attention": {
      const box = el("div", `note-box note-${b.type}`);
      box.appendChild(el("div", "note-box-label", esc(b.titre ? `${LABELS[b.type]} · ${b.titre}` : LABELS[b.type])));
      if (b.contenu) box.appendChild(para(b.contenu));
      if (b.code) box.appendChild(codeBlock(b.code));
      if (b.resultat) { box.appendChild(el("div", "note-sub", "Résultat")); box.appendChild(codeBlock(b.resultat)); }
      return box;
    }
    case "formule": {
      const box = el("div", "note-box note-formule");
      box.appendChild(el("div", "note-box-label", LABELS.formule));
      box.appendChild(el("div", "note-formula", esc(b.contenu)));
      if (b.explication) box.appendChild(para(b.explication));
      return box;
    }
    case "schema": {
      const fig = el("figure", "note-schema");
      const holder = el("div", "note-svg");
      holder.innerHTML = b.svg;
      fig.appendChild(holder);
      if (b.legende || b.titre) fig.appendChild(el("figcaption", "", inline(b.legende || b.titre)));
      return fig;
    }
    case "tableau": {
      const wrap = el("div", "note-table-wrap");
      const t = el("table", "note-table");
      const thead = el("thead"); const trh = el("tr");
      (b.entetes || []).forEach((h) => trh.appendChild(el("th", "", inline(h))));
      thead.appendChild(trh); t.appendChild(thead);
      const tb = el("tbody");
      (b.lignes || []).forEach((row) => { const tr = el("tr"); row.forEach((c) => tr.appendChild(el("td", "", inline(c)))); tb.appendChild(tr); });
      t.appendChild(tb); wrap.appendChild(t);
      return wrap;
    }
    case "renvoi": {
      const box = el("div", "note-box note-renvoi");
      box.appendChild(el("div", "note-box-label", LABELS.renvoi));
      box.appendChild(para(b.contenu));
      const target = ctx.resolve(b.vers);
      if (target) {
        const a = el("button", "chip chip-link note-goto", esc(target.label));
        a.type = "button";
        a.addEventListener("click", target.go);
        box.appendChild(a);
      }
      return box;
    }
    default: return para(b.contenu || "");
  }
}

// Construit tout l'écran d'une note. ctx = { resolve(vers) -> {label, go} | null, reviser(deckId) }
export function renderNote(note, container, ctx) {
  container.innerHTML = "";
  const head = el("header", "note-head");
  head.appendChild(el("h1", "note-title", esc(note.titre)));
  if (note.source) head.appendChild(el("p", "note-source", esc(note.source)));
  if (note.resume) head.appendChild(para(note.resume, "note-resume"));
  container.appendChild(head);

  if (note.prerequis && note.prerequis.length) {
    const pre = el("div", "note-prereq");
    pre.appendChild(el("span", "note-prereq-label", "Prérequis"));
    note.prerequis.forEach((v) => {
      const t = ctx.resolve(v);
      if (!t) return;
      const b = el("button", "chip chip-link", esc(t.label)); b.type = "button"; b.addEventListener("click", t.go);
      pre.appendChild(b);
    });
    container.appendChild(pre);
  }

  const chapitres = note.chapitres || [];
  if (chapitres.length > 1) {
    const toc = el("nav", "note-toc");
    toc.appendChild(el("div", "panel-title", "Sommaire"));
    const ol = el("ol");
    const entrees = chapitres.map((c, i) => [c.titre, `ch-${note.id}-${i}`]);
    if (note.synthese && note.synthese.length) entrees.push(["Synthèse visuelle", `syn-${note.id}`]);
    entrees.forEach(([titre, cible]) => {
      const li = el("li");
      const a = el("a", "", esc(titre));
      a.href = "#"; a.addEventListener("click", (e) => { e.preventDefault(); document.getElementById(cible)?.scrollIntoView({ behavior: "smooth", block: "start" }); });
      li.appendChild(a); ol.appendChild(li);
    });
    toc.appendChild(ol);
    container.appendChild(toc);
  }

  chapitres.forEach((c, i) => {
    const sec = el("section", "note-chapter");
    sec.id = `ch-${note.id}-${i}`;
    sec.appendChild(el("h2", "note-h2", esc(c.titre)));
    if (c.objectif) sec.appendChild(el("p", "note-objectif", inline(c.objectif)));
    (c.blocs || []).forEach((b) => sec.appendChild(block(b, ctx)));
    container.appendChild(sec);
  });

  if (note.aRetenir && note.aRetenir.length) {
    const box = el("section", "note-box note-retenir");
    box.appendChild(el("div", "note-box-label", "À retenir"));
    const ul = el("ul", "note-list");
    note.aRetenir.forEach((it) => ul.appendChild(el("li", "", inline(it))));
    box.appendChild(ul);
    container.appendChild(box);
  }

  // Synthèse visuelle : le schéma qui résume toute la note, à redessiner de mémoire
  if (note.synthese && note.synthese.length) {
    const sec = el("section", "note-chapter note-synthese");
    sec.id = `syn-${note.id}`;
    sec.appendChild(el("h2", "note-h2", "Synthèse visuelle"));
    sec.appendChild(el("p", "note-objectif", "Regarde le schéma, cache-le, redessine-le de mémoire, puis compare."));
    note.synthese.forEach((s) => sec.appendChild(block({ type: "schema", ...s }, ctx)));
    container.appendChild(sec);
  }

  if (note.deck) {
    const btn = el("button", "btn-primary btn-big note-review", "Réviser les cartes de ce cours");
    btn.type = "button";
    btn.addEventListener("click", () => ctx.reviser(note.deck));
    container.appendChild(btn);
  }
}
