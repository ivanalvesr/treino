# Treino — acompanhamento de treino na academia

App web estático, usado no celular durante o treino. Publicado em
**https://ivanalvesr.github.io/treino/** (GitHub Pages, branch `main`, raiz).
Publicar = `git push`; o Pages leva ~1 min e o app mostra a versão nova na
primeira abertura seguinte.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | **O app inteiro.** HTML + CSS + JS + ilustrações SVG, sem framework e sem dependência externa. |
| `manifest.webmanifest`, `sw.js`, `icon-*.png` | PWA: instalável no Android e funciona offline. |
| `teste-ilustracoes.html` | Folha de contato das 43 ilustrações (gerada, não editar à mão). |
| `ferramentas/` | Scripts Node que geram as ilustrações e os ícones. Não vão para o app. |

## Como mexer

**Treino, séries, reps, exercícios**: bloco `PROGRAMAS` no `index.html`, entre
os comentários `BLOCO DE DADOS DO TREINO` e `FIM DO BLOCO DE DADOS`. Formato:
`["Grupamento", "Nome", séries, "reps", "RIR", opcional]`. O 6º campo `true`
marca exercício opcional (selo no card, fora da conta do progresso).

**Ilustrações**: nunca editar o SVG no `index.html` à mão. As poses ficam em
`ferramentas/exercicios.js` descritas por ângulos de articulação; o motor de
figura humana é `ferramentas/figura.js`. Depois de editar:

    node ferramentas/build.js

Isso regenera os `<symbol>`, o mapa `ILLU` dentro do `index.html` e a folha de
contato. Ícones do app: `node ferramentas/mkicons.js`. Página de demonstração
com um mês de dados fictícios: `node ferramentas/mkexemplo.js` (fica em
`ferramentas/`, não commitar).

## Decisões que não dá para inferir do código

**Usuário**: iniciante, 35 anos, começou a treinar em setembro de 2026. O app
é usado também por outras pessoas — daí os perfis por nome.

**Estímulos distintos**: dentro de um programa, nenhum exercício se repete e,
dentro de cada grupamento, os padrões de movimento são diferentes (dobradiça,
flexão de joelho, extensão de quadril, unilateral, abdução). Ao trocar
exercício, manter essa regra. As três elevações laterais são exceção
deliberada: deltoide lateral só tem um padrão.

**Ordem dentro do dia**: compostos pesados primeiro (regra original do
usuário); dos acessórios para baixo, agrupados por aparelho para não ficar
indo e voltando na academia. O mapa `APARELHO` alimenta o selo do card.

**Volume**: masculino 78 séries/semana, feminino 73. Foi avaliado e está
calibrado — não aumentar sem pedido. Pontos baixos conhecidos e aceitos:
panturrilha 4 e deltoide posterior 4.

**Progressão**: manter a carga até bater o topo da faixa de reps E completar
15 dias nela; então subir (pernas +5 kg, peito/costas +2,5 kg, halteres e
isolamento em cabo +2/+2,5 kg) e voltar à base da faixa.

**Relatório**: o índice usa 1RM estimado (Epley), não carga pura, porque
60kg×9 → 60kg×11 é progresso. Usa a última marca e não o recorde, de forma
que queda apareça como queda.

## Invariantes — quebrar isso estraga dados de verdade

1. **Histórico é indexado pelo NOME do exercício.** Renomear exercício no
   bloco de dados desconecta o histórico dele. Reordenar é seguro.
2. **Chaves do localStorage são versionadas** (`SCHEMA`). Mudança de formato
   só dentro de `migrarSchema()`, que tira cópia antes.
3. **A cópia automática (`tw1:backup`) nunca é sobrescrita por um conjunto
   menor** do que o que ela guarda. Não afrouxar essa checagem.
4. **`sw.js` serve a página pela rede primeiro**, com cache de reserva. Não
   voltar para cache-first: já causou o app ficar dias mostrando versão
   velha. Ao mexer no `sw.js`, trocar o número de `CACHE`.
5. Publicar versão nova **não** apaga treino: `localStorage` e cache do
   service worker são armazenamentos separados.

## Como trabalhar aqui

- Testar no navegador em 390px de largura antes de publicar; o app é para uso
  com uma mão, em pé, na academia.
- Depois de `git push`, conferir no endereço publicado que a mudança subiu
  (o Pages demora ~1 min).
- Avisar quando um desenho ou uma decisão de treino não ficar boa, em vez de
  entregar algo confuso — foi assim que o hack squat foi refeito três vezes.

## Pendências combinadas e não feitas

- Subir panturrilha de 4 para 6 séries e deltoide posterior de 4 para 6.
- "Modo adaptação": mostrar 2 séries por exercício nas primeiras 3 semanas.
- Trocar o programa de um perfil já criado (hoje só na criação).
