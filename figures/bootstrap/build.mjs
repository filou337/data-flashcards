// Figure « Bootstrap » construite avec le skill anatomy.
// node figures/bootstrap/build.mjs [--light]
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKILL = join(homedir(), ".claude/skills/anatomy");
const k = await import(pathToFileURL(join(SKILL, "kit/iso-kit.mjs")));
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")));

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const WIDTH = 640, HEIGHT = 360;

// ---------- modèle : 12 paniers observés (€), distribution asymétrique ----------
const DATA = [12, 15, 18, 20, 22, 25, 27, 30, 34, 41, 55, 80];
const N_BOOT = 1000;
const LO = 16, HI = 50, BW = 2;                 // colonnes de l'histogramme : [16, 18), … [48, 50)
const COLS = (HI - LO) / BW;
const MODEL = `
const DATA = ${JSON.stringify(DATA)}, N_BOOT = ${N_BOOT}, LO = ${LO}, HI = ${HI}, BW = ${BW}, COLS = ${COLS};
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
function resample(r) { const idx = []; for (let i = 0; i < DATA.length; i++) idx.push(Math.floor(r() * DATA.length)); return idx; }
function quantile(sorted, p) { const h = (sorted.length - 1) * p, i = Math.floor(h); return sorted[i] + (sorted[Math.min(i + 1, sorted.length - 1)] - sorted[i]) * (h - i); }
function colOf(m) { return Math.max(0, Math.min(COLS - 1, Math.floor((m - LO) / BW))); }
`;
const M = new Function(MODEL + "return { rng, mean, resample, quantile, colOf };")();
// on vérifie le résultat au build, avec le même générateur que la page
{
  const r = M.rng(7), means = [];
  for (let b = 0; b < N_BOOT; b++) means.push(M.mean(M.resample(r).map((i) => DATA[i])));
  means.sort((a, b) => a - b);
  console.log("moyenne", M.mean(DATA).toFixed(2), "IC95", M.quantile(means, 0.025).toFixed(1), M.quantile(means, 0.975).toFixed(1), "min/max", means[0].toFixed(1), means[N_BOOT - 1].toFixed(1));
}

// ---------- géométrie ----------
const PLATE = { x: -176, y: -58, w: 352, d: 112, r: 8 };
const PLATE_H = 10, FOOT_H = 5;
const TRAY = { x: -168, y: -36, w: 66, d: 50, r: 3 };
const TRAY_Z = 6;
const PUCK_R = 6;
const HSCALE = 0.32;                                          // hauteur par € (palets et copies)
const puckAt = DATA.map((_, i) => [TRAY.x + 11 + (i % 4) * 14.5, TRAY.y + 11 + Math.floor(i / 4) * 14]);
const SAMPLE = { x: -90, y: -6, w: 82, d: 12, r: 1.5 };
const slotX = (i) => SAMPLE.x + 4 + i * 6.7 + 2.2;
const HIST_X = 6, COL_W = 9.2, COL_P = 10.6;
const colX = (c) => HIST_X + c * COL_P;
const HIST = { x: HIST_X - 4, y: -26, w: COLS * COL_P + 6, d: 22, r: 2 };
const xOfValue = (v) => HIST_X + ((v - LO) / BW) * COL_P - (COL_P - COL_W) / 2;
const RULER = { x: HIST.x, y: 6, w: HIST.w, d: 10, r: 1.2 };
const BAR_Z = 2, BAR_SCALE = 0.36;                            // hauteur d'une colonne par tirage
const RAIL_Y = [TRAY.y - 8, TRAY.y + TRAY.d + 6];
const BRIDGE_Z = 42, TIP_Z = 31;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [TRAY.x, RAIL_Y[0], BRIDGE_Z + 6], [colX(8), HIST.y, 62]],
  WIDTH, HEIGHT, { pad: 14, azimuth: 56 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const screws = (plan, inset, z, size = 0.45) => D(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size });
const halo = (plan) => `<path class="iso-halo" d="${k.haloOf(plan, 0, 0.1, P)}" style="filter:blur(3px)"/>`;
const label = (word, cx, y, w) => {
  const plan = { x: cx - w / 2, y, w, d: 8, r: 1.2 };
  return S(k.slabOf(plan, 0, 0.8, P, 3, 0.3), { tone: "lo", crease: "none" }) +
    D([at([plan.x + 1.8, plan.y + 4, 0.8]), at([plan.x + plan.w - 1.8, plan.y + 4, 0.8])], { size: 0.4 }) +
    k.faceTextSvg(k.topMatrix([cx, plan.y + 5.6], 0.8, P, "x"), word, { size: 4.2, tone: "hi", anchor: "middle" });
};

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid", inner: L(k.sideSeam(PLATE, -PLATE_H / 2, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const corner = k.corners(PLATE, 10);
  out.push(L(corner.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(corner.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  out.push(label("ÉCHANTILLON", TRAY.x + TRAY.w / 2, 40, 50));
  out.push(label("TIRAGE", SAMPLE.x + SAMPLE.w / 2, 40, 34));
  out.push(label("MOYENNES", HIST.x + HIST.w / 2, 40, 44));
  return out.join("");
}

// rails du pont roulant
function rails() {
  const out = [];
  for (const y of RAIL_Y) {
    out.push(S(k.slabOf({ x: TRAY.x - 4, y: y - 2, w: TRAY.w + 8, d: 4, r: 1 }, 0, 3, P, 2, 0.4), { tone: "mid" }));
    out.push(D([TRAY.x, TRAY.x + TRAY.w].map((x) => at([x, y, 3])), { size: 0.4 }));
  }
  return out.join("");
}

// plateau de données : 12 palets, hauteur = montant
function tray() {
  const out = [halo(TRAY), S(k.slabOf(TRAY, 0, TRAY_Z, P, 5, 0.8), { tone: "lo", inner: L(k.sideSeam(TRAY, TRAY_Z / 2, P, 5), { tone: "faint" }) })];
  out.push(screws(TRAY, 2.4, TRAY_Z));
  const order = puckAt.map((p, i) => [p[0], p[1], i]);
  for (const [x, y] of byDepth(order)) out.push(L(k.ring(x, y, PUCK_R + 1.2, TRAY_Z, P, 28), { tone: "faint" }));
  for (const [x, y, i] of byDepth(order)) {
    const h = DATA[i] * HSCALE;
    out.push(`<g data-part="puck${i}">${S(k.cylinder(x, y, PUCK_R, TRAY_Z, h, P, 32, 0.5), { tone: "hi", crease: "lo" })}${L(k.ring(x, y, PUCK_R - 1.6, TRAY_Z + h, P, 24), { tone: "lo" })}</g>`);
    out.push(`<g data-part="tally${i}"></g>`);
  }
  return out.join("");
}

// rail de tirage : 12 emplacements où s'alignent les copies
function sampleRail() {
  const out = [halo(SAMPLE), S(k.slabOf(SAMPLE, 0, 4, P, 3, 0.5), { tone: "lo" })];
  for (let i = 0; i < 12; i++) out.push(L(k.ring(slotX(i), 0, 2.6, 4, P, 16), { tone: "faint" }));
  out.push(D([at([SAMPLE.x + 1.6, 0, 4]), at([SAMPLE.x + SAMPLE.w - 1.6, 0, 4])], { size: 0.4 }));
  out.push(`<g data-part="beads"></g>`);
  return out.join("");
}

function histBed() {
  const out = [halo(HIST), S(k.slabOf(HIST, 0, BAR_Z, P, 4, 0.6), { tone: "lo" })];
  for (let c = 0; c < COLS; c++) out.push(L(k.planOutline({ x: colX(c), y: HIST.y + 4, w: COL_W, d: HIST.d - 8, r: 0.8 }, BAR_Z, P, 2), { tone: "faint" }));
  // dos de l'histogramme : panneau gradué
  const back = { x: HIST.x, y: HIST.y - 3, w: HIST.w, d: 3, r: 0.6 };
  out.push(S(k.slabOf(back, 0, 58, P, 2, 0.4), { tone: "mid", inner: L(k.sideSeam(back, 30, P, 2), { tone: "faint" }) }));
  out.push(D([HIST.x + 3, HIST.x + HIST.w - 3].map((x) => at([x, back.y + 3, 54])), { size: 0.45 }));
  return out.join("");
}
function ruler() {
  const out = [S(k.slabOf(RULER, 0, 1.6, P, 3, 0.4), { tone: "lo", crease: "none" })];
  const ticks = k.topTicks(xOfValue(LO + 0) + (COL_P - COL_W) / 2, xOfValue(HI) + (COL_P - COL_W) / 2, COL_P / 2, 5, RULER.y + 0.6, 1.6, [1.8, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  for (let v = 20; v <= 45; v += 5) out.push(k.faceTextSvg(k.topMatrix([xOfValue(v) + (COL_P - COL_W) / 2, RULER.y + 8.4], 1.6, P, "x"), v + " €", { size: 3.6, tone: "hi", anchor: "middle" }));
  // moyenne observée : repère fixe
  const mx = xOfValue(M.mean(DATA)) + (COL_P - COL_W) / 2;
  out.push(L(k.lineOnTop([mx, RULER.y], [mx, RULER.y + 4.8], 1.6, P), { tone: "hi" }));
  out.push(D([at([mx, RULER.y + 4.8, 1.6])], { size: 0.7, tone: "hi" }));
  return out.join("");
}
const flagSvg = (x) =>
  S(k.slabOf({ x: x - 2.5, y: RULER.y - 3, w: 5, d: 3, r: 0.6 }, 0, 4, P, 2, 0.3), { tone: "mid" }) +
  S(k.cylinder(x, RULER.y - 1.5, 0.7, 4, 30, P, 12), { tone: "mid", crease: "none" }) +
  S(k.slabOf({ x, y: RULER.y - 2, w: 8, d: 1, r: 0.3 }, 27, 6, P, 2), { tone: "hi", crease: "lo", inner: L(k.sideSeam({ x, y: RULER.y - 2, w: 8, d: 1, r: 0.3 }, 30, P, 2), { tone: "red" }) });

// pont roulant : deux chariots, deux montants, une poutre, une tête qui pointe un palet
const bridgeSvg = () => {
  const out = [];
  for (const y of RAIL_Y) {
    out.push(S(k.slabOf({ x: -6, y: y - 4, w: 12, d: 8, r: 1.4 }, 3, 3, P, 3, 0.4), { tone: "mid" }));
    out.push(S(k.slabOf({ x: -2, y: y - 2, w: 4, d: 4, r: 0.8 }, 6, BRIDGE_Z - 6, P, 2, 0.4), { tone: "mid" }));
  }
  const beam = { x: -3, y: RAIL_Y[0] - 3, w: 6, d: RAIL_Y[1] - RAIL_Y[0] + 6, r: 1 };
  out.push(S(k.slabOf(beam, BRIDGE_Z, 4, P, 2, 0.5), { tone: "mid", inner: L(k.sideSeam(beam, BRIDGE_Z + 2, P, 2), { tone: "faint" }) }));
  return out.join("");
};
const headSvg = () =>
  S(k.slabOf({ x: -5, y: -5, w: 10, d: 10, r: 1.4 }, BRIDGE_Z - 4, 4, P, 3, 0.4), { tone: "mid" }) +
  S(k.cylinder(0, 0, 1.4, TIP_Z + 2, BRIDGE_Z - 4 - TIP_Z - 2, P, 14), { tone: "mid", crease: "none" }) +
  S(k.cylinder(0, 0, 2.6, TIP_Z, 2, P, 18, 0.3), { tone: "hi", crease: "lo" });

const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label:
    "Une machine à rééchantillonner. À gauche, un plateau porte 12 palets, les 12 paniers observés, de 12 à 80 euros, chacun aussi haut que son montant. Un pont roulant pointe 12 palets au hasard, avec remise : un même palet peut être pointé plusieurs fois. Chaque pointage aligne une copie sur le rail central. La moyenne de ces 12 copies ajoute un tirage à la colonne correspondante de l'histogramme à droite. Après 1000 tirages, deux drapeaux marquent les percentiles 2,5 et 97,5 : l'intervalle de confiance à 95 % de la moyenne.",
  body: [
    plate(),
    rails(),
    tray(),
    sampleRail(),
    histBed(),
    `<g data-part="bars"></g>`,
    ruler(),
    `<g data-part="flags"></g>`,
    `<g data-part="bridge">${bridgeSvg()}<g data-part="head">${headSvg()}</g></g>`,
  ],
});

const live = MODEL + `
const P = ${JSON.stringify(P)};
const PUCKS = ${JSON.stringify(puckAt)}, HSCALE = ${HSCALE}, TRAY_Z = ${TRAY_Z}, PUCK_R = ${PUCK_R};
const SLOTS = ${JSON.stringify([...Array(12)].map((_, i) => slotX(i)))};
const COLX = ${JSON.stringify([...Array(COLS)].map((_, c) => colX(c)))}, COL_W = ${COL_W}, HIST_Y = ${HIST.y}, HIST_D = ${HIST.d}, BAR_Z = ${BAR_Z}, BAR_SCALE = ${BAR_SCALE};
const COL_P = ${COL_P}, HIST_X = ${HIST_X};
const xOfValue = (v) => HIST_X + ((v - LO) / BW) * COL_P;
const flagSvg = ${flagSvg.toString().replace(/k\./g, "").replace(/\bS\(/g, "solidSvg(").replace(/\bL\(/g, "lineSvg(")};
const RULER = ${JSON.stringify(RULER)};
const stage = document.querySelector(".iso-stage");
const svgEl = stage.querySelector("svg");
const q = (s) => svgEl.querySelector(s);
const bridge = q('[data-part="bridge"]'), head = q('[data-part="head"]'), beads = q('[data-part="beads"]'), bars = q('[data-part="bars"]'), flags = q('[data-part="flags"]');
const pucks = DATA.map((_, i) => q('[data-part="puck' + i + '"]'));
const tallies = DATA.map((_, i) => q('[data-part="tally' + i + '"]'));
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const ease = (u) => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u);
const fmt = (v) => v.toFixed(1).replace(".", ",") + " €";

let r = rng(7);
const st = { counts: new Array(COLS).fill(0), means: [], picks: [], text: "" };
const pose = { x: PUCKS[0][0], y: PUCKS[0][1] };
function apply() {
  bridge.setAttribute("transform", translateAlong(P, [pose.x, 0, 0]));
  head.setAttribute("transform", translateAlong(P, [0, pose.y, 0]));
}
function paintBars() {
  const order = COLX.map((x, c) => c);
  bars.innerHTML = order.map((c) => {
    const h = st.counts[c] * BAR_SCALE;
    if (h <= 0.05) return "";
    const plan = { x: COLX[c], y: HIST_Y + 4, w: COL_W, d: HIST_D - 8, r: 0.8 };
    return solidSvg(slabOf(plan, BAR_Z, h, P, 2, h > 2 ? 0.4 : 0), { tone: "hi", crease: "lo" });
  }).join("");
}
function paintBeads() {
  const order = st.picks.map((i, s) => s).sort((a, b) => depthOf([SLOTS[a], 0, 0], P) - depthOf([SLOTS[b], 0, 0], P));
  beads.innerHTML = order.map((s) => { const i = st.picks[s], h = DATA[i] * HSCALE; return solidSvg(cylinder(SLOTS[s], 0, 2.4, 4, h, P, 16), { tone: "hi", crease: "lo", lit: true }); }).join("");
}
function paintTallies() {
  const n = DATA.map((_, i) => st.picks.filter((p) => p === i).length);
  tallies.forEach((g, i) => {
    const h = DATA[i] * HSCALE, [x, y] = PUCKS[i];
    const dots = [];
    for (let j = 0; j < n[i]; j++) { const a = -Math.PI / 2 + j * 0.9; dots.push(iso([x + Math.cos(a) * 3, y + Math.sin(a) * 3, TRAY_Z + h], P)); }
    g.innerHTML = n[i] ? dotsSvg(dots, { size: 0.9, tone: "lit" }) + (n[i] > 1 ? "" : "") : "";
  });
}
function paintFlags() {
  if (st.means.length < 200) { flags.innerHTML = ""; return; }
  const s = [...st.means].sort((a, b) => a - b);
  const lo = quantile(s, 0.025), hi = quantile(s, 0.975);
  flags.innerHTML = [lo, hi].map((v) => flagSvg(xOfValue(v))).join("");
  return [lo, hi];
}
function say(t) {
  if (t !== undefined) st.text = t;
  let text = st.text;
  if (!text) {
    const n = st.means.length;
    text = n ? n + " tirages · moyenne observée " + fmt(mean(DATA)) : "12 paniers observés · moyenne " + fmt(mean(DATA));
    if (n >= 200) { const s = [...st.means].sort((a, b) => a - b); text = n + " tirages · IC 95 % [" + fmt(quantile(s, 0.025)) + " ; " + fmt(quantile(s, 0.975)) + "]"; }
  }
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuetext", text);
}
function record(idx) {
  const m = mean(idx.map((i) => DATA[i]));
  st.means.push(m); st.counts[colOf(m)] += 1;
  return m;
}

// un tirage animé : 12 pointages avec remise, puis la moyenne tombe dans sa colonne
function planOne() {
  const idx = resample(r), T = [], E = [];
  const tw = (t0, t1, fn) => T.push({ t0, t1, fn }), ev = (t, fn) => E.push({ t, fn });
  let t = 0, from = [pose.x, pose.y];
  ev(0, () => { st.picks = []; paintBeads(); paintTallies(); say("tirage avec remise : 0/12"); });
  idx.forEach((i, s) => {
    const a = from.slice(), b = PUCKS[i];
    tw(t, t + 0.22, (u) => { pose.x = a[0] + (b[0] - a[0]) * u; pose.y = a[1] + (b[1] - a[1]) * u; });
    ev(t + 0.24, () => { st.picks.push(i); paintBeads(); paintTallies(); const twice = st.picks.filter((p) => p === i).length; say("pointe " + DATA[i] + " €" + (twice > 1 ? " (déjà pris : remise)" : "") + " · " + st.picks.length + "/12"); });
    from = b.slice(); t += 0.3;
  });
  ev(t + 0.2, () => { const m = record(idx); say("moyenne du tirage : " + fmt(m)); paintBars(); paintFlags(); });
  ev(t + 1.1, () => { st.picks = []; paintBeads(); paintTallies(); st.text = ""; say(); });
  return { T, E, end: t + 1.2, time: 0 };
}
let job = null, fast = 0, hold = 0;
function step(dt) {
  if (fast > 0) {
    const n = Math.min(fast, Math.max(1, Math.round(dt * 260)));
    for (let j = 0; j < n; j++) record(resample(r));
    fast -= n; paintBars(); paintFlags(); st.text = ""; say();
    return true;
  }
  if (!job) return false;
  job.time += dt;
  for (const e of job.E) if (!e.done && job.time >= e.t) { e.done = true; e.fn(); }
  for (const w of job.T) if (job.time >= w.t0 && !w.finished) { w.fn(ease((job.time - w.t0) / (w.t1 - w.t0))); if (job.time >= w.t1) w.finished = true; }
  apply();
  if (job.time >= job.end) job = null;
  return true;
}
function reset() { r = rng(7); st.counts.fill(0); st.means = []; st.picks = []; st.text = ""; fast = 0; job = null; paintBars(); paintBeads(); paintTallies(); paintFlags(); say(); }

// visite : 3 tirages lents, puis la machine s'emballe jusqu'à 1000, pause, on recommence
let touring = true, tourStage = 0, tourWait = 0.8, idleTimer = 0, frame = 0, last = 0, visible = false;
function tour(dt) {
  if (job || fast) return;
  tourWait -= dt; if (tourWait > 0) return;
  if (tourStage < 3) { job = planOne(); tourStage += 1; tourWait = 0.4; }
  else if (tourStage === 3) { fast = N_BOOT - st.means.length; tourStage = 4; tourWait = 5; }
  else { reset(); tourStage = 0; tourWait = 0.8; }
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (touring) tour(dt);
  const busy = step(dt);
  frame = visible && (busy || touring) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
function command(kind) {
  touring = false; clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourStage = st.means.length >= N_BOOT ? 4 : 3; tourWait = 4; run(); } }, 12000);
  if (kind === "reset") { reset(); return; }
  if (kind === "many") { job = null; st.picks = []; paintBeads(); paintTallies(); fast = Math.max(0, N_BOOT - st.means.length) || N_BOOT; if (still.matches) { while (fast > 0) { record(resample(r)); fast -= 1; } paintBars(); paintFlags(); say(); return; } run(); return; }
  if (still.matches) { record(resample(r)); paintBars(); paintFlags(); st.text = ""; say(); return; }
  if (!job && !fast) job = planOne();
  run();
}
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) { touring = false; while (st.means.length < N_BOOT) record(resample(r)); paintBars(); paintFlags(); }
stage.addEventListener("click", () => command("one"));
stage.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); command("one"); }
  if (e.key === "m" || e.key === "M") { e.preventDefault(); command("many"); }
  if (e.key === "r" || e.key === "R") { e.preventDefault(); command("reset"); }
});
document.querySelector("[data-many]").addEventListener("click", (e) => { e.stopPropagation(); command("many"); });
document.querySelector("[data-reset]").addEventListener("click", (e) => { e.stopPropagation(); command("reset"); });
apply(); paintBars(); say();
`;

const body = k.plateHtml({
  fig: "Fig 4",
  title: "Bootstrap",
  hint: "Clic : un tirage · M : 1000 tirages",
  readout: "12 paniers observés",
  keys: [
    { mark: "lit", label: "Les 12 copies du tirage en cours" },
    { mark: "raised", label: "Palets : les 12 paniers observés ; colonnes : moyennes des tirages" },
    { mark: "red", label: "Percentiles 2,5 % et 97,5 % : IC à 95 %" },
  ],
  caption:
    "On n'a qu'un échantillon de 12 paniers, très asymétrique (un client à 80 €). Pour savoir à quel point sa moyenne est incertaine, on le rééchantillonne : 12 tirages AVEC remise parmi les 12 paniers, donc certains reviennent deux fois et d'autres pas du tout, puis on calcule la moyenne de ce nouvel échantillon. Répété 1000 fois, cela donne la distribution d'échantillonnage de la moyenne, sans formule ni hypothèse de normalité. Les percentiles 2,5 % et 97,5 % de ces 1000 moyennes forment l'intervalle de confiance à 95 % (méthode des percentiles). Le même procédé marche pour une médiane, un ratio ou un p95.",
  body: `<div class="iso-stage" tabindex="0" role="application" aria-label="Bootstrap : Entrée lance un tirage, M en lance 1000, R recommence">${svg}</div><div class="bs-btns"><button type="button" data-many>1000 tirages</button><button type="button" data-reset>Recommencer</button></div>`,
});
const css = `<style>.iso-plate{position:relative}.bs-btns{position:absolute;right:14px;top:38px;display:flex;gap:6px}.bs-btns button{font:500 11px/1 ui-sans-serif,system-ui,sans-serif;padding:6px 10px;border-radius:6px;border:1px solid var(--anatomy-lo,#666);background:transparent;color:var(--anatomy-hi,#ddd);cursor:pointer}.bs-btns button:hover{border-color:var(--anatomy-mid,#999)}</style>`;
const out = theme === "light" ? "bootstrap-light.html" : "bootstrap.html";
const html = k.pageHtml({ title: "Bootstrap", theme, body: css + body, script: kitScript() + live, width: 700 }).replace('<html lang="en">', '<html lang="fr">');
writeFileSync(join(HERE, out), html);
console.log("wrote", out, Math.round(html.length / 1024) + " Ko");
