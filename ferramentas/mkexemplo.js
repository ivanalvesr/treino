'use strict';
/* Gera uma copia do app com um mes de treino ja preenchido, para
   demonstrar as telas de Progressao e Historico. */
const fs = require('fs');

const SEED = `
<script>
/* ===== dados de exemplo: 4 semanas do programa masculino ===== */
(function(){
  entrar("Exemplo", "masculino");
  var BASE = {
    "Quadríceps":{"máquina":70,"Smith":40,"halteres":12},
    "Posterior":{"máquina":32,"halteres":16,"barra":25,"peso do corpo":0},
    "Peito":{"máquina":35,"halteres":14,"peso do corpo":0},
    "Costas":{"polia":42,"máquina":38},
    "Ombros":{"máquina":25,"polia":8,"halteres":7},
    "Delt. post.":{"máquina":20,"polia":15},
    "Bíceps":{"barra":15,"halteres":9},
    "Tríceps":{"polia":20,"halteres":12,"barra":15},
    "Panturrilha":{"máquina":45},
    "Core":{"polia":20,"peso do corpo":0},
    "Glúteos":{"barra":30,"halteres":10,"polia":15,"máquina":25}
  };
  var PAD = ["forte","forte","forte","medio","medio","parado","medio","medio","queda"];
  function evo(p, c, r, inc, w){
    if(p === "forte")  return [c + (w >= 2 ? inc : 0), r + (w % 2 === 1 ? 2 : 0)];
    if(p === "medio")  return [c + (w >= 3 ? inc : 0), r + Math.min(w, 2)];
    if(p === "parado") return [c, r + (w === 1 ? 1 : 0)];
    return [c, r + [0,1,-1,1][w]];
  }
  var datas = [["2026-08-24","A1"],["2026-08-25","B1"],["2026-08-26","A2"],["2026-08-27","B2"],
               ["2026-08-31","A1"],["2026-09-01","B1"],["2026-09-02","A2"],["2026-09-03","B2"],
               ["2026-09-07","A1"],["2026-09-08","B1"],["2026-09-09","A2"],["2026-09-10","B2"],
               ["2026-09-14","A1"],["2026-09-15","B1"],["2026-09-16","A2"],["2026-09-17","B2"]];
  datas.forEach(function(par, i){
    var w = Math.floor(i/4), wk = wkById(par[1]), e = {};
    wk.ex.forEach(function(x, xi){
      var g = x[0], ap = APARELHO[x[1]] || "máquina";
      var c0 = (BASE[g] && BASE[g][ap] !== undefined) ? BASE[g][ap] : 20;
      var f = faixaReps(x[3]), r0 = f ? f.base + 1 : 10;
      var pr = evo(PAD[xi % PAD.length], c0, r0, incremento(g, x[1]), w), arr = [];
      for(var s = 0; s < x[2]; s++){
        arr.push({ l: c0 ? String(pr[0]).replace(".", ",") : "", r: String(Math.max(4, pr[1] - s)), c: true });
      }
      e[x[1]] = arr;
    });
    saveSess({ d: par[0], w: par[1], e: e });
  });
  state.date = "2026-09-18";
  state.histAba = "progresso";
  renderHist();
})();
</script>
`;

let html = fs.readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
html = html.replace('<title>Treino Full Body 4x</title>', '<title>Treino · exemplo de relatório</title>');
html = html.replace('</body>', SEED + '</body>');
const OUT = __dirname + '/exemplo-relatorio.html';
fs.writeFileSync(OUT, html);
console.log('gerado:', OUT, Math.round(html.length/1024) + 'KB');
