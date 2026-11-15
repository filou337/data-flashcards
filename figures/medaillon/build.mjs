// Figure « Architecture médaillon » construite avec le skill anatomy.
// node figures/medaillon/build.mjs [--light]
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKILL = join(homedir(), ".claude/skills/anatomy");
const k = await import(pathToFileURL(join(SKILL, "kit/iso-kit.mjs")));
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")));

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";

const WIDTH = 640;
const HEIGHT = 360;

// ---------- modèle (vérité unique, partagée avec la page) ----------
const MODEL = {
  batch: 8,       // lignes brutes par lot
  dupes: 1,       // doublons écartés par lot
  invalid: 1,     // lignes invalides écartées par lot
  perIngot: 6,    // lignes propres agrégées en un lingot
  tour: 5,        // lots envoyés par la visite automatique avant un rejeu
};

// ---------- géométrie du monde ----------
const PLATE = { x: -172, y: -52, w: 344, d: 118, r: 8 };
const PLATE_H = 10;
const FOOT_H = 5;
const CUBE = 4.4;
const PITCH = 5.6;

const BRONZE = { x: -138, y: -40, w: 54, d: 48, r: 2 };     // bac bronze
const BIN_Z = 6, BIN_FLOOR = 2, BIN_WALL = 2.4, BIN_H = 15;
const FUNNEL = [-111, -16];
const FUNNEL_Z = 54;

const SIEVE = { x: -26, y: -38, w: 52, d: 46, r: 2 };        // table-tamis silver
const SIEVE_Z = 28;
const TRAY_H = 4.5;
const DRAWER = { x: -19, y: -24, w: 38, d: 38, r: 1.5 };     // tiroir de quarantaine, tiré vers l'avant
const DRAWER_Z = 2, DRAWER_H = 12;

const GOLD = { x: 80, y: -40, w: 62, d: 48, r: 3 };          // socle gold
const GOLD_Z = 6;
const MOULD = { x: 86, y: -12, w: 24, d: 16, r: 1.5 };
const MOULD_H = 8;
const PRESS_X = 98, PRESS_Y = -4;
const POSTS = [-19, 11];
const BEAM_Z = 52;
const SHELF = { x: 116, y: -36, w: 22, d: 40, r: 1.5 };

const RAIL_Y = [21, 35];
const RAIL_FROM = -152, RAIL_TO = 152;
const STOP = { bronze: -111, silver: 0, gold: PRESS_X };
const CARRIAGE = { x: -15, y: 19, w: 30, d: 20, r: 2 };
const CARRIAGE_Z = 3, CARRIAGE_TOP = 7;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [FUNNEL[0], -46, 72], [PRESS_X, PRESS_Y, BEAM_Z + 18]],
  WIDTH, HEIGHT, { pad: 14, azimuth: 58 },
);

// ---------- fonctions partagées Node / page (mêmes dessins des deux côtés) ----------
const SHARED = `
const CUBE = ${CUBE}, PITCH = ${PITCH};
function cubeSvg(x, y, z, P, tone, lit) {
  return solidSvg(slabOf({ x: x, y: y, w: CUBE, d: CUBE, r: 0.6 }, z, CUBE, P, 2, 0.4), { tone: tone, crease: "lo", lit: !!lit });
}
function gridSlots(inner, z0, count, layerMax) {
  const cols = Math.floor((inner.w + PITCH - CUBE) / PITCH);
  const rows = Math.floor((inner.d + PITCH - CUBE) / PITCH);
  const per = Math.min(cols * rows, layerMax || 999);
  const out = [];
  for (let i = 0; i < count; i++) {
    const layer = Math.floor(i / per), j = i % per;
    const row = Math.floor(j / cols), col = j % cols;
    out.push([inner.x + col * PITCH, inner.y + row * PITCH, z0 + layer * CUBE]);
  }
  return out;
}
function stackSvg(inner, z0, count, P, tone) {
  const slots = gridSlots(inner, z0, count);
  slots.sort((a, b) => (a[2] - b[2]) || (depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P)));
  return slots.map((s) => cubeSvg(s[0], s[1], s[2], P, tone)).join("");
}
function ingotSvg(x, y, z, P, tone, lit) {
  const base = solidSvg(slabOf({ x: x, y: y, w: 6, d: 14, r: 1.6 }, z, 2.2, P, 3, 0.3), { tone: tone, crease: "lo", lit: !!lit });
  const top = solidSvg(slabOf({ x: x + 0.9, y: y + 0.9, w: 4.2, d: 12.2, r: 1.2 }, z + 2.2, 1.8, P, 3, 0.5), { tone: tone, crease: "lo", lit: !!lit });
  return base + top;
}
function shelfSvg(shelf, z0, count, P) {
  const slots = [];
  for (let i = 0; i < count; i++) {
    const layer = Math.floor(i / 6), j = i % 6;
    const col = j % 3, row = Math.floor(j / 3);
    slots.push([shelf.x + 1.5 + col * 6.8, shelf.y + 3 + row * 18 + (layer % 2) * 1.5, z0 + layer * 4]);
  }
  slots.sort((a, b) => (a[2] - b[2]) || (depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P)));
  return slots.map((s) => ingotSvg(s[0], s[1], s[2], P, "hi")).join("");
}
function batchSvg(cx, cy, z, n, P, tone, lit) {
  const cols = 4, slots = [];
  for (let i = 0; i < n; i++) slots.push([cx - 2 * PITCH + (i % cols) * PITCH + (PITCH - CUBE) / 2, cy - PITCH + Math.floor(i / cols) * PITCH + (PITCH - CUBE) / 2, z]);
  slots.sort((a, b) => depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P));
  return slots.map((s) => cubeSvg(s[0], s[1], s[2], P, tone, lit)).join("");
}
`;
const shared = new Function(...Object.keys(k), SHARED + "return { cubeSvg, stackSvg, ingotSvg, shelfSvg, batchSvg, gridSlots };")(...Object.values(k));

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const screws = (plan, inset, z, size = 0.45) => D(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size });

// ---------- socle ----------
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
  // réglette graduée le long des rails
  const strip = { x: RAIL_FROM, y: 42, w: RAIL_TO - RAIL_FROM, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [1.8, 3.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3, 0.6]), at([strip.x + strip.w - 2, strip.y + 3, 0.6])], { size: 0.45 }));
  // trois plaques gravées, une par couche
  [["BRONZE", STOP.bronze], ["SILVER", STOP.silver], ["GOLD", 111]].forEach(([word, x]) => {
    const plan = { x: x - 19, y: 52, w: 38, d: 9, r: 1.2 };
    out.push(S(k.slabOf(plan, 0, 0.8, P, 3, 0.3), { tone: "lo", crease: "none" }));
    out.push(D([at([plan.x + 1.8, plan.y + 3.5, 0.8]), at([plan.x + plan.w - 1.8, plan.y + 3.5, 0.8])], { size: 0.4 }));
    out.push(k.faceTextSvg(k.topMatrix([x, plan.y + 6], 0.8, P, "x"), word, { size: 4.6, tone: "hi", anchor: "middle" }));
  });
  return out.join("");
}

// ---------- bronze : trémie + bac (ajout seul) ----------
const bronzeInner = { x: BRONZE.x + BIN_WALL + 0.8, y: BRONZE.y + BIN_WALL + 0.8, w: BRONZE.w - 2 * BIN_WALL - 1.6, d: BRONZE.d - 2 * BIN_WALL - 1.6 };
const bronzeFloorZ = BIN_Z + BIN_FLOOR;

function binWalls(plan, z, h, t, P2 = P) {
  const back = { x: plan.x, y: plan.y, w: plan.w, d: t, r: 0.6 };
  const left = { x: plan.x, y: plan.y, w: t, d: plan.d, r: 0.6 };
  const right = { x: plan.x + plan.w - t, y: plan.y, w: t, d: plan.d, r: 0.6 };
  const front = { x: plan.x, y: plan.y + plan.d - t, w: plan.w, d: t, r: 0.6 };
  const wall = (p) => S(k.slabOf(p, z, h, P2, 2, 0.4), { tone: "mid" });
  return { back: wall(back) + wall(left), front: wall(right) + wall(front) };
}

function bronzeBack() {
  const out = [];
  const ped = k.insetPlan(BRONZE, -2);
  out.push(`<path class="iso-halo" d="${k.haloOf(ped, 0, 0.1, P)}" style="filter:blur(3px)"/>`);
  out.push(S(k.slabOf(ped, 0, BIN_Z, P, 4, 0.8), { tone: "lo" }));
  out.push(screws(ped, 3.5, BIN_Z));
  // poteau et bras de la trémie (derrière le bac)
  const post = [FUNNEL[0], -46];
  out.push(S(k.cylinder(post[0], post[1], 4.2, 0, 3, P, 24), { tone: "lo" }));
  out.push(S(k.cylinder(post[0], post[1], 2.6, 3, 66, P, 20), { tone: "mid", crease: "none" }));
  out.push(L([20, 40].map((z) => k.sideArc(post[0], post[1], 2.6, z, P, 12)).join(""), { tone: "faint" }));
  out.push(S(k.slabOf(k.insetPlan(BRONZE, 0), BIN_Z, BIN_FLOOR, P, 3, 0.4), { tone: "mid" }));
  const walls = binWalls(BRONZE, bronzeFloorZ, BIN_H, BIN_WALL);
  out.push(walls.back);
  return out.join("");
}
function bronzeFunnel() {
  const out = [];
  const arm = { x: FUNNEL[0] - 3, y: -48, w: 6, d: 32 + 3, r: 1.5 };
  out.push(S(k.slabOf(arm, FUNNEL_Z + 12, 4, P, 3, 0.5), { tone: "mid" }));
  out.push(D([at([FUNNEL[0], -44, FUNNEL_Z + 16]), at([FUNNEL[0], -22, FUNNEL_Z + 16])], { size: 0.45 }));
  out.push(S(k.cylinder(FUNNEL[0], FUNNEL[1], 3.4, FUNNEL_Z - 8, 8, P, 24), { tone: "mid" }));
  out.push(S(k.cylinder(FUNNEL[0], FUNNEL[1], 10, FUNNEL_Z, 4, P, 40, 0.6), { tone: "mid" }));
  out.push(S(k.cylinder(FUNNEL[0], FUNNEL[1], 12, FUNNEL_Z + 4, 8, P, 48, 0.8), { tone: "mid", inner: L(k.sideArc(FUNNEL[0], FUNNEL[1], 12, FUNNEL_Z + 7, P, 32), { tone: "faint" }) }));
  out.push(L(k.ring(FUNNEL[0], FUNNEL[1], 9.6, FUNNEL_Z + 12, P, 40), { tone: "lo" }));
  out.push(L(k.knurl(FUNNEL[0], FUNNEL[1], 12, FUNNEL_Z + 8.5, FUNNEL_Z + 12, 40, P), { tone: "lo" }));
  return out.join("");
}
function bronzeFront() {
  const walls = binWalls(BRONZE, bronzeFloorZ, BIN_H, BIN_WALL);
  const lip = L(k.planOutline(k.insetPlan(BRONZE, 0.8), bronzeFloorZ + BIN_H, P, 2), { tone: "faint" });
  return walls.front + lip + D([at([BRONZE.x + BRONZE.w - 1.2, BRONZE.y + 4, bronzeFloorZ + BIN_H]), at([BRONZE.x + 4, BRONZE.y + BRONZE.d - 1.2, bronzeFloorZ + BIN_H]), at([BRONZE.x + BRONZE.w - 4, BRONZE.y + BRONZE.d - 1.2, bronzeFloorZ + BIN_H])], { size: 0.4 });
}

// ---------- silver : table-tamis, plateau, tiroir de quarantaine ----------
const legs = k.corners(SIEVE, 3.5);
const trayInner = { x: SIEVE.x + 4.5, y: SIEVE.y + 4.5, w: SIEVE.w - 9, d: SIEVE.d - 9 };
const drawerInner = { x: DRAWER.x + 2.4, y: DRAWER.y + 2.4, w: DRAWER.w - 4.8, d: DRAWER.d - 4.8 };
const legBack = legs.filter(([x, y]) => y < SIEVE.y + SIEVE.d / 2 || x < SIEVE.x + SIEVE.w / 2 && y < 0);
const legSvg = ([x, y]) => S(k.cylinder(x, y, 2.4, 0, SIEVE_Z, P, 20), { tone: "mid", crease: "none" }) + S(k.cylinder(x, y, 3.6, 0, 2, P, 20), { tone: "lo" });

function silverBack() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(SIEVE, 0, 0.1, P)}" style="filter:blur(3px)"/>`);
  for (const leg of byDepth(legs).slice(0, 2)) out.push(legSvg(leg));
  // tiroir de quarantaine sous le tamis
  out.push(S(k.slabOf(DRAWER, DRAWER_Z - 2, 2, P, 3, 0.4), { tone: "lo" }));
  out.push(binWalls(DRAWER, DRAWER_Z, DRAWER_H, 2).back);
  return out.join("");
}
function silverMid() {
  const out = [];
  out.push(binWalls(DRAWER, DRAWER_Z, DRAWER_H, 2).front);
  const pull = { x: -5, y: DRAWER.y + DRAWER.d, w: 10, d: 2.2, r: 0.8 };
  out.push(S(k.slabOf(pull, DRAWER_Z + 4, 3, P, 2, 0.3), { tone: "mid" }));
  for (const leg of byDepth(legs).slice(2)) out.push(legSvg(leg));
  // plateau perforé du tamis + rebord
  out.push(S(k.slabOf(SIEVE, SIEVE_Z, 2.4, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(SIEVE, SIEVE_Z + 1.2, P, 4), { tone: "faint" }) }));
  out.push(screws(SIEVE, 2.2, SIEVE_Z + 2.4, 0.42));
  const walls = binWalls(k.insetPlan(SIEVE, 2.4), SIEVE_Z + 2.4, TRAY_H, 1.6);
  out.push(walls.back);
  // perforations du tamis (visibles entre les lignes propres)
  const holes = [];
  for (let gx = trayInner.x + 1.5; gx < trayInner.x + trayInner.w - 1; gx += 3.2)
    for (let gy = trayInner.y + 1.5; gy < trayInner.y + trayInner.d - 1; gy += 3.2) holes.push(at([gx, gy, SIEVE_Z + 2.4]));
  out.push(`<g data-part="sieve-holes">${D(holes, { size: 0.32, tone: "lo" })}</g>`);
  return out.join("");
}
function silverFront() {
  const walls = binWalls(k.insetPlan(SIEVE, 2.4), SIEVE_Z + 2.4, TRAY_H, 1.6);
  return walls.front;
}

// ---------- gold : socle, moule, presse, étagère de lingots ----------
function goldBack() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(GOLD, 0, 0.1, P)}" style="filter:blur(3px)"/>`);
  out.push(S(k.slabOf(GOLD, 0, GOLD_Z, P, 6, 0.8), { tone: "lo", inner: L(k.sideSeam(GOLD, GOLD_Z / 2, P, 6), { tone: "faint" }) }));
  out.push(screws(GOLD, 3.5, GOLD_Z));
  out.push(L(k.planOutline(k.insetPlan(SHELF, -1.5), GOLD_Z, P, 3), { tone: "faint" }));
  // poteau arrière de la presse
  out.push(S(k.cylinder(PRESS_X, POSTS[0], 4, GOLD_Z, 2.4, P, 24), { tone: "mid" }));
  out.push(S(k.cylinder(PRESS_X, POSTS[0], 2.6, GOLD_Z + 2.4, BEAM_Z - GOLD_Z - 2.4, P, 20), { tone: "mid", crease: "none" }));
  // moule à lingot
  out.push(S(k.slabOf(MOULD, GOLD_Z, MOULD_H, P, 3, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline({ x: PRESS_X - 4, y: PRESS_Y - 8, w: 8, d: 16, r: 1.6 }, GOLD_Z + MOULD_H, P, 3), { tone: "lo" }));
  out.push(screws(MOULD, 2, GOLD_Z + MOULD_H, 0.4));
  return out.join("");
}
const PLUNGER_REST = 30;
function plungerSvg() {
  const out = [];
  out.push(S(k.cylinder(PRESS_X, PRESS_Y, 1.8, 6, BEAM_Z - PLUNGER_REST - 6 + 4, P, 16), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x: PRESS_X - 4, y: PRESS_Y - 8, w: 8, d: 16, r: 1.6 }, 0, 6, P, 3, 0.5), { tone: "hi", crease: "lo" }));
  return out.join("");
}
function goldFront() {
  const out = [];
  out.push(S(k.cylinder(PRESS_X, POSTS[1], 4, GOLD_Z, 2.4, P, 24), { tone: "mid" }));
  out.push(S(k.cylinder(PRESS_X, POSTS[1], 2.6, GOLD_Z + 2.4, BEAM_Z - GOLD_Z - 2.4, P, 20), { tone: "mid", crease: "none" }));
  const beam = { x: PRESS_X - 5, y: POSTS[0] - 5, w: 10, d: POSTS[1] - POSTS[0] + 10, r: 2 };
  out.push(S(k.slabOf(beam, BEAM_Z, 6, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(beam, BEAM_Z + 3, P, 4), { tone: "faint" }) }));
  out.push(D(POSTS.map((y) => at([PRESS_X, y, BEAM_Z + 6])), { size: 0.5 }));
  out.push(L(POSTS.map((y) => k.ring(PRESS_X, y, 2.2, BEAM_Z + 6, P, 14)).join(""), { tone: "lo" }));
  // vis et volant
  out.push(S(k.cylinder(PRESS_X, PRESS_Y, 1.8, BEAM_Z + 6, 7, P, 16), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(PRESS_X, PRESS_Y, 8, BEAM_Z + 13, 2.6, P, 48, 0.5), { tone: "mid" }));
  out.push(L(k.knurl(PRESS_X, PRESS_Y, 8, BEAM_Z + 13, BEAM_Z + 15.6, 48, P), { tone: "lo" }));
  out.push(S(k.cylinder(PRESS_X, PRESS_Y, 2.6, BEAM_Z + 15.6, 2, P, 20), { tone: "mid" }));
  out.push(D([at([PRESS_X, PRESS_Y, BEAM_Z + 17.6])], { size: 0.55, tone: "hi" }));
  return out.join("");
}

// ---------- rails et chariot ----------
function rails() {
  const out = [];
  for (const y of RAIL_Y) {
    out.push(S(k.slabOf({ x: RAIL_FROM, y: y - 2, w: RAIL_TO - RAIL_FROM, d: 4, r: 1 }, 0, 3, P, 3, 0.4), { tone: "mid" }));
    out.push(D([RAIL_FROM + 6, -55, 55, RAIL_TO - 6].map((x) => at([x, y, 3])), { size: 0.4 }));
  }
  for (const x of [RAIL_FROM - 6, RAIL_TO]) {
    out.push(S(k.slabOf({ x, y: RAIL_Y[0] - 4, w: 6, d: RAIL_Y[1] - RAIL_Y[0] + 8, r: 1.2 }, 0, 7, P, 3, 0.5), { tone: "mid" }));
    out.push(D([at([x + 3, RAIL_Y[0], 7]), at([x + 3, RAIL_Y[1], 7])], { size: 0.45 }));
  }
  return out.join("");
}
function carriageBody() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CARRIAGE, 3), CARRIAGE_Z, 0.1, P)}" style="filter:blur(3px)"/>`];
  for (const [x, y] of byDepth([[-9, RAIL_Y[0]], [9, RAIL_Y[0]], [-9, RAIL_Y[1]], [9, RAIL_Y[1]]])) out.push(S(k.slabOf({ x: x - 3, y: y - 3, w: 6, d: 6, r: 1 }, 2.4, 1.2, P, 2), { tone: "lo" }));
  out.push(S(k.slabOf(CARRIAGE, CARRIAGE_Z, CARRIAGE_TOP - CARRIAGE_Z, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(CARRIAGE, CARRIAGE_Z + 2, P, 4), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(CARRIAGE, 2.5), CARRIAGE_TOP, P, 3), { tone: "faint" }));
  out.push(screws(CARRIAGE, 1.6, CARRIAGE_TOP, 0.4));
  const handle = [CARRIAGE.x + CARRIAGE.w + 2.6, 29];
  out.push(S(k.slabOf({ x: CARRIAGE.x + CARRIAGE.w - 1, y: handle[1] - 1.6, w: 3.2, d: 3.2, r: 0.8 }, CARRIAGE_Z + 1, 2.6, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(handle[0] + 1, handle[1], 2.6, CARRIAGE_Z, 5, P, 18), { tone: "mid" }));
  out.push(L(k.knurl(handle[0] + 1, handle[1], 2.6, CARRIAGE_Z, CARRIAGE_Z + 5, 16, P), { tone: "lo" }));
  return out.join("");
}

// ---------- état initial (vide) ----------
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "Un banc d'affinage en trois stations sur un socle. À gauche, une trémie verse chaque lot de 8 lignes brutes dans le bac bronze, où tout s'empile sans jamais être modifié. Un chariot sur rails copie le lot vers la table-tamis silver, qui garde 6 lignes propres et fait tomber 1 doublon et 1 ligne invalide dans un tiroir de quarantaine. Le chariot porte ensuite les lignes propres à la presse gold, qui les agrège en un lingot posé sur l'étagère.",
  body: [
    plate(),
    bronzeBack(),
    bronzeFunnel(),
    `<g data-part="bronze-stack"></g>`,
    `<g data-part="drop"></g>`,
    bronzeFront(),
    silverBack(),
    `<g data-part="rejects"></g>`,
    silverMid(),
    `<g data-part="silver-stack"></g>`,
    silverFront(),
    goldBack(),
    `<g data-part="mould-ingot"></g>`,
    `<g data-part="plunger" transform="${k.translateAlong(P, [0, 0, PLUNGER_REST])}">${plungerSvg()}</g>`,
    goldFront(),
    `<g data-part="gold-stack"></g>`,
    rails(),
    `<g data-part="carriage" transform="${k.translateAlong(P, [STOP.bronze, 0, 0])}">${carriageBody()}<g data-part="load"></g></g>`,
  ],
});

// ---------- page vivante ----------
const live = SHARED + `
const P = ${JSON.stringify(P)};
const M = ${JSON.stringify(MODEL)};
const STOP = ${JSON.stringify(STOP)};
const BRONZE_IN = ${JSON.stringify(bronzeInner)}, BRONZE_Z = ${bronzeFloorZ};
const TRAY_IN = ${JSON.stringify(trayInner)}, TRAY_Z = ${SIEVE_Z + 2.4};
const DRAWER_IN = ${JSON.stringify(drawerInner)}, DRAWER_Z = ${DRAWER_Z};
const SHELF = ${JSON.stringify(SHELF)}, GOLD_Z = ${GOLD_Z};
const FUNNEL = ${JSON.stringify(FUNNEL)}, SPOUT_Z = ${FUNNEL_Z - 8 - CUBE};
const PRESS = [${PRESS_X}, ${PRESS_Y}], MOULD_TOP = ${GOLD_Z + MOULD_H}, PLUNGER_REST = ${PLUNGER_REST};
const CARRIAGE_TOP = ${CARRIAGE_TOP};
const stage = document.querySelector(".iso-stage");
const svgEl = stage.querySelector("svg");
const part = (name) => svgEl.querySelector('[data-part="' + name + '"]');
const el = { bronze: part("bronze-stack"), silver: part("silver-stack"), rejects: part("rejects"), gold: part("gold-stack"), drop: part("drop"), mould: part("mould-ingot"), plunger: part("plunger"), carriage: part("carriage"), load: part("load") };
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clean = M.batch - M.dupes - M.invalid;
const BRONZE_PER = Math.floor((BRONZE_IN.w + PITCH - CUBE) / PITCH) * Math.floor((BRONZE_IN.d + PITCH - CUBE) / PITCH);

// état : ce qui est stocké dans chaque couche
const st = { lots: 0, bronze: 0, silver: 0, rejects: 0, gold: 0, replaying: false, note: "" };
const drawn = {};
function paint(key, svg) { if (drawn[key] !== svg) { drawn[key] = svg; el[key].innerHTML = svg; } }
function paintStores() {
  paint("bronze", stackSvg(BRONZE_IN, BRONZE_Z, Math.min(st.bronze, 126), P, "mid"));
  paint("silver", stackSvg(TRAY_IN, TRAY_Z, Math.min(st.silver, 96), P, "hi"));
  paint("rejects", stackSvg(DRAWER_IN, DRAWER_Z, Math.min(st.rejects, 60), P, "lo"));
  paint("gold", shelfSvg(SHELF, GOLD_Z, Math.min(st.gold, 18), P));
}
function say() {
  const text = st.note || ("lot " + st.lots + " · bronze " + st.bronze + " · silver " + st.silver + " · rejets " + st.rejects + " · gold " + st.gold);
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuetext", text);
}

// une file d'animations : chaque lot traverse les trois couches
const queue = [];
let job = null, jobT = 0;
let carX = STOP.bronze, carTarget = STOP.bronze, plungerZ = PLUNGER_REST, plungerTarget = PLUNGER_REST;
const phases = [
  { until: 0.9, run: (t, j) => { const z = SPOUT_Z - (SPOUT_Z - (BRONZE_Z + Math.floor(st.bronze / BRONZE_PER) * CUBE + 4)) * t * t; paint("drop", batchSvg(FUNNEL[0], FUNNEL[1], z, M.batch, P, "hi", true)); carTarget = STOP.bronze; } },
  { until: 1.4, enter: () => { paint("drop", ""); st.bronze += M.batch; st.lots += 1; paint("load", batchSvg(0, 29, CARRIAGE_TOP, M.batch, P, "hi", true)); } },
  { until: 2.6, run: () => { carTarget = STOP.silver; } },
  { until: 3.3, enter: () => { st.rejects += M.dupes + M.invalid; st.silver += clean; paint("load", batchSvg(0, 29, CARRIAGE_TOP, clean, P, "hi", true)); } },
  { until: 4.5, run: () => { carTarget = STOP.gold; } },
  { until: 5.1, run: () => { plungerTarget = MOULD_TOP + 0.2; }, enter: () => {} },
  { until: 5.7, enter: () => { paint("load", ""); paint("mould", ingotSvg(PRESS[0] - 3, PRESS[1] - 7, MOULD_TOP, P, "hi", true)); plungerTarget = PLUNGER_REST; } },
  { until: 6.6, enter: () => { paint("mould", ""); st.gold += 1; }, run: () => { carTarget = STOP.bronze; } },
];
function startJob(kind) { job = { kind, phase: -1 }; jobT = 0; }
function advance(dt) {
  if (!job && queue.length) startJob(queue.shift());
  if (!job) return false;
  if (job.kind === "replay") return replayStep(dt);
  jobT += dt;
  const start = (i) => (i ? phases[i - 1].until : 0);
  while (job.phase + 1 < phases.length && jobT >= start(job.phase + 1)) {
    job.phase += 1;
    if (phases[job.phase].enter) phases[job.phase].enter();
  }
  if (jobT >= phases[phases.length - 1].until) { job = null; paintStores(); say(); return true; }
  const p = phases[job.phase], from = start(job.phase);
  if (p.run) p.run((jobT - from) / (p.until - from), job);
  paintStores(); say();
  return true;
}
// rejeu : on vide silver et gold, puis on les reconstruit lot par lot depuis bronze
function replayStep(dt) {
  jobT += dt;
  if (job.phase < 0) { job.phase = 0; job.before = { silver: st.silver, rejects: st.rejects, gold: st.gold }; st.silver = 0; st.rejects = 0; st.gold = 0; st.note = "rejeu : silver et gold vidés"; }
  const step = 0.35, lots = st.bronze / M.batch;
  const done = Math.min(lots, Math.max(0, Math.floor((jobT - 0.8) / step)));
  st.silver = done * clean; st.rejects = done * (M.dupes + M.invalid); st.gold = done;
  if (jobT > 0.8) st.note = "rejeu depuis bronze : lot " + done + "/" + lots;
  if (done >= lots && jobT > 0.8 + lots * step + 1.4) {
    const same = st.silver === job.before.silver && st.gold === job.before.gold && st.rejects === job.before.rejects;
    st.note = same ? "rejeu terminé : silver " + st.silver + " · gold " + st.gold + " — identique" : "";
    job = null; noteUntil = clock + 2.6;
  }
  paintStores(); say();
  return true;
}
let noteUntil = 0, clock = 0;

function instant(kind) {
  if (kind === "lot") { st.lots += 1; st.bronze += M.batch; st.silver += clean; st.rejects += M.dupes + M.invalid; st.gold += 1; st.note = ""; }
  else { st.note = "rejeu terminé : silver " + st.silver + " · gold " + st.gold + " — identique"; }
  paintStores(); say();
}

// visite automatique : quelques lots, un rejeu, puis on recommence à vide
let touring = true, tourT = 0, tourStep = 0, idleTimer = 0;
function tour(dt) {
  if (job || queue.length) return;
  tourT += dt;
  if (tourT < 0.6) return;
  tourT = 0;
  if (tourStep < M.tour) { queue.push("lot"); tourStep += 1; }
  else if (tourStep === M.tour) { queue.push("replay"); tourStep += 1; }
  else { tourStep = 0; Object.assign(st, { lots: 0, bronze: 0, silver: 0, rejects: 0, gold: 0, note: "" }); paintStores(); say(); }
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now; clock += dt;
  if (st.note && !job && clock > noteUntil) { st.note = ""; say(); }
  if (touring) tour(dt);
  const busy = advance(dt);
  carX += (carTarget - carX) * (1 - Math.exp(-dt / 0.22));
  if (Math.abs(carTarget - carX) < 0.02) carX = carTarget;
  plungerZ += (plungerTarget - plungerZ) * (1 - Math.exp(-dt / 0.09));
  if (Math.abs(plungerTarget - plungerZ) < 0.02) plungerZ = plungerTarget;
  el.carriage.setAttribute("transform", translateAlong(P, [carX, 0, 0]));
  el.plunger.setAttribute("transform", translateAlong(P, [0, 0, plungerZ]));
  const moving = busy || touring || carX !== carTarget || plungerZ !== plungerTarget || (st.note && clock <= noteUntil);
  frame = visible && moving ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
function command(kind) {
  touring = false; clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourStep = st.lots >= M.tour ? M.tour : st.lots; run(); } }, 9000);
  if (still.matches) { instant(kind); return; }
  if (kind === "replay" && st.bronze === 0) return;
  queue.push(kind); run();
}
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) { touring = false; Object.assign(st, { lots: 3, bronze: 3 * M.batch, silver: 3 * clean, rejects: 3 * (M.dupes + M.invalid), gold: 3 }); }
stage.addEventListener("click", () => command("lot"));
stage.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); command("lot"); }
  if (event.key === "r" || event.key === "R") { event.preventDefault(); command("replay"); }
});
document.querySelector("[data-replay]").addEventListener("click", (event) => { event.stopPropagation(); command("replay"); });
paintStores(); say();
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "Architecture médaillon",
  hint: "Clic : un lot · R : rejouer",
  readout: "lot 0 · bronze 0 · silver 0 · rejets 0 · gold 0",
  keys: [
    { mark: "lit", label: "Le lot en cours de traitement" },
    { mark: "raised", label: "Bronze : lignes brutes, ajout seul" },
    { mark: "flat", label: "Silver : lignes propres ; tiroir = quarantaine" },
    { mark: "edge", label: "Gold : agrégats prêts à l'usage" },
  ],
  caption:
    "Chaque lot de 8 lignes brutes est ajouté tel quel au bac bronze : on n'y modifie ni ne supprime rien, ce qui permet de tout rejouer. Le tamis silver garde 6 lignes propres et envoie 1 doublon et 1 ligne invalide au tiroir de quarantaine, avec leur trace. La presse gold agrège les 6 lignes propres en un lingot, comme une table de KPI. « Rejouer » vide silver et gold puis les reconstruit depuis bronze : on retrouve exactement les mêmes chiffres, parce que chaque étape est idempotente.",
  body: `<div class="iso-stage" tabindex="0" role="application" aria-label="Architecture médaillon : Entrée envoie un lot, R rejoue silver et gold depuis bronze">${svg}</div><button type="button" data-replay class="md-replay">Rejouer depuis bronze</button>`,
});

const css = `<style>.md-replay{position:absolute;right:14px;top:38px;font:500 11px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.02em;padding:6px 10px;border-radius:6px;border:1px solid var(--anatomy-lo,#666);background:transparent;color:var(--anatomy-hi,#ddd);cursor:pointer}.md-replay:hover{border-color:var(--anatomy-mid,#999)}.iso-plate{position:relative}</style>`;
const out = theme === "light" ? "medaillon-light.html" : "medaillon.html";
const html = k.pageHtml({ title: "Architecture médaillon", theme, body: css + body, script: kitScript() + live, width: 700 }).replace('<html lang="en">', '<html lang="fr">');
writeFileSync(join(HERE, out), html);
console.log("wrote", out, Math.round(html.length / 1024) + " Ko");
