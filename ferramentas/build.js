'use strict';
const fs = require('fs');
const F = require('./figura.js');
const EX = require('./exercicios.js');

const IDX = require('path').join(__dirname, '..', 'index.html');

function eqg(s) {
  return s ? `<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${s}</g>` : '';
}
function bodyg(s) { return `<g fill="currentColor" stroke="none">${s}</g>`; }

function sym(e) {
  const o = { front: !!e.front, face: e.face !== undefined ? e.face : 1 };
  const si = F.skel(e.ini), sf = F.skel(e.fim);
  let out = `\n<symbol id="${e.id}" viewBox="0 0 200 200">\n  <title>${e.title}</title>\n  `;
  out += eqg(e.eq || '');
  out += `\n  <g opacity="0.35">` + bodyg(F.figure(e.ini, o)) + eqg(e.iniEq ? e.iniEq(si) : '') + `</g>`;
  out += `\n  <g>` + bodyg(F.figure(e.fim, o)) + eqg(e.fimEq ? e.fimEq(sf) : '') + `</g>`;
  if (e.seta) out += `\n  ` + eqg(F.arrow(e.seta[0], e.seta[1], e.seta[2]));
  out += `\n</symbol>\n`;
  return out;
}

const symbols = EX.map(sym).join('');

/* ---- mapa ILLU ---- */
const pares = [];
EX.forEach(e => e.names.forEach(nm => pares.push([nm, e.id])));
const w = Math.max.apply(null, pares.map(p => p[0].length));
const mapa = 'var ILLU = {\n'
  + pares.map(p => '  ' + JSON.stringify(p[0]) + ':' + ' '.repeat(w - p[0].length + 1) + JSON.stringify(p[1])).join(',\n')
  + '\n};';

/* ---- injeta no index.html ---- */
let html = fs.readFileSync(IDX, 'utf8');

const ini = html.indexOf('<svg id="illu-lib"');
const abre = html.indexOf('>', ini) + 1;
const fecha = html.indexOf('\n</svg>', abre);
if (ini < 0 || fecha < 0) throw new Error('biblioteca nao localizada no index.html');
html = html.slice(0, abre) + '\n' + symbols + html.slice(fecha + 1);

const mi = html.indexOf('var ILLU = {');
const mf = html.indexOf('};', mi) + 2;
if (mi < 0) throw new Error('mapa ILLU nao localizado');
html = html.slice(0, mi) + mapa + html.slice(mf);

fs.writeFileSync(IDX, html);

/* ---- folha de contato ---- */
const cells = EX.map(e =>
  `<div class="cell"><svg viewBox="0 0 200 200" role="img" aria-label="${e.title}"><use href="#${e.id}"/></svg><div class="nm">${e.title}</div></div>`
).join('\n');
const thumbs = EX.map(e =>
  `<div class="thumb"><svg viewBox="0 0 200 200" role="img" aria-label="${e.title}"><use href="#${e.id}"/></svg><div class="nm">${e.title}</div></div>`
).join('\n');

const sheet = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Ilustrações do treino</title>
<style>
:root{--bg:#0d0f12;--card:#1a1e25;--line:#333b47;--fg:#f4f7fa;--fg2:#cfd8e3}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;padding:16px}
h1{font-size:20px;margin:0 0 4px}p.h{color:var(--fg2);font-size:14px;margin:0 0 18px}
h2{font-size:15px;color:var(--fg2);margin:26px 0 10px;border-bottom:1px solid var(--line);padding-bottom:6px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px}
.cell{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:8px;text-align:center}
.cell svg{width:100%;height:auto;aspect-ratio:1;color:var(--fg)}
.cell .nm{font-size:13px;font-weight:700;margin-top:4px}
.thumbs{display:flex;flex-wrap:wrap;gap:8px}
.thumb{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:6px;width:104px;text-align:center}
.thumb svg{width:88px;height:88px;color:var(--fg2)}
.thumb .nm{font-size:10px;color:var(--fg2);line-height:1.15;margin-top:3px}
</style></head><body>
<h1>Ilustrações do treino — ${EX.length} desenhos</h1>
<p class="h">Mesma biblioteca que está no index.html. Em cima ampliado; embaixo, 88px (miniatura do card).</p>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">${symbols}</svg>
<h2>Ampliado</h2><div class="grid">${cells}</div>
<h2>Miniatura 88px</h2><div class="thumbs">${thumbs}</div>
</body></html>`;

fs.writeFileSync(require('path').join(__dirname, '..', 'teste-ilustracoes.html'), sheet);
console.log('symbols:', EX.length, '| nomes mapeados:', pares.length, '| index.html e folha de contato atualizados');
