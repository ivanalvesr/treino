'use strict';
/* Gera os icones PNG do app sem dependencias: rasteriza um halter e codifica
   PNG com zlib do proprio Node. */
const fs = require('fs'), zlib = require('zlib');

const T = (function () { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xFFFFFFFF; for (let i = 0; i < buf.length; i++) c = T[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}
function png(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

/* distancia assinada a um retangulo arredondado (coords normalizadas) */
function sdRR(px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - hw + r, qy = Math.abs(py - cy) - hh + r;
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r;
}
/* halter: barra + duas anilhas internas + duas externas */
function glifo(x, y) {
  return sdRR(x, y, 0.5, 0.5, 0.30, 0.035, 0.035) < 0
    || sdRR(x, y, 0.30, 0.5, 0.06, 0.19, 0.03) < 0 || sdRR(x, y, 0.70, 0.5, 0.06, 0.19, 0.03) < 0
    || sdRR(x, y, 0.185, 0.5, 0.045, 0.13, 0.03) < 0 || sdRR(x, y, 0.815, 0.5, 0.045, 0.13, 0.03) < 0;
}

const BG = [0x4d, 0xa3, 0xff], FG = [0xff, 0xff, 0xff];
function render(S, maskable) {
  const buf = Buffer.alloc(S * S * 4), SS = 4;
  for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
    let cov = 0, gl = 0;
    for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
      const x = (px + (sx + 0.5) / SS) / S, y = (py + (sy + 0.5) / SS) / S;
      const dentro = maskable ? true : sdRR(x, y, 0.5, 0.5, 0.5, 0.5, 0.22) < 0;
      if (dentro) { cov++; if (glifo(x, y)) gl++; }
    }
    const a = cov / (SS * SS), g = cov ? gl / cov : 0, o = (py * S + px) * 4;
    buf[o] = Math.round(BG[0] + (FG[0] - BG[0]) * g);
    buf[o + 1] = Math.round(BG[1] + (FG[1] - BG[1]) * g);
    buf[o + 2] = Math.round(BG[2] + (FG[2] - BG[2]) * g);
    buf[o + 3] = Math.round(a * 255);
  }
  return png(S, S, buf);
}

const OUT = require('path').join(__dirname, '..') + '/';
fs.writeFileSync(OUT + 'icon-192.png', render(192, false));
fs.writeFileSync(OUT + 'icon-512.png', render(512, false));
fs.writeFileSync(OUT + 'icon-512-maskable.png', render(512, true));
console.log('icones gerados:', ['icon-192.png', 'icon-512.png', 'icon-512-maskable.png'].map(f => f + ' ' + fs.statSync(OUT + f).size + 'B').join(', '));
