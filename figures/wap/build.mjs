// Figure « Write-Audit-Publish » construite avec le skill anatomy.
// node figures/wap/build.mjs [--light]
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKILL = join(homedir(), ".claude/skills/anatomy");
const k = await import(pathToFileURL(join(SKILL, "kit/iso-kit.mjs")));
const G = await import(pathToFileURL(join(SKILL, "kit/lathe.mjs")));
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")));

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const WIDTH = 640, HEIGHT = 360;

// ---------- géométrie ----------
const PLATE = { x: -176, y: -58, w: 352, d: 126, r: 8 };
const PLATE_H = 10, FOOT_H = 5;
const DECK_Z = 10, DECK_H = 2, ROLL_R = 2, TRAY_Z = 16;
const FEED = { x: -170, y: -14, w: 76, d: 28, r: 2 };
const SAS = { x: -86, y: -16, w: 90, d: 32, r: 2 };
const OUT = { x: 12, y: -14, w: 64, d: 28, r: 2 };
const SHOW = { x: 80, y: -18, w: 44, d: 36, r: 3 };          // vitrine : version en ligne
const RACK = { x: 78, y: -54, w: 48, d: 24, r: 1.5 };          // archives (time travel)
const BIN = { x: -68, y: 26, w: 56, d: 26, r: 2 };             // bac de quarantaine
const WALL = { x: -90, y: -27, w: 98, d: 3, r: 0.6 };
const GATES = { entry: -88, exit: 6 };
const POST_Y = [-24, 20];
const HEAD_Z = 50, HEAD_H = 6;
const GATE_Z = DECK_Z + DECK_H, GATE_H = 30, GATE_LIFT = 32;
const BEAM = { x: -84, y: -3, w: 86, d: 6, r: 1 };
const PROBES = [-66, -42, -18];
const PROBE_REST = 36, PROBE_DOWN = TRAY_Z + 2 + 4.4 + 0.2;
const PUSHER_Y = -23;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [GATES.entry, POST_Y[0], HEAD_Z + HEAD_H + GATE_LIFT - 18], [PROBES[0], 0, 70]],
  WIDTH, HEIGHT, { pad: 14, azimuth: 58 },
);

// ---------- plateau de données (partagé Node / page) ----------
const SHARED = `
function traySvg(P, bad, lit) {
  const out = [];
  out.push(solidSvg(slabOf({ x: -10, y: -10, w: 20, d: 20, r: 1.6 }, 0, 2, P, 3, 0.5), { tone: "mid", crease: "lo", lit: !!lit }));
  out.push(lineSvg(planOutline({ x: -8.2, y: -8.2, w: 16.4, d: 16.4, r: 1 }, 2, P, 3), { tone: "faint" }));
  const cells = [[-6.6, -6.6], [1.2, -6.6], [-6.6, 1.2], [1.2, 1.2]];
  cells.sort((a, b) => depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P));
  cells.forEach((c, i) => {
    const wrong = bad && c[0] > 0 && c[1] < 0;
    out.push(solidSvg(slabOf({ x: c[0], y: c[1], w: 5.4, d: 5.4, r: 0.7 }, 2, 4.4, P, 2, 0.4), { tone: wrong ? "lo" : "hi", crease: "lo", lit: !!lit && !wrong }));
    if (wrong) out.push(lineSvg(planOutline({ x: c[0] + 1, y: c[1] + 1, w: 3.4, d: 3.4, r: 0.6 }, 6.4, P, 2), { tone: "red" }));
  });
  return out.join("");
}
`;
const shared = new Function(...Object.keys(k), SHARED + "return { traySvg };")(...Object.values(k));

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const screws = (plan, inset, z, size = 0.45) => D(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size });
const halo = (plan) => `<path class="iso-halo" d="${k.haloOf(plan, 0, 0.1, P)}" style="filter:blur(3px)"/>`;

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
  [["WRITE", -128], ["AUDIT", 46], ["PUBLISH", 128]].forEach(([word, x]) => {
    const plan = { x: x - 21, y: 55, w: 42, d: 9, r: 1.2 };
    out.push(S(k.slabOf(plan, 0, 0.8, P, 3, 0.3), { tone: "lo", crease: "none" }));
    out.push(D([at([plan.x + 1.8, plan.y + 4.5, 0.8]), at([plan.x + plan.w - 1.8, plan.y + 4.5, 0.8])], { size: 0.4 }));
    out.push(k.faceTextSvg(k.topMatrix([x, plan.y + 6], 0.8, P, "x"), word, { size: 4.6, tone: "hi", anchor: "middle" }));
  });
  return out.join("");
}

// convoyeur à rouleaux : socle, plateau, rouleaux (pièces tournées le long de y)
function conveyor(plan, legs = true) {
  const out = [halo(plan)];
  if (legs) for (const x of [plan.x + 4, plan.x + plan.w - 10]) out.push(S(k.slabOf({ x, y: plan.y + 3, w: 6, d: plan.d - 6, r: 1 }, 0, DECK_Z, P, 3, 0.4), { tone: "lo" }));
  else out.push(S(k.slabOf(k.insetPlan(plan, 1), 0, DECK_Z, P, 4, 0.6), { tone: "lo", inner: L(k.sideSeam(k.insetPlan(plan, 1), DECK_Z / 2, P, 4), { tone: "faint" }) }));
  out.push(S(k.slabOf(plan, DECK_Z, DECK_H, P, 3, 0.4), { tone: "mid" }));
  const rollers = [];
  for (let x = plan.x + 6; x <= plan.x + plan.w - 5; x += 8) rollers.push(x);
  for (const x of rollers) {
    const F = G.frameAlong([x, plan.y + 2, TRAY_Z - ROLL_R], [0, 1, 0]);
    out.push(S(G.disc(0, plan.d - 4, ROLL_R, F, P), { tone: "mid", crease: "none" }));
  }
  out.push(screws(plan, 1.4, DECK_Z + DECK_H, 0.4));
  return out.join("");
}

// sas : socle, mur du fond, poussoir
function sasBack() {
  const out = [conveyor(SAS, false)];
  out.push(S(k.slabOf(WALL, 0, HEAD_Z, P, 2, 0.5), { tone: "mid", inner: L(k.sideSeam(WALL, 24, P, 2), { tone: "faint" }) }));
  out.push(D([-80, -40, 0].map((x) => at([x, WALL.y + WALL.d, 40])), { size: 0.45 }));
  // vérin du poussoir, fixé au mur
  out.push(S(k.slabOf({ x: -48, y: WALL.y + WALL.d, w: 16, d: 2.4, r: 0.8 }, TRAY_Z + 1, 8, P, 2, 0.4), { tone: "mid" }));
  return out.join("");
}
const pusherSvg = () =>
  S(k.slabOf({ x: -45, y: PUSHER_Y + 0.4, w: 10, d: 2.2, r: 0.6 }, TRAY_Z + 3, 4, P, 2), { tone: "mid", crease: "none" }) +
  S(k.slabOf({ x: -52, y: PUSHER_Y + 2.6, w: 24, d: 3, r: 0.8 }, TRAY_Z + 1, 7, P, 2, 0.5), { tone: "mid" });

// porte-guillotine : poteaux, porte (mobile), traverse
function gateBack(gx) { return S(k.slabOf({ x: gx - 2, y: POST_Y[0] - 2, w: 4, d: 4, r: 0.8 }, 0, HEAD_Z, P, 2, 0.4), { tone: "mid" }); }
const gateSvg = (gx) => {
  const plan = { x: gx - 1.4, y: -19, w: 2.8, d: 38, r: 0.6 };
  return S(k.slabOf(plan, GATE_Z, GATE_H, P, 2, 0.4), { tone: "hi", crease: "lo", inner: L(k.sideSeam(plan, GATE_Z + 6, P, 2), { tone: "faint" }) }) +
    D([at([gx + 1.4, -15, GATE_Z + GATE_H - 3]), at([gx + 1.4, 15, GATE_Z + GATE_H - 3])], { size: 0.4 });
};
function gateFront(gx) {
  const out = [];
  out.push(S(k.slabOf({ x: gx - 2, y: POST_Y[1] - 2, w: 4, d: 4, r: 0.8 }, 0, HEAD_Z, P, 2, 0.4), { tone: "mid" }));
  const head = { x: gx - 4, y: POST_Y[0] - 3, w: 8, d: POST_Y[1] - POST_Y[0] + 6, r: 1.2 };
  out.push(S(k.slabOf(head, HEAD_Z, HEAD_H, P, 3, 0.6), { tone: "mid", inner: L(k.sideSeam(head, HEAD_Z + 3, P, 3), { tone: "faint" }) }));
  out.push(L(k.planOutline({ x: gx - 1.8, y: -19.4, w: 3.6, d: 38.8, r: 0.6 }, HEAD_Z + HEAD_H, P, 2), { tone: "lo" }));
  out.push(D(POST_Y.map((y) => at([gx, y, HEAD_Z + HEAD_H])), { size: 0.5 }));
  return out.join("");
}

// palpeurs d'audit
const probeSvg = (x) =>
  S(k.cylinder(x, 0, 1.2, 3, 26, P, 14), { tone: "mid", crease: "none" }) +
  S(k.cylinder(x, 0, 3.2, 0, 3, P, 22, 0.4), { tone: "hi", crease: "lo" });
function beam() {
  const out = [S(k.slabOf(BEAM, HEAD_Z, 5, P, 2, 0.5), { tone: "mid", inner: L(k.sideSeam(BEAM, HEAD_Z + 2.5, P, 2), { tone: "faint" }) })];
  PROBES.forEach((x, i) => {
    out.push(S(k.cylinder(x, 0, 2.4, HEAD_Z + 5, 2, P, 18), { tone: "mid" }));
    out.push(S(k.cylinder(x + 7, 0, 2.2, HEAD_Z + 5, 1.6, P, 18), { tone: "lo" }));
    out.push(`<path data-part="lamp${i}" class="wap-lamp" d="${k.ring(x + 7, 0, 1.6, HEAD_Z + 6.6, P, 20)}"/>`);
    out.push(L(k.ring(x + 7, 0, 1.6, HEAD_Z + 6.6, P, 20), { tone: "lo" }));
  });
  return out.join("");
}

// bac de quarantaine
function binWalls(plan, z, h, t) {
  const wall = (p) => S(k.slabOf(p, z, h, P, 2, 0.4), { tone: "mid" });
  return {
    back: wall({ x: plan.x, y: plan.y, w: plan.w, d: t, r: 0.6 }) + wall({ x: plan.x, y: plan.y, w: t, d: plan.d, r: 0.6 }),
    front: wall({ x: plan.x + plan.w - t, y: plan.y, w: t, d: plan.d, r: 0.6 }) + wall({ x: plan.x, y: plan.y + plan.d - t, w: plan.w, d: t, r: 0.6 }),
  };
}
const binBack = () => halo(BIN) + S(k.slabOf(BIN, 0, 2, P, 3, 0.4), { tone: "lo" }) + binWalls(BIN, 2, 11, 2).back;
const binFront = () => binWalls(BIN, 2, 11, 2).front + L(k.planOutline(k.insetPlan(BIN, 0.8), 13, P, 2), { tone: "faint" });

// rayonnage d'archives et vitrine
const SHELVES = [4, 22];
function rack() {
  const out = [halo(RACK)];
  const posts = byDepth(k.corners(RACK, 1.5));
  const back = posts.slice(0, 2), front = posts.slice(2);
  for (const [x, y] of back) out.push(S(k.slabOf({ x: x - 1.5, y: y - 1.5, w: 3, d: 3, r: 0.6 }, 0, 40, P, 2), { tone: "mid" }));
  SHELVES.forEach((z, i) => {
    out.push(S(k.slabOf(RACK, z - 2, 2, P, 2, 0.4), { tone: "mid" }));
    out.push(`<g data-part="shelf${i}"></g>`);
  });
  for (const [x, y] of front) out.push(S(k.slabOf({ x: x - 1.5, y: y - 1.5, w: 3, d: 3, r: 0.6 }, 0, 40, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf(RACK, 40, 2, P, 2, 0.4), { tone: "mid" }));
  out.push(screws(RACK, 1.5, 42, 0.4));
  return out.join("");
}
function showcase() {
  const out = [halo(SHOW)];
  out.push(S(k.slabOf(SHOW, 0, TRAY_Z - 2, P, 6, 0.8), { tone: "lo", inner: L(k.sideSeam(SHOW, 7, P, 6), { tone: "faint" }) }));
  out.push(S(k.slabOf(k.insetPlan(SHOW, 2), TRAY_Z - 2, 2, P, 5, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline({ x: SHOW.x + 9, y: -13, w: 26, d: 26, r: 2 }, TRAY_Z, P, 3), { tone: "faint" }));
  out.push(screws(k.insetPlan(SHOW, 2), 2, TRAY_Z, 0.42));
  return out.join("");
}

const SHOW_C = [SHOW.x + SHOW.w / 2, 0];
const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label:
    "Une écluse d'inspection sur un socle. Un convoyeur amène le plateau d'un nouveau lot dans un sas fermé par deux portes-guillotines, où les lecteurs ne le voient pas. Trois palpeurs contrôlent l'unicité, le volume et la réconciliation et allument chacun un voyant. Si les trois sont verts, la porte de sortie se lève et le plateau remplace d'un coup celui de la vitrine, l'ancien partant au rayonnage d'archives. Sinon un poussoir éjecte le lot dans le bac de quarantaine et la vitrine garde la version précédente.",
  body: [
    plate(),
    conveyor(FEED),
    `<g data-slot="feed"></g>`,
    sasBack(),
    `<g data-part="pusher">${pusherSvg()}</g>`,
    gateBack(GATES.entry),
    `<g data-part="gate-entry">${gateSvg(GATES.entry)}</g>`,
    gateFront(GATES.entry),
    `<g data-slot="sas"></g>`,
    PROBES.map((x, i) => `<g data-part="probe${i}" transform="${k.translateAlong(P, [0, 0, PROBE_REST])}">${probeSvg(x)}</g>`).join(""),
    beam(),
    gateBack(GATES.exit),
    `<g data-part="gate-exit">${gateSvg(GATES.exit)}</g>`,
    gateFront(GATES.exit),
    binBack(),
    `<g data-slot="bin"></g>`,
    binFront(),
    rack(),
    conveyor(OUT),
    showcase(),
    `<g data-slot="out"></g>`,
  ],
});

const live = SHARED + `
const P = ${JSON.stringify(P)};
const TRAY_Z = ${TRAY_Z}, GATE_LIFT = ${GATE_LIFT}, PROBE_REST = ${PROBE_REST}, PROBE_DOWN = ${PROBE_DOWN};
const FEED_X = ${FEED.x + 14}, SHOW_C = ${JSON.stringify(SHOW_C)};
const RACK = ${JSON.stringify(RACK)}, SHELVES = ${JSON.stringify(SHELVES)};
const BIN_C = [${BIN.x + BIN.w / 2}, ${BIN.y + BIN.d / 2}];
const ENTRY = ${GATES.entry}, EXIT = ${GATES.exit};
const CHECKS = ["volume", "unicité", "réconciliation"];
const PROBES = ${JSON.stringify(PROBES)};
const stage = document.querySelector(".iso-stage");
const svgEl = stage.querySelector("svg");
const q = (sel) => svgEl.querySelector(sel);
const slot = { feed: q('[data-slot="feed"]'), sas: q('[data-slot="sas"]'), bin: q('[data-slot="bin"]'), out: q('[data-slot="out"]') };
const shelf = [q('[data-part="shelf0"]'), q('[data-part="shelf1"]')];
const gates = { entry: q('[data-part="gate-entry"]'), exit: q('[data-part="gate-exit"]') };
const probes = [0, 1, 2].map((i) => q('[data-part="probe' + i + '"]'));
const lamps = [0, 1, 2].map((i) => q('[data-part="lamp' + i + '"]'));
const pusher = q('[data-part="pusher"]');
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const NS = "http://www.w3.org/2000/svg";
const ease = (u) => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u);

function makeTray(bad, lit) {
  const g = document.createElementNS(NS, "g");
  g.innerHTML = traySvg(P, bad, lit);
  g.dataset.bad = bad ? "1" : "";
  return g;
}
function place(g, x, y, z) {
  g.setAttribute("transform", translateAlong(P, [x, y, z]));
  const want = y > 18 ? slot.bin : x < ENTRY ? slot.feed : x < EXIT + 4 ? slot.sas : slot.out;
  if (g.parentNode !== want) want.appendChild(g);
}
function setLamp(i, state) { lamps[i].dataset.state = state || ""; }

// état
const st = { version: 1, archived: [], quarantine: [], job: null, text: "" };
let shown = makeTray(false, false); place(shown, SHOW_C[0], 0, TRAY_Z);
const pose = { entry: 0, exit: 0, probes: [PROBE_REST, PROBE_REST, PROBE_REST], pusher: 0 };
function applyPose() {
  gates.entry.setAttribute("transform", translateAlong(P, [0, 0, pose.entry * GATE_LIFT]));
  gates.exit.setAttribute("transform", translateAlong(P, [0, 0, pose.exit * GATE_LIFT]));
  probes.forEach((p, i) => p.setAttribute("transform", translateAlong(P, [0, 0, pose.probes[i]])));
  pusher.setAttribute("transform", translateAlong(P, [0, pose.pusher, 0]));
}
function say(text) { if (text) st.text = text; const t = st.text || ("v" + st.version + " en ligne · " + st.archived.length + " archivées · " + st.quarantine.length + " en quarantaine"); if (readout.textContent !== t) readout.textContent = t; stage.setAttribute("aria-valuetext", t); }
function archive(old) {
  st.archived.unshift(old);
  if (st.archived.length > 4) { const gone = st.archived.pop(); gone.remove(); }
  st.archived.forEach((g, i) => {
    const lvl = i < 2 ? 1 : 0, col = i % 2;
    shelf[lvl].appendChild(g);
    g.setAttribute("transform", translateAlong(P, [RACK.x + 12 + col * 24, RACK.y + 12, SHELVES[lvl]]));
  });
  shelf.forEach((s) => { const kids = [...s.children]; kids.sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x); });
}

// un lot = une liste de tâches (interpolations) et d'événements sur une ligne de temps
function plan(bad) {
  const n = st.version + 1;
  const tray = makeTray(bad, true);
  const T = [], E = [];
  const tw = (t0, t1, fn) => T.push({ t0, t1, fn });
  const ev = (t, fn) => E.push({ t, fn, done: false });
  ev(0, () => { place(tray, FEED_X, 0, TRAY_Z); say("write : v" + n + " part vers le sas"); [0, 1, 2].forEach((i) => setLamp(i, "")); });
  tw(0, 0.5, (u) => (pose.entry = u));
  tw(0.25, 1.5, (u) => place(tray, FEED_X + (PROBES[0] - FEED_X) * u, 0, TRAY_Z));
  tw(1.5, 1.95, (u) => (pose.entry = 1 - u));
  ev(1.6, () => say("write : v" + n + " dans le sas, invisible"));
  const fail = bad ? 1 : -1;
  let t = 2.0;
  for (let i = 0; i < 3; i++) {
    if (i > 0) { const a = PROBES[i - 1], b = PROBES[i]; tw(t, t + 0.4, (u) => place(tray, a + (b - a) * u, 0, TRAY_Z)); t += 0.45; }
    const t0 = t;
    tw(t0, t0 + 0.3, (u) => (pose.probes[i] = PROBE_REST + (PROBE_DOWN - PROBE_REST) * u));
    ev(t0 + 0.32, () => { setLamp(i, i === fail ? "red" : "green"); say("audit : " + CHECKS.slice(0, i + 1).map((c, j) => c.slice(0, 6) + (j === fail ? " ✗" : " ✓")).join(" · ")); });
    tw(t0 + 0.45, t0 + 0.7, (u) => (pose.probes[i] = PROBE_DOWN + (PROBE_REST - PROBE_DOWN) * u));
    t += 0.55;
    if (i === fail) break;
  }
  t += 0.3;
  if (!bad) {
    tw(t, t + 0.45, (u) => (pose.exit = u));
    tw(t + 0.35, t + 1.45, (u) => place(tray, PROBES[2] + (SHOW_C[0] - PROBES[2]) * u, 0, TRAY_Z));
    ev(t + 1.45, () => { const old = shown; old.remove(); archive(old); tray.innerHTML = traySvg(P, false, false); shown = tray; place(tray, SHOW_C[0], 0, TRAY_Z); st.version = n; say("publish : v" + n + " en ligne, v" + (n - 1) + " archivée"); });
    tw(t + 1.5, t + 1.95, (u) => (pose.exit = 1 - u));
    t += 3.4;
  } else {
    const start = BIN_C[1];
    const X = PROBES[1];
    tw(t, t + 0.8, (u) => { const d = 31 * u; pose.pusher = d; place(tray, X, Math.max(0, d - 7), TRAY_Z); });
    tw(t + 0.8, t + 1.3, (u) => place(tray, X + (BIN_C[0] - X) * u, 24 + (start - 24) * u, TRAY_Z + (2 + st.quarantine.length * 0.01 - TRAY_Z) * u * u));
    ev(t + 0.2, () => say("bloqué : les lecteurs gardent v" + st.version));
    ev(t + 1.35, () => { tray.innerHTML = traySvg(P, true, false); st.quarantine.unshift(tray); if (st.quarantine.length > 2) st.quarantine.pop().remove(); st.quarantine.forEach((g, i) => place(g, BIN_C[0] - 13 + i * 26, BIN_C[1], 2)); });
    tw(t + 1.1, t + 1.7, (u) => (pose.pusher = 31 * (1 - u)));
    t += 3.4;
  }
  ev(t - 0.1, () => { [0, 1, 2].forEach((i) => setLamp(i, "")); st.text = ""; say(); });
  return { T, E, end: t, time: 0 };
}

const queue = [];
function step(dt) {
  if (!st.job && queue.length) st.job = plan(queue.shift());
  const job = st.job;
  if (!job) return false;
  job.time += dt;
  for (const e of job.E) if (!e.done && job.time >= e.t) { e.done = true; e.fn(); }
  for (const w of job.T) {
    if (job.time >= w.t0 && !w.finished) { const u = ease((job.time - w.t0) / (w.t1 - w.t0)); w.fn(u); if (job.time >= w.t1) w.finished = true; }
  }
  applyPose();
  if (job.time >= job.end) st.job = null;
  return true;
}
function instant(bad) {
  const job = plan(bad);
  job.E.sort((a, b) => a.t - b.t);
  const all = [...job.T.map((w) => ({ t: w.t1, fn: () => w.fn(1) })), ...job.E].sort((a, b) => a.t - b.t);
  all.forEach((x) => x.fn());
  applyPose();
}

// visite automatique
const TOUR = [false, false, true, false];
let touring = true, tourIndex = 0, tourWait = 0.8, idleTimer = 0;
function tour(dt) {
  if (st.job || queue.length) return;
  tourWait -= dt;
  if (tourWait > 0) return;
  queue.push(TOUR[tourIndex % TOUR.length]); tourIndex += 1; tourWait = 0.9;
}
let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (touring) tour(dt);
  const busy = step(dt);
  frame = visible && (busy || touring) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
function command(bad) {
  touring = false; clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; run(); } }, 10000);
  if (still.matches) { if (!st.job) instant(bad); return; }
  if (queue.length < 2) queue.push(bad);
  run();
}
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) touring = false;
stage.addEventListener("click", () => command(false));
stage.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); command(false); }
  if (e.key === "d" || e.key === "D") { e.preventDefault(); command(true); }
});
document.querySelector("[data-ok]").addEventListener("click", (e) => { e.stopPropagation(); command(false); });
document.querySelector("[data-bad]").addEventListener("click", (e) => { e.stopPropagation(); command(true); });
applyPose(); say();
`;

const body = k.plateHtml({
  fig: "Fig 2",
  title: "Write-Audit-Publish",
  hint: "Clic : lot sain · D : défectueux",
  readout: "v1 en ligne · 0 archivées · 0 en quarantaine",
  keys: [
    { mark: "lit", label: "Le lot en cours (nouvelle version)" },
    { mark: "green", label: "Contrôle réussi" },
    { mark: "red", label: "Contrôle échoué, ligne fautive" },
    { mark: "raised", label: "Vitrine : la version que voient les lecteurs" },
  ],
  caption:
    "WRITE : le pipeline écrit chaque nouvelle version dans un sas fermé, invisible des lecteurs. AUDIT : trois palpeurs la contrôlent (unicité de la clé, volume attendu, réconciliation avec la source). PUBLISH : seulement si les trois voyants sont verts, la porte s'ouvre et la version remplace d'un coup celle de la vitrine ; l'ancienne part aux archives, d'où l'on peut revenir en arrière (time travel). Un lot défectueux est poussé en quarantaine : la porte reste fermée et les lecteurs gardent la version précédente, un peu ancienne mais juste.",
  body: `<div class="iso-stage" tabindex="0" role="application" aria-label="Write-Audit-Publish : Entrée envoie un lot sain, D un lot défectueux">${svg}</div><div class="wap-btns"><button type="button" data-ok>Lot sain</button><button type="button" data-bad>Lot défectueux</button></div>`,
});

const css = `<style>.iso-plate{position:relative}.wap-btns{position:absolute;right:14px;top:38px;display:flex;gap:6px}.wap-btns button{font:500 11px/1 ui-sans-serif,system-ui,sans-serif;padding:6px 10px;border-radius:6px;border:1px solid var(--anatomy-lo,#666);background:transparent;color:var(--anatomy-hi,#ddd);cursor:pointer}.wap-btns button:hover{border-color:var(--anatomy-mid,#999)}.wap-btns [data-bad]{border-color:var(--anatomy-red)}.wap-lamp{fill:transparent;transition:fill .25s ease}.wap-lamp[data-state=green]{fill:var(--anatomy-green)}.wap-lamp[data-state=red]{fill:var(--anatomy-red)}</style>`;
const out = theme === "light" ? "wap-light.html" : "wap.html";
const html = k.pageHtml({ title: "Write-Audit-Publish", theme, body: css + body, script: kitScript() + live, width: 700 }).replace('<html lang="en">', '<html lang="fr">');
writeFileSync(join(HERE, out), html);
console.log("wrote", out, Math.round(html.length / 1024) + " Ko");
