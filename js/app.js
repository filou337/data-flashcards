import { ALL_CARDS, LANGUES, NIVEAUX } from "../data/index.js";
import { NOTES } from "../data/notes/index.js";
import { renderNote } from "./notes.js";
import { schedule, isDue, masteryLevel, todayISO } from "./srs.js";
import {
  getOrCreateCardState, recordReview, getStats, getAllCardStates,
  exportData, importData, resetProgress,
} from "./db.js";

// ---------- state ----------
const FILTER_KEY = "flashcards-filters-v1";
function loadFilters() {
  const allIds = LANGUES.map(l => l.id);
  try {
    const raw = localStorage.getItem(FILTER_KEY);
    if (raw) {
      const f = JSON.parse(raw);
      // Coche automatiquement les decks ajoutés depuis la dernière visite.
      const known = f.knownLangues || ["sql", "m", "dax", "pyspark", "scala", "cas-pratique"];
      const added = allIds.filter(id => !known.includes(id));
      return { ...f, langues: [...f.langues, ...added], knownLangues: allIds };
    }
  } catch {}
  return { langues: allIds, niveaux: [...NIVEAUX], size: 20, knownLangues: allIds };
}
function saveFilters() {
  localStorage.setItem(FILTER_KEY, JSON.stringify(filters));
}
let filters = loadFilters();

let session = null;     // { queue: [card,...], index, ratingsCount }
let currentCard = null;
let pendingRating = null;

// ---------- dom refs ----------
const $ = (id) => document.getElementById(id);
const screens = {
  home: $("screenHome"), session: $("screenSession"), done: $("screenDone"), stats: $("screenStats"), notes: $("screenNotes"),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

// ---------- home: filters ----------
function langColor(id) {
  return (LANGUES.find(l => l.id === id) || {}).color || "var(--ink-faint)";
}

function renderLangueChips() {
  const el = $("langueChips");
  el.innerHTML = "";
  LANGUES.forEach(l => {
    const btn = document.createElement("button");
    btn.className = "chip" + (filters.langues.includes(l.id) ? " chip-active" : "");
    btn.innerHTML = `<span class="dot" style="background:${l.color}"></span>${l.label}`;
    btn.addEventListener("click", () => {
      if (filters.langues.includes(l.id)) {
        filters.langues = filters.langues.filter(x => x !== l.id);
      } else {
        filters.langues = [...filters.langues, l.id];
      }
      saveFilters();
      renderLangueChips();
      refreshHomeStats();
    });
    el.appendChild(btn);
  });
}

const NIVEAU_LABELS = { fondamentaux: "Fondamentaux", intermediaire: "Intermédiaire", avance: "Avancé", pro: "Pro" };

function renderNiveauChips() {
  const el = $("niveauChips");
  el.innerHTML = "";
  NIVEAUX.forEach(n => {
    const btn = document.createElement("button");
    btn.className = "chip" + (filters.niveaux.includes(n) ? " chip-active" : "");
    btn.textContent = NIVEAU_LABELS[n];
    btn.addEventListener("click", () => {
      if (filters.niveaux.includes(n)) {
        filters.niveaux = filters.niveaux.filter(x => x !== n);
      } else {
        filters.niveaux = [...filters.niveaux, n];
      }
      saveFilters();
      renderNiveauChips();
      refreshHomeStats();
    });
    el.appendChild(btn);
  });
}

function renderSizeChips() {
  const buttons = $("sizeChips").querySelectorAll(".chip");
  buttons.forEach(btn => {
    const size = Number(btn.dataset.size);
    btn.classList.toggle("chip-active", size === filters.size);
    btn.onclick = () => {
      filters.size = size;
      saveFilters();
      renderSizeChips();
    };
  });
}

function filteredCards() {
  return ALL_CARDS.filter(c => filters.langues.includes(c.langue) && filters.niveaux.includes(c.niveau));
}

function refreshHomeStats() {
  const fc = filteredCards();
  const states = getAllCardStates();
  const due = fc.filter(c => isDue(states[c.id])).length;
  const mastered = fc.filter(c => masteryLevel(states[c.id]) === "maitrisee").length;
  $("statDue").textContent = due;
  $("statMastered").textContent = mastered;
  $("statTotal").textContent = fc.length;
  $("startHint").textContent = fc.length === 0
    ? "Aucune carte ne correspond à ces filtres."
    : (due === 0 ? "Tout est à jour — reviens plus tard, ou élargis les filtres." : "");
  $("streakCount").textContent = getStats().streak || 0;
}

// ---------- session ----------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startSession() {
  const states = getAllCardStates();
  let due = shuffle(filteredCards().filter(c => isDue(states[c.id])));
  if (due.length === 0) return;
  if (filters.size > 0) due = due.slice(0, filters.size);

  session = { queue: due, index: 0, ratingsCount: { again: 0, hard: 0, good: 0, easy: 0 } };
  showScreen("session");
  nextCard();
}

function updateProgress() {
  const pct = session.queue.length ? Math.round((session.index / session.queue.length) * 100) : 100;
  $("progressFill").style.width = pct + "%";
  $("progressCount").textContent = `${session.index}/${session.queue.length}`;
}

function nextCard() {
  updateProgress();
  if (session.index >= session.queue.length) { finishSession(); return; }
  currentCard = session.queue[session.index];
  renderCard(currentCard);
}

function renderCard(card) {
  pendingRating = null;
  $("cardLangueTag").textContent = LANGUES.find(l => l.id === card.langue)?.label || card.langue;
  $("cardLangueTag").style.background = langColor(card.langue);
  $("cardNiveauTag").textContent = NIVEAU_LABELS[card.niveau] || card.niveau;

  $("questionText").textContent = card.front;
  const qCode = $("questionCode");
  if (card.code) { qCode.textContent = card.code; qCode.hidden = false; } else { qCode.hidden = true; }

  const back = $("flashcardBack");
  back.hidden = true;
  back.removeAttribute("data-visible");
  $("answerText").innerHTML = "";

  const qcmEl = $("qcmChoices");
  qcmEl.innerHTML = "";
  $("btnReveal").hidden = false;
  $("ratingRow").hidden = true;

  if (card.type === "qcm") {
    $("btnReveal").hidden = true;
    qcmEl.hidden = false;
    card.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "qcm-choice";
      btn.textContent = choice;
      btn.addEventListener("click", () => selectQcmChoice(card, i));
      qcmEl.appendChild(btn);
    });
  } else {
    qcmEl.hidden = true;
  }
}

function renderAnswerContent(card) {
  const back = $("flashcardBack");
  back.hidden = false;
  back.dataset.visible = "true";
  const answerEl = $("answerText");
  if (card.type === "code") {
    const pre = document.createElement("pre");
    pre.className = "a-code";
    pre.textContent = card.back;
    answerEl.appendChild(pre);
  } else if (card.type === "qcm") {
    const p = document.createElement("p");
    p.textContent = card.explain;
    answerEl.appendChild(p);
  } else {
    answerEl.textContent = card.back;
  }
  // Explication et exemple complémentaires (data/extras-*.js)
  if (card.detail) {
    const sec = document.createElement("div");
    sec.className = "a-extra";
    const h = document.createElement("h4");
    h.textContent = "Pour comprendre";
    const p = document.createElement("p");
    p.textContent = card.detail;
    sec.append(h, p);
    answerEl.appendChild(sec);
  }
  if (card.example) {
    const sec = document.createElement("div");
    sec.className = "a-extra";
    const h = document.createElement("h4");
    h.textContent = "Exemple";
    const pre = document.createElement("pre");
    pre.className = "a-code a-example";
    pre.textContent = card.example;
    sec.append(h, pre);
    answerEl.appendChild(sec);
  }
}

function selectQcmChoice(card, i) {
  const buttons = $("qcmChoices").querySelectorAll(".qcm-choice");
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (idx === card.answer) b.classList.add("correct");
    else if (idx === i) b.classList.add("wrong");
  });
  pendingRating = i === card.answer ? "good" : "again";
  renderAnswerContent(card);
  showRatingRow(card);
}

$("btnReveal").addEventListener("click", () => {
  renderAnswerContent(currentCard);
  $("btnReveal").hidden = true;
  showRatingRow(currentCard);
});

function showRatingRow(card) {
  const state = getOrCreateCardState(card.id);
  ["hard", "good", "easy"].forEach(r => {
    const preview = schedule(state, r);
    const el = $("ratePreview" + r[0].toUpperCase() + r.slice(1));
    el.textContent = preview.interval <= 0 ? "auj." : `+${preview.interval}j`;
  });
  $("ratingRow").hidden = false;
}

// Raccourcis clavier pendant une session :
//   Espace / Entrée : voir la réponse
//   1-4 ou A-D      : choisir une réponse de QCM
//   1-4             : noter la carte (Encore, Difficile, Bien, Facile) une fois la réponse affichée
document.addEventListener("keydown", (e) => {
  if (!$("screenSession").classList.contains("active") || !currentCard) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (e.target && e.target.tagName) || "";
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  const key = e.key;
  if ((key === " " || key === "Enter") && !$("btnReveal").hidden) {
    e.preventDefault();
    $("btnReveal").click();
    return;
  }
  if (!$("ratingRow").hidden) {
    const ratings = { "1": "again", "2": "hard", "3": "good", "4": "easy" };
    if (ratings[key]) { e.preventDefault(); onRate(ratings[key]); }
    else if (key === " ") e.preventDefault();   // pas de défilement involontaire
    return;
  }
  if (currentCard.type === "qcm") {
    const idx = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 }[key.toLowerCase()];
    const buttons = $("qcmChoices").querySelectorAll(".qcm-choice");
    if (idx !== undefined && buttons[idx] && !buttons[idx].disabled) { e.preventDefault(); buttons[idx].click(); }
    else if (key === " ") e.preventDefault();
  }
});

$("ratingRow").addEventListener("click", (e) => {
  const btn = e.target.closest(".rate-btn");
  if (!btn || !currentCard) return;
  onRate(btn.dataset.rating);
});

function onRate(rating) {
  const card = currentCard;
  const state = getOrCreateCardState(card.id);
  const newState = schedule(state, rating);
  recordReview(card.id, newState);
  session.ratingsCount[rating]++;

  if (rating === "again") {
    const insertAt = Math.min(session.queue.length, session.index + 4);
    session.queue.splice(insertAt, 0, card);
  }
  session.index++;
  nextCard();
}

$("btnQuit").addEventListener("click", () => {
  if (confirm("Quitter la session en cours ?")) { showScreen("home"); refreshHomeStats(); }
});

// ---------- fin de session ----------
function finishSession() {
  const rc = session.ratingsCount;
  const total = rc.again + rc.hard + rc.good + rc.easy;
  $("doneSummary").textContent = `${total} carte${total > 1 ? "s" : ""} révisée${total > 1 ? "s" : ""}.`;
  $("doneAgain").textContent = rc.again;
  $("doneHard").textContent = rc.hard;
  $("doneGood").textContent = rc.good;
  $("doneEasy").textContent = rc.easy;
  const streak = getStats().streak || 0;
  $("streakMsg").textContent = streak > 1 ? `Série en cours : ${streak} jours !` : "Première carte du streak — reviens demain !";
  showScreen("done");
  launchConfetti();
}

$("btnBackHome").addEventListener("click", () => { showScreen("home"); refreshHomeStats(); });

// ---------- confetti ----------
function launchConfetti() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = $("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth; canvas.height = innerHeight;
  if (reduced) return;

  const colors = ["#1c7c77", "#a6631e", "#2a5db0", "#c4491d", "#a32a2a"];
  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.4,
    r: 4 + Math.random() * 5,
    c: colors[Math.floor(Math.random() * colors.length)],
    vy: 2 + Math.random() * 3,
    vx: -1.5 + Math.random() * 3,
    rot: Math.random() * Math.PI,
    vr: -0.2 + Math.random() * 0.4,
  }));
  let frame = 0;
  function tick() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    });
    if (frame < 130) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  tick();
}

// ---------- stats screen ----------
function renderStatsScreen() {
  const states = getAllCardStates();
  const el = $("masteryBars");
  el.innerHTML = "";
  LANGUES.forEach(l => {
    const cards = ALL_CARDS.filter(c => c.langue === l.id);
    const mastered = cards.filter(c => masteryLevel(states[c.id]) === "maitrisee").length;
    const pct = cards.length ? Math.round((mastered / cards.length) * 100) : 0;
    const row = document.createElement("div");
    row.className = "mastery-row";
    row.innerHTML = `
      <div class="mastery-head"><span>${l.label}</span><span>${mastered}/${cards.length}</span></div>
      <div class="mastery-track"><div class="mastery-fill" style="width:${pct}%;background:${l.color}"></div></div>`;
    el.appendChild(row);
  });

  const heat = $("weekHeat");
  heat.innerHTML = "";
  const stats = getStats();
  const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  days.forEach(dISO => {
    const count = stats.history[dISO] || 0;
    const jsDay = new Date(dISO + "T00:00:00").getDay(); // 0=Sun
    const label = dayLabels[(jsDay + 6) % 7];
    const cell = document.createElement("div");
    cell.className = "week-day";
    const intensity = count === 0 ? "var(--bg-sunken)" : count < 10 ? "var(--accent-soft)" : "var(--accent)";
    const textColor = count >= 10 ? "#fff" : "var(--ink-faint)";
    cell.innerHTML = `<div class="cell" style="background:${intensity};color:${textColor}">${count || ""}</div><div class="lbl">${label}</div>`;
    heat.appendChild(cell);
  });
}

$("btnStats").addEventListener("click", () => { renderStatsScreen(); showScreen("stats"); });
$("btnStatsBack").addEventListener("click", () => { showScreen("home"); refreshHomeStats(); });

$("btnExport").addEventListener("click", () => {
  const blob = new Blob([exportData()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `data-flashcards-progression-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

$("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      importData(reader.result);
      renderStatsScreen();
      refreshHomeStats();
      alert("Progression importée.");
    } catch {
      alert("Fichier invalide.");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

$("btnReset").addEventListener("click", () => {
  if (confirm("Réinitialiser toute la progression ? Cette action est irréversible.")) {
    resetProgress();
    renderStatsScreen();
    refreshHomeStats();
  }
});

// ---------- start ----------
$("btnStart").addEventListener("click", startSession);

renderLangueChips();
renderNiveauChips();
renderSizeChips();
refreshHomeStats();
showScreen("home");

// ---------- notes de cours ----------
function noteTarget(vers) {
  if (!vers) return null;
  if (vers.startsWith("note:")) {
    const [id, chap] = vers.slice(5).split("#");
    const note = NOTES.find((n) => n.id === id);
    if (!note) return null;
    return { label: note.titre, go: () => openNote(id, chap) };
  }
  const deck = LANGUES.find((l) => l.id === vers);
  if (deck) return { label: "Cartes · " + deck.label, go: () => reviserDeck(deck.id) };
  return null;
}
function reviserDeck(deckId) {
  filters.langues = [deckId];
  saveFilters();
  renderLangueChips();
  showScreen("home");
  startSession();
  if (!session || !$("screenSession").classList.contains("active")) {
    refreshHomeStats();
    $("startHint").textContent = "Aucune carte à réviser aujourd'hui pour ce deck : reviens demain !";
  }
}
function openNote(id, chap) {
  const note = NOTES.find((n) => n.id === id);
  if (!note) return;
  renderNote(note, $("noteContent"), { resolve: noteTarget, reviser: reviserDeck });
  showScreen("notes");
  const i = chap === undefined ? -1 : (note.chapitres || []).findIndex((c, k) => c.id === chap || String(k) === chap);
  if (i >= 0) document.getElementById(`ch-${note.id}-${i}`)?.scrollIntoView({ block: "start" });
  else window.scrollTo(0, 0);
}
function renderNotesPanel() {
  const box = $("notesLinks");
  box.innerHTML = "";
  NOTES.forEach((n) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip chip-link";
    b.textContent = n.titre;
    b.addEventListener("click", () => openNote(n.id));
    box.appendChild(b);
  });
  $("notesEmpty").hidden = NOTES.length > 0;
}
$("btnNotesBack").addEventListener("click", () => { showScreen("home"); refreshHomeStats(); window.scrollTo(0, 0); });
renderNotesPanel();

// Figures : ouvrir la version claire si le téléphone est en thème clair.
if (matchMedia("(prefers-color-scheme: light)").matches) {
  document.querySelectorAll("#figureLinks a[data-light]").forEach((a) => { a.href = a.dataset.light; });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
