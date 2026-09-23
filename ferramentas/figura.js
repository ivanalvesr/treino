'use strict';
/* Motor de figura humana para as ilustracoes do treino.
   Cada pose e descrita por angulos de articulacao (0=direita, 90=baixo,
   -90=cima) e o motor emite o corpo com membros que afinam. */

const RAD = Math.PI / 180;
const dir = a => [Math.cos(a * RAD), Math.sin(a * RAD)];
const add = (p, v) => [p[0] + v[0], p[1] + v[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (v, k) => [v[0] * k, v[1] * k];
const perp = v => [-v[1], v[0]];
const unit = v => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
const n = v => Math.round(v * 10) / 10;
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / RAD;

// comprimentos dos segmentos (px no viewBox 200)
const L = { torso: 44, neck: 17, femur: 42, shin: 40, arm: 28, fore: 26 };
// raios: [proximal, distal]
const R = { thigh: [11, 8], shin: [8, 5.5], arm: [7.5, 6], fore: [6, 4.5], neck: [6.5, 6] };

function skel(p) {
  const hip = p.hip;
  const shoulder = add(hip, mul(dir(p.torso), L.torso));
  const headA = p.head !== undefined ? p.head : p.torso;
  const headC = add(shoulder, mul(dir(headA), L.neck));
  const o = { hip, shoulder, headC, headA };
  o.knee = add(hip, mul(dir(p.femur), L.femur));
  o.ankle = add(o.knee, mul(dir(p.shin), L.shin));
  o.elbow = add(shoulder, mul(dir(p.arm), L.arm));
  o.hand = add(o.elbow, mul(dir(p.fore), L.fore));
  if (p.femur2 !== undefined) {
    o.knee2 = add(hip, mul(dir(p.femur2), L.femur));
    o.ankle2 = add(o.knee2, mul(dir(p.shin2), L.shin));
  }
  if (p.arm2 !== undefined) {
    o.elbow2 = add(shoulder, mul(dir(p.arm2), L.arm));
    o.hand2 = add(o.elbow2, mul(dir(p.fore2), L.fore));
  }
  return o;
}

/* segmento afinado: quadrilatero + circulos nas pontas (uniao preenchida) */
function limb(a, b, ra, rb) {
  const d = unit(sub(b, a)), q = perp(d);
  const a1 = add(a, mul(q, ra)), a2 = add(a, mul(q, -ra));
  const b1 = add(b, mul(q, rb)), b2 = add(b, mul(q, -rb));
  return `<path d="M${n(a1[0])} ${n(a1[1])}L${n(b1[0])} ${n(b1[1])}L${n(b2[0])} ${n(b2[1])}L${n(a2[0])} ${n(a2[1])}Z"/>`
    + `<circle cx="${n(a[0])}" cy="${n(a[1])}" r="${n(ra)}"/>`
    + `<circle cx="${n(b[0])}" cy="${n(b[1])}" r="${n(rb)}"/>`;
}

/* tronco de perfil: peito mais largo, cintura estreita, quadril */
function torsoSide(hip, shoulder, face) {
  const u = unit(sub(shoulder, hip));
  let f = perp(u);
  if (Array.isArray(face)) { if (f[0]*face[0] + f[1]*face[1] < 0) f = mul(f, -1); }
  else if ((face > 0 && f[0] < 0) || (face < 0 && f[0] > 0)) f = mul(f, -1);
  const at = t => add(hip, mul(sub(shoulder, hip), t));
  const P0 = at(0), Pw = at(0.44), P1 = at(1);
  const hipF = add(P0, mul(f, 10)), hipB = add(P0, mul(f, -11));
  const wF = add(Pw, mul(f, 8)), wB = add(Pw, mul(f, -10));
  const shF = add(P1, mul(f, 11.5)), shB = add(P1, mul(f, -12));
  const top = add(add(P1, mul(u, 7)), mul(f, -0.5));
  const bot = add(P0, mul(u, -6));
  return `<path d="M${n(hipF[0])} ${n(hipF[1])}Q${n(wF[0])} ${n(wF[1])} ${n(shF[0])} ${n(shF[1])}`
    + `Q${n(top[0])} ${n(top[1])} ${n(shB[0])} ${n(shB[1])}`
    + `Q${n(wB[0])} ${n(wB[1])} ${n(hipB[0])} ${n(hipB[1])}`
    + `Q${n(bot[0])} ${n(bot[1])} ${n(hipF[0])} ${n(hipF[1])}Z"/>`;
}

/* tronco de frente: ombros largos, cintura, quadril */
function torsoFront(hip, shoulder) {
  const u = unit(sub(shoulder, hip));
  const q = perp(u);
  const at = t => add(hip, mul(sub(shoulder, hip), t));
  const P0 = at(0), Pw = at(0.45), P1 = at(1);
  const hipR = add(P0, mul(q, 12.5)), hipL = add(P0, mul(q, -12.5));
  const wR = add(Pw, mul(q, 10)), wL = add(Pw, mul(q, -10));
  const shR = add(P1, mul(q, 15.5)), shL = add(P1, mul(q, -15.5));
  const top = add(P1, mul(u, 6));
  const bot = add(P0, mul(u, -6));
  return `<path d="M${n(hipR[0])} ${n(hipR[1])}Q${n(wR[0])} ${n(wR[1])} ${n(shR[0])} ${n(shR[1])}`
    + `Q${n(top[0])} ${n(top[1])} ${n(shL[0])} ${n(shL[1])}`
    + `Q${n(wL[0])} ${n(wL[1])} ${n(hipL[0])} ${n(hipL[1])}`
    + `Q${n(bot[0])} ${n(bot[1])} ${n(hipR[0])} ${n(hipR[1])}Z"/>`;
}

function head(shoulder, c, a) {
  const neckEnd = add(shoulder, mul(dir(a), 8));
  return limb(shoulder, neckEnd, R.neck[0], R.neck[1])
    + `<g transform="translate(${n(c[0])} ${n(c[1])}) rotate(${n(a + 90)})"><ellipse rx="9.5" ry="11"/></g>`;
}

function hand(p) { return `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="5"/>`; }

/* pe: cunha apontando para footAng, apoiada abaixo do tornozelo */
function foot(ankle, footAng, drop) {
  const d = drop === undefined ? 4 : drop;
  const base = [ankle[0], ankle[1] + d];
  const heel = add(base, mul(dir(footAng + 180), 5));
  const toe = add(base, mul(dir(footAng), 13));
  return limb(heel, toe, 5, 3.5);
}

/* figura completa */
function figure(p, o) {
  o = o || {};
  const face = o.face === undefined ? 1 : o.face;
  const s = skel(p);
  let out = '';
  // membros do lado oposto primeiro (ficam atras)
  if (s.knee2) out += limb(s.hip, s.knee2, R.thigh[0] - 1, R.thigh[1] - 1)
    + limb(s.knee2, s.ankle2, R.shin[0] - 1, R.shin[1])
    + foot(s.ankle2, p.foot2 !== undefined ? p.foot2 : (o.footAng || 0) , p.drop2);
  if (s.elbow2) out += limb(s.shoulder, s.elbow2, R.arm[0] - 1, R.arm[1] - 1)
    + limb(s.elbow2, s.hand2, R.fore[0] - 1, R.fore[1]) + hand(s.hand2);
  out += o.front ? torsoFront(s.hip, s.shoulder) : torsoSide(s.hip, s.shoulder, face);
  out += head(s.shoulder, s.headC, s.headA);
  if (!o.noLeg) out += limb(s.hip, s.knee, R.thigh[0], R.thigh[1])
    + limb(s.knee, s.ankle, R.shin[0], R.shin[1])
    + (o.noFoot ? '' : foot(s.ankle, p.foot !== undefined ? p.foot : (o.footAng || 0), p.drop));
  if (!o.noArm) out += limb(s.shoulder, s.elbow, R.arm[0], R.arm[1])
    + limb(s.elbow, s.hand, R.fore[0], R.fore[1]) + hand(s.hand);
  return out;
}

/* ---------- equipamento (linha fina, sem preenchimento) ---------- */
const E = [];
function eq(s) { E.push(s); return s; }
function ln(a, b) { return `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}"/>`; }
function pth(d) { return `<path d="${d}"/>`; }
function rct(x, y, w, h, r) { return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${r || 2}"/>`; }
function circ(c, r) { return `<circle cx="${n(c[0])}" cy="${n(c[1])}" r="${n(r)}"/>`; }

/* barra: linha com dois retangulos (anilhas) nas pontas */
function bar(c, a, half) {
  const h = half || 26, d = dir(a), q = perp(d);
  const p1 = add(c, mul(d, -h)), p2 = add(c, mul(d, h));
  const plate = p => `<g transform="translate(${n(p[0])} ${n(p[1])}) rotate(${n(a)})"><rect x="-3" y="-11" width="6" height="22" rx="2"/></g>`;
  return ln(p1, p2) + plate(p1) + plate(p2);
}
/* halter: barra curta com dois blocos */
function db(c, a) {
  const h = 11, d = dir(a);
  const p1 = add(c, mul(d, -h)), p2 = add(c, mul(d, h));
  const blk = p => `<g transform="translate(${n(p[0])} ${n(p[1])}) rotate(${n(a)})"><rect x="-4" y="-8" width="8" height="16" rx="2"/></g>`;
  return ln(p1, p2) + blk(p1) + blk(p2);
}
/* cabo: polilinha */
function cable(pts) {
  return `<polyline points="${pts.map(p => n(p[0]) + ',' + n(p[1])).join(' ')}"/>`;
}
/* seta curva de a ate b, com cabeca em b */
function arrow(a, ctrl, b) {
  const d = unit(sub(b, ctrl)), q = perp(d);
  const t1 = add(add(b, mul(d, -11)), mul(q, 6));
  const t2 = add(add(b, mul(d, -11)), mul(q, -6));
  return `<path d="M${n(a[0])} ${n(a[1])}Q${n(ctrl[0])} ${n(ctrl[1])} ${n(b[0])} ${n(b[1])}"/>`
    + `<path d="M${n(t1[0])} ${n(t1[1])}L${n(b[0])} ${n(b[1])}L${n(t2[0])} ${n(t2[1])}"/>`;
}

module.exports = { dir, add, sub, mul, perp, unit, n, ang, L, R, skel, limb, figure, head, hand, foot,
  torsoSide, torsoFront, ln, pth, rct, circ, bar, db, cable, arrow };
