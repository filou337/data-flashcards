// Figure « Watermark en streaming » construite avec le skill anatomy.
// node figures/watermark/build.mjs [--light]
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

// ---------- modèle ----------
// Heures d'événement (en minutes après 10:00), dans l'ordre où le système les REÇOIT.
const EVENTS = [0.6, 1.8, 3.1, 2.2, 4.4, 6.0, 3.6, 7.3, 8.9, 5.4, 9.6, 11.2, 4.1, 12.4, 10.7, 14.1, 13.0, 16.2, 8.2, 17.5, 15.4, 19.1];
const LATENESS = 3;          // retard toléré : watermark = heure max vue − 3 min
const WINDOW = 5;            // fenêtres fixes (tumbling) de 5 min
const WINDOWS = 4;

// ---------- géométrie ----------
const U = 11;                                  // unités monde par minute
const X0 = -WINDOW * WINDOWS * U / 2;          // x de 10:00
const xOf = (m) => X0 + m * U;
const PLATE = { x: -176, y: -64, w: 352, d: 120, r: 8 };
const PLATE_H = 10, FOOT_H = 5;
const BIN_Y = -10, BIN_D = 28, BIN_H = 12, WALL_T = 2;
const LID_OPEN = -31;
const RULER = { x: X0 - 6, y: 24, w: WINDOW * WINDOWS * U + 12, d: 12, r: 1.2 };
const HOPPER = { x: -174 + 6, y: -6, w: 26, d: 20, r: 2 };
const LATE = { x: 128, y: -8, w: 38, d: 24, r: 2 };
const GANTRY_Y = -46, BEAM_Z = 64, ARM_Y = 4, NOZZLE_Z = 50;
const HOME_X = HOPPER.x + HOPPER.w / 2;
const LATE_X = LATE.x + LATE.w / 2;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [-160, GANTRY_Y, BEAM_Z + 6], [160, GANTRY_Y, BEAM_Z + 6]],
  WIDTH, HEIGHT, { pad: 14, azimuth: 60 },
);

const SHARED = `
const TOKEN = 4.4;
function tokenSvg(x, y, z, P, lit, tone) {
  return solidSvg(slabOf({ x: x - TOKEN / 2, y: y - TOKEN / 2, w: TOKEN, d: TOKEN, r: 0.7 }, z, TOKEN, P, 2, 0.4), { tone: tone || "hi", crease: "lo", lit: !!lit });
}
function pileSvg(plan, z0, n, P, tone) {
  const cols = Math.floor((plan.w - 2) / 5.4), rows = Math.floor((plan.d - 2) / 5.4), per = cols * rows, s = [];
  for (let i = 0; i < n; i++) { const l = Math.floor(i / per), j = i % per; s.push([plan.x + 3.2 + (j % cols) * 5.4, plan.y + 3.2 + Math.floor(j / cols) * 5.4, z0 + l * TOKEN]); }
  s.sort((a, b) => (a[2] - b[2]) || (depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P)));
  return s.map((p) => tokenSvg(p[0], p[1], p[2], P, false, tone)).join("");
}
`;
const { pileSvg } = new Function(...Object.keys(k), SHARED + "return { pileSvg };")(...Object.values(k));

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
  out.push(label("SOURCE", HOPPER.x + HOPPER.w / 2, 42, 30));
  out.push(label("TROP TARD", LATE_X, 42, 40));
  return out.join("");
}

function gantryBack() {
  const out = [];
  for (const x of [-164, 160]) {
    out.push(S(k.slabOf({ x: x - 5, y: GANTRY_Y - 5, w: 10, d: 10, r: 1.5 }, 0, 3, P, 3, 0.4), { tone: "lo" }));
    out.push(S(k.slabOf({ x: x - 2.5, y: GANTRY_Y - 2.5, w: 5, d: 5, r: 1 }, 3, BEAM_Z - 3, P, 2, 0.4), { tone: "mid" }));
  }
  const beam = { x: -168, y: GANTRY_Y - 4, w: 332, d: 8, r: 1.5 };
  out.push(S(k.slabOf(beam, BEAM_Z, 6, P, 3, 0.6), { tone: "mid", inner: L(k.sideSeam(beam, BEAM_Z + 3, P, 3), { tone: "faint" }) }));
  out.push(D([-164, -80, 0, 80, 160].map((x) => at([x, GANTRY_Y, BEAM_Z + 6])), { size: 0.45 }));
  // rail arrière qui reçoit les couvercles ouverts
  const rail = { x: X0 - 4, y: -40, w: WINDOW * WINDOWS * U + 8, d: 4, r: 1 };
  out.push(S(k.slabOf(rail, 0, BIN_H + 1, P, 2, 0.4), { tone: "lo" }));
  out.push(D([X0, 0, -X0].map((x) => at([x, -38, BIN_H + 1])), { size: 0.4 }));
  return out.join("");
}

function hopper() {
  const out = [halo(HOPPER)];
  out.push(S(k.slabOf(HOPPER, 0, 18, P, 3, 0.6), { tone: "mid", inner: L(k.sideSeam(HOPPER, 9, P, 3), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(HOPPER, 3), 18, P, 3), { tone: "lo" }));
  out.push(screws(HOPPER, 1.6, 18, 0.4));
  out.push(pileSvg(k.insetPlan(HOPPER, 3), 18, 9, P, "mid"));
  return out.join("");
}

function binPlan(i) { return { x: xOf(i * WINDOW) + 1.5, y: BIN_Y, w: WINDOW * U - 3, d: BIN_D, r: 1.5 }; }
function binWalls(plan) {
  const wall = (p) => S(k.slabOf(p, 2, BIN_H - 2, P, 2, 0.4), { tone: "mid" });
  return {
    back: S(k.slabOf(plan, 0, 2, P, 3, 0.4), { tone: "lo" }) + wall({ x: plan.x, y: plan.y, w: plan.w, d: WALL_T, r: 0.6 }) + wall({ x: plan.x, y: plan.y, w: WALL_T, d: plan.d, r: 0.6 }),
    front: wall({ x: plan.x + plan.w - WALL_T, y: plan.y, w: WALL_T, d: plan.d, r: 0.6 }) + wall({ x: plan.x, y: plan.y + plan.d - WALL_T, w: plan.w, d: WALL_T, r: 0.6 }),
  };
}
const lidSvg = (plan) => {
  const lid = { x: plan.x - 0.5, y: plan.y - 0.5, w: plan.w + 1, d: plan.d + 1, r: 1.6 };
  return S(k.slabOf(lid, BIN_H, 1.6, P, 3, 0.5), { tone: "mid" }) +
    S(k.slabOf({ x: plan.x + plan.w / 2 - 5, y: plan.y + plan.d - 4, w: 10, d: 2.4, r: 0.8 }, BIN_H + 1.6, 2, P, 2, 0.3), { tone: "mid", crease: "none" });
};

function lateTray() {
  const w = binWalls(LATE);
  return halo(LATE) + w.back + `<g data-part="late-pile"></g><g data-slot="late"></g>` + w.front;
}

function ruler() {
  const out = [S(k.slabOf(RULER, 0, 1.6, P, 3, 0.4), { tone: "lo", crease: "none" })];
  const ticks = k.topTicks(xOf(0), xOf(WINDOW * WINDOWS), U, 5, RULER.y + 0.8, 1.6, [2, 4.2], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "hi" }));
  for (let w = 0; w <= WINDOWS; w++) {
    const m = w * WINDOW;
    out.push(k.faceTextSvg(k.topMatrix([xOf(m), RULER.y + 9.4], 1.6, P, "x"), "10:" + String(m).padStart(2, "0"), { size: 4.4, tone: "hi", anchor: "middle" }));
  }
  out.push(D([at([RULER.x + 2, RULER.y + 6, 1.6]), at([RULER.x + RULER.w - 2, RULER.y + 6, 1.6])], { size: 0.45 }));
  return out.join("");
}
// curseur du watermark : coulisseau sur la règle + index qui pointe la graduation
const pointerSvg = () =>
  S(k.slabOf({ x: -4, y: RULER.y - 3, w: 8, d: 3, r: 0.8 }, 0, 9, P, 2, 0.4), { tone: "hi", crease: "lo" }) +
  S(k.slabOf({ x: -1.2, y: RULER.y - 1, w: 2.4, d: 9, r: 0.5 }, 6.2, 1.2, P, 2), { tone: "hi", crease: "lo" }) +
  L(k.lineOnTop([0, RULER.y], [0, RULER.y + 7.4], 7.4, P), { tone: "red" }) +
  S(k.cylinder(0, RULER.y - 1.5, 0.9, 9, 22, P, 12), { tone: "mid", crease: "none" }) +
  S(k.slabOf({ x: 0.9, y: RULER.y - 2.1, w: 10, d: 1.2, r: 0.3 }, 24, 7, P, 2), { tone: "hi", crease: "lo", inner: L(k.sideSeam({ x: 0.9, y: RULER.y - 2.1, w: 10, d: 1.2, r: 0.3 }, 27.5, P, 2), { tone: "red" }) }) +
  D([at([0, RULER.y - 1.5, 31])], { size: 0.6, tone: "hi" });

// tête de tri : chariot sur la poutre + bras + buse
const headSvg = () =>
  S(k.slabOf({ x: -6, y: GANTRY_Y - 6, w: 12, d: 12, r: 1.5 }, BEAM_Z - 6, 6, P, 3, 0.5), { tone: "mid" }) +
  S(k.slabOf({ x: -2.5, y: GANTRY_Y + 6, w: 5, d: ARM_Y - GANTRY_Y - 3, r: 1 }, BEAM_Z - 5, 3.5, P, 2, 0.4), { tone: "mid" }) +
  S(k.cylinder(0, ARM_Y, 3.2, NOZZLE_Z, BEAM_Z - 5 - NOZZLE_Z + 3.5, P, 20), { tone: "mid", inner: L(k.sideArc(0, ARM_Y, 3.2, NOZZLE_Z + 4, P, 14), { tone: "faint" }) }) +
  S(k.cylinder(0, ARM_Y, 4.4, NOZZLE_Z - 2, 2, P, 22, 0.4), { tone: "mid" });

const bins = [...Array(WINDOWS)].map((_, i) => binPlan(i));
const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label:
    "Un trieur d'événements le long d'une règle graduée en heure d'événement, de 10:00 à 10:20. Quatre bacs reçoivent chacun une fenêtre de 5 minutes. Un bras sur portique prend les événements à la source dans l'ordre où ils arrivent et dépose chacun dans le bac de son heure d'événement. Un curseur rouge, le watermark, se place à l'heure maximale vue moins 3 minutes ; quand il dépasse la fin d'une fenêtre, le couvercle du bac se ferme et la fenêtre est émise. Un événement qui arrive pour une fenêtre déjà fermée part dans le bac Trop tard.",
  body: [
    plate(),
    gantryBack(),
    `<g data-slot="lids-back"></g>`,
    hopper(),
    `<g data-slot="hopper"></g>`,
    ...bins.map((b, i) => { const w = binWalls(b); return w.back + `<g data-part="pile${i}"></g><g data-slot="bin${i}"></g>` + w.front; }),
    `<g data-slot="lids-front"></g>`,
    ...bins.map((b, i) => `<g data-part="lid${i}" data-plan='${JSON.stringify(b)}'>${lidSvg(b)}</g>`),
    lateTray(),
    ruler(),
    `<g data-part="pointer">${pointerSvg()}</g>`,
    `<g data-slot="air"></g>`,
    `<g data-part="head">${headSvg()}</g>`,
  ],
});

const live = SHARED + `
const P = ${JSON.stringify(P)};
const EVENTS = ${JSON.stringify(EVENTS)}, LATENESS = ${LATENESS}, WINDOW = ${WINDOW}, WINDOWS = ${WINDOWS};
const U = ${U}, X0 = ${X0}, HOME_X = ${HOME_X}, LATE_X = ${LATE_X}, ARM_Y = ${ARM_Y}, NOZZLE_Z = ${NOZZLE_Z}, BIN_Y = ${BIN_Y}, BIN_D = ${BIN_D};
const LID_OPEN = ${LID_OPEN};
const BINS = ${JSON.stringify(bins)}, LATE = ${JSON.stringify(LATE)}, HOPPER = ${JSON.stringify(HOPPER)};
const xOf = (m) => X0 + m * U;
const clock = (m) => { const t = Math.round(m * 10) / 10, mm = Math.floor(t), ss = Math.round((t - mm) * 60); return "10:" + String(mm).padStart(2, "0") + (ss ? ":" + String(ss).padStart(2, "0") : ""); };
const stage = document.querySelector(".iso-stage");
const svgEl = stage.querySelector("svg");
const q = (s) => svgEl.querySelector(s);
const head = q('[data-part="head"]'), pointer = q('[data-part="pointer"]');
const piles = [0, 1, 2, 3].map((i) => q('[data-part="pile' + i + '"]'));
const lids = [0, 1, 2, 3].map((i) => q('[data-part="lid' + i + '"]'));
const slotBin = [0, 1, 2, 3].map((i) => q('[data-slot="bin' + i + '"]'));
const slots = { air: q('[data-slot="air"]'), late: q('[data-slot="late"]'), back: q('[data-slot="lids-back"]'), front: q('[data-slot="lids-front"]'), hopper: q('[data-slot="hopper"]') };
const latePile = q('[data-part="late-pile"]');
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const ease = (u) => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u);
const NS = "http://www.w3.org/2000/svg";

const st = { i: 0, max: -Infinity, wm: -Infinity, counts: [0, 0, 0, 0], late: 0, closed: [false, false, false, false], lid: [0, 0, 0, 0], text: "" };
const pose = { headX: HOME_X, ptr: 0 };
function wmShown() { return st.wm === -Infinity ? -LATENESS : st.wm; }
function apply() {
  head.setAttribute("transform", translateAlong(P, [pose.headX, 0, 0]));
  pointer.setAttribute("transform", translateAlong(P, [xOf(Math.max(0, pose.ptr)), 0, 0]));
  lids.forEach((lid, i) => {
    lid.setAttribute("transform", translateAlong(P, [0, LID_OPEN * (1 - st.lid[i]), 0]));
    const want = st.lid[i] > 0.6 ? slots.front : slots.back;
    if (lid.parentNode !== want) want.appendChild(lid);
  });
}
function paintPiles() {
  piles.forEach((g, i) => { const svg = pileSvg(BINS[i], 2, st.counts[i], P, st.closed[i] ? "mid" : "hi"); if (g.dataset.n !== svg.length + ":" + st.closed[i]) { g.dataset.n = svg.length + ":" + st.closed[i]; g.innerHTML = svg; } });
  const s = pileSvg(LATE, 2, st.late, P, "lo"); if (latePile.dataset.n !== String(st.late)) { latePile.dataset.n = String(st.late); latePile.innerHTML = s; }
}
function say(t) { if (t !== undefined) st.text = t; const text = st.text || ("watermark " + (st.wm === -Infinity ? "—" : clock(st.wm)) + " · fenêtres émises " + st.closed.filter(Boolean).length + " · trop tard " + st.late); if (readout.textContent !== text) readout.textContent = text; stage.setAttribute("aria-valuetext", text); }

let token = null;
function tokenAt(x, y, z, slot) {
  if (!token) { token = document.createElementNS(NS, "g"); token.innerHTML = tokenSvg(0, 0, 0, P, true); }
  token.setAttribute("transform", translateAlong(P, [x, y, z]));
  if (token.parentNode !== slot) slot.appendChild(token);
}
function dropToken() { if (token) token.remove(); }

// plan d'un événement : aller à la source, prendre, aller à x(heure), déposer ou dévier
function plan() {
  const m = EVENTS[st.i];
  const w = Math.floor(m / WINDOW);
  const T = [], E = [];
  const tw = (t0, t1, fn) => T.push({ t0, t1, fn }), ev = (t, fn) => E.push({ t, fn });
  const x0 = pose.headX, target = xOf(m);
  tw(0, 0.45, (u) => { pose.headX = x0 + (HOME_X - x0) * u; });
  ev(0.5, () => { tokenAt(HOME_X, ARM_Y, NOZZLE_Z - 2 - 4.4 - 0.2, slots.air); say("reçu : événement de " + clock(m)); });
  tw(0.55, 1.35, (u) => { pose.headX = HOME_X + (target - HOME_X) * u; tokenAt(pose.headX, ARM_Y, NOZZLE_Z - 6.6, slots.air); });
  const isLate = w >= WINDOWS || st.closed[w];
  if (!isLate) {
    const pileTop = 2 + Math.floor(st.counts[w] / 40) * 4.4;
    tw(1.4, 1.75, (u) => tokenAt(target, ARM_Y, NOZZLE_Z - 6.6 + (pileTop - NOZZLE_Z + 6.6) * u * u, u > 0.5 ? slotBin[w] : slots.air));
    ev(1.78, () => { dropToken(); st.counts[w] += 1; paintPiles(); });
    ev(1.8, () => observe(m));
  } else {
    ev(1.4, () => say("trop tard : " + clock(m) + " vise une fenêtre déjà émise"));
    tw(1.45, 2.3, (u) => { pose.headX = target + (LATE_X - target) * u; tokenAt(pose.headX, ARM_Y, NOZZLE_Z - 6.6, slots.air); });
    tw(2.35, 2.65, (u) => tokenAt(LATE_X, ARM_Y, NOZZLE_Z - 6.6 + (2 - NOZZLE_Z + 6.6) * u * u, u > 0.5 ? slots.late : slots.air));
    ev(2.68, () => { dropToken(); st.late += 1; paintPiles(); });
    ev(2.7, () => observe(m));
  }
  return { T, E, end: isLate ? 3.6 : 2.7, time: 0 };
}
// le watermark n'avance qu'avec l'heure max vue ; il ferme les fenêtres qu'il dépasse
let wmFrom = 0, wmTo = 0, wmT = 1;
function observe(m) {
  st.max = Math.max(st.max, m);
  const wm = st.max - LATENESS;
  if (wm > st.wm) { wmFrom = pose.ptr; wmTo = wm; wmT = 0; st.wm = wm; }
  const closing = [];
  for (let w = 0; w < WINDOWS; w++) if (!st.closed[w] && st.wm >= (w + 1) * WINDOW) { st.closed[w] = true; closing.push(w); }
  if (closing.length) { const w = closing[closing.length - 1]; say("watermark " + clock(st.wm) + " ≥ " + clock((w + 1) * WINDOW) + " : fenêtre " + clock(w * WINDOW) + "–" + clock((w + 1) * WINDOW) + " émise (" + st.counts[w] + ")"); }
  else say("watermark " + clock(st.wm) + " = max " + clock(st.max) + " − " + LATENESS + " min");
  paintPiles();
}
function reset() {
  Object.assign(st, { i: 0, max: -Infinity, wm: -Infinity, counts: [0, 0, 0, 0], late: 0, closed: [false, false, false, false], lid: [0, 0, 0, 0], text: "" });
  pose.ptr = 0; wmTo = 0; wmT = 1; paintPiles(); say();
}

const SPEED = 1.35;
let job = null, pause = 0.6, frame = 0, last = 0, visible = false, touring = true, idleTimer = 0, finished = 0;
function step(dt) {
  // couvercles et curseur suivent l'état
  for (let w = 0; w < WINDOWS; w++) { const want = st.closed[w] ? 1 : 0; st.lid[w] += (want - st.lid[w]) * (1 - Math.exp(-dt / 0.12)); if (Math.abs(want - st.lid[w]) < 0.002) st.lid[w] = want; }
  if (wmT < 1) { wmT = Math.min(1, wmT + dt / 0.5); pose.ptr = wmFrom + (wmTo - wmFrom) * ease(wmT); }
  if (job) {
    job.time += dt * SPEED;
    for (const e of job.E) if (!e.done && job.time >= e.t) { e.done = true; e.fn(); }
    for (const w of job.T) if (job.time >= w.t0 && !w.finished) { w.fn(ease((job.time - w.t0) / (w.t1 - w.t0))); if (job.time >= w.t1) w.finished = true; }
    if (job.time >= job.end) { job = null; st.i += 1; }
  } else if (touring || wantNext) {
    pause -= dt;
    if (pause <= 0) {
      if (st.i < EVENTS.length) { job = plan(); wantNext = false; pause = touring ? 0.15 : 0; }
      else { finished += dt; say("fin : " + st.closed.filter(Boolean).length + " émises, " + st.late + " trop tard, la dernière attend"); if (finished > 3.5 || !touring) { finished = 0; reset(); pause = 0.8; wantNext = false; } }
    }
  }
  apply();
  return !!job || touring || wmT < 1 || st.lid.some((v, w) => v !== (st.closed[w] ? 1 : 0));
}
let wantNext = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const busy = step(dt);
  frame = visible && busy ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
function instantNext() {
  if (st.i >= EVENTS.length) { reset(); apply(); return; }
  const m = EVENTS[st.i], w = Math.floor(m / WINDOW);
  if (w < WINDOWS && !st.closed[w]) st.counts[w] += 1; else st.late += 1;
  st.i += 1; observe(m); pose.ptr = st.wm; wmT = 1;
  st.lid = st.closed.map((c) => (c ? 1 : 0)); apply();
}
function command(kind) {
  touring = false; clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; run(); } }, 10000);
  if (kind === "reset") { job = null; dropToken(); reset(); pose.headX = HOME_X; apply(); return; }
  if (still.matches) { instantNext(); return; }
  if (!job) { wantNext = true; pause = 0; }
  run();
}
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) { touring = false; for (let n = 0; n < 12; n++) instantNext(); }
stage.addEventListener("click", () => command("next"));
stage.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); command("next"); }
  if (e.key === "r" || e.key === "R" || e.key === "Home") { e.preventDefault(); command("reset"); }
});
document.querySelector("[data-reset]").addEventListener("click", (e) => { e.stopPropagation(); command("reset"); });
paintPiles(); apply(); say();
`;

const body = k.plateHtml({
  fig: "Fig 3",
  title: "Watermark en streaming",
  hint: "Clic : événement suivant · R : recommencer",
  readout: "watermark — · fenêtres émises 0 · trop tard 0",
  keys: [
    { mark: "lit", label: "L'événement en cours de tri" },
    { mark: "red", label: "Watermark : heure max vue − 3 min" },
    { mark: "raised", label: "Fenêtre ouverte ; couvercle fermé = fenêtre émise" },
    { mark: "dim", label: "Trop tard : ignoré (ou traité à part)" },
  ],
  caption:
    "Les événements arrivent dans le désordre : celui de 10:03:36 est reçu après celui de 10:06. Le bras les range par heure d'ÉVÉNEMENT, pas par heure de réception. Le watermark avance avec l'heure la plus tardive vue, moins 3 minutes de retard toléré. Quand il dépasse la fin d'une fenêtre, on considère qu'elle est complète : le couvercle se ferme, l'agrégat est émis et son état libéré. Un événement qui arrive ensuite pour cette fenêtre est trop tard. Un retard toléré plus long rattrape plus de retardataires, mais les résultats sortent plus tard et l'état reste plus longtemps en mémoire.",
  body: `<div class="iso-stage" tabindex="0" role="application" aria-label="Watermark : Entrée traite l'événement suivant, R recommence">${svg}</div><button type="button" data-reset class="wm-btn">Recommencer</button>`,
});
const css = `<style>.iso-plate{position:relative}.wm-btn{position:absolute;right:14px;top:38px;font:500 11px/1 ui-sans-serif,system-ui,sans-serif;padding:6px 10px;border-radius:6px;border:1px solid var(--anatomy-lo,#666);background:transparent;color:var(--anatomy-hi,#ddd);cursor:pointer}.wm-btn:hover{border-color:var(--anatomy-mid,#999)}</style>`;
const out = theme === "light" ? "watermark-light.html" : "watermark.html";
const html = k.pageHtml({ title: "Watermark en streaming", theme, body: css + body, script: kitScript() + live, width: 700 }).replace('<html lang="en">', '<html lang="fr">');
writeFileSync(join(HERE, out), html);
console.log("wrote", out, Math.round(html.length / 1024) + " Ko");
