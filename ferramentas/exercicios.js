'use strict';
const F = require('./figura.js');
const { ln, rct, circ, bar, db, cable, arrow, pth } = F;

const CHAO = ln([22, 182], [178, 182]);

/* banco inclinado: duas linhas paralelas (espessura do estofado) + apoio */
const BANCO_INC = ln([98,132],[58,84]) + ln([104,136],[64,88]) + ln([96,130],[132,134]) + ln([70,96],[70,182]) + ln([122,134],[122,182]);

/* Cada exercicio:
   id, title, names[] (nomes no WORKOUTS que usam este simbolo)
   opt   : {front:true} vista frontal, {face:[x,y]} lado do peito
   eq    : equipamento estatico (linha fina)
   ini   : pose inicial (opacidade reduzida) + iniEq(skel)
   fim   : pose final + fimEq(skel)
   seta  : [de, controle, para]                                              */
const EX = [

/* ================= PERNAS: agachar / empurrar ================= */
{ id:'ex-hack-squat', title:'Hack squat', names:['Hack squat'],
  eq: ln([52,74],[112,182]) + ln([104,176],[178,176]) + CHAO,
  ini:{hip:[74,112], torso:-128, head:-124, femur:14, shin:66, arm:36, fore:70},
  fim:{hip:[104,144], torso:-128, head:-124, femur:-40, shin:74, arm:36, fore:70},
  iniEq: s => ln([58,96],[80,82]), fimEq: s => ln([88,128],[110,114]),
  seta:[[148,44],[178,60],[172,100]] },

{ id:'ex-agacho-smith', title:'Agachamento no Smith', names:['Agachamento no Smith'],
  eq: ln([50,16],[50,184]) + ln([150,16],[150,184]) + ln([30,184],[170,184]),
  ini:{hip:[96,90], torso:-88, head:-90, femur:86, shin:92, arm:128, fore:-150},
  fim:{hip:[84,130], torso:-72, head:-78, femur:20, shin:118, arm:128, fore:-150},
  iniEq: s => bar(s.shoulder,0,30), fimEq: s => bar(s.shoulder,0,30),
  seta:[[168,64],[184,94],[168,124]] },

{ id:'ex-leg-press', title:'Leg press', names:['Leg press'],
  eq: ln([76,150],[38,128]) + ln([76,152],[114,152]) + ln([114,150],[194,104]) + CHAO,
  ini:{hip:[80,142], torso:-150, head:-146, femur:-75, shin:10, arm:30, fore:20},
  fim:{hip:[80,142], torso:-150, head:-146, femur:-30, shin:-30, arm:30, fore:20},
  iniEq: s => plate(s.ankle,-31), fimEq: s => plate(s.ankle,-31),
  seta:[[110,60],[146,38],[174,44]] },

{ id:'ex-extensora', title:'Cadeira extensora', names:['Cadeira extensora'],
  eq: ln([42,134],[30,88]) + ln([42,134],[102,134]) + ln([102,134],[102,178]) + CHAO,
  ini:{hip:[60,120], torso:-84, head:-88, femur:2, shin:80, arm:104, fore:96},
  fim:{hip:[60,120], torso:-84, head:-88, femur:2, shin:-6, arm:104, fore:96},
  iniEq: s => pad(s.ankle,80), fimEq: s => pad(s.ankle,-6),
  seta:[[126,174],[156,166],[160,134]] },

/* ================= PERNAS: dobradica / posterior ================= */
{ id:'ex-stiff-halteres', title:'Stiff com halteres', names:['Stiff com halteres'],
  eq: CHAO,
  ini:{hip:[96,92], torso:-86, head:-88, femur:88, shin:91, arm:93, fore:91},
  fim:{hip:[84,94], torso:-22, head:-32, femur:86, shin:96, arm:85, fore:88},
  iniEq: s => db(s.hand,0), fimEq: s => db(s.hand,0),
  seta:[[152,60],[178,86],[164,122]] },

{ id:'ex-stiff-barra', title:'Stiff na barra ou Smith', names:['Stiff na barra ou Smith'],
  eq: CHAO,
  ini:{hip:[96,92], torso:-86, head:-88, femur:88, shin:91, arm:93, fore:91},
  fim:{hip:[84,94], torso:-22, head:-32, femur:86, shin:96, arm:85, fore:88},
  iniEq: s => bar(s.hand,0,24), fimEq: s => bar(s.hand,0,24),
  seta:[[152,60],[178,86],[164,122]] },

{ id:'ex-mesa-flexora', title:'Mesa flexora', names:['Mesa flexora'],
  face:[0,1],
  eq: ln([26,142],[142,142]) + ln([40,142],[40,182]) + ln([128,142],[128,182]) + CHAO,
  ini:{hip:[92,126], torso:176, head:174, femur:-4, shin:-6, arm:45, fore:-10},
  fim:{hip:[92,126], torso:176, head:174, femur:-4, shin:-76, arm:45, fore:-10},
  iniEq: s => pad(s.ankle,-6), fimEq: s => pad(s.ankle,-76),
  seta:[[178,128],[186,98],[158,78]] },

{ id:'ex-flexora-sentada', title:'Flexora sentada', names:['Flexora sentada'],
  eq: ln([44,132],[34,86]) + ln([44,132],[110,132]) + ln([110,132],[110,178]) + CHAO,
  ini:{hip:[68,120], torso:-82, head:-86, femur:2, shin:-8, arm:102, fore:96},
  fim:{hip:[68,120], torso:-82, head:-86, femur:2, shin:74, arm:102, fore:96},
  iniEq: s => pad(s.ankle,-8), fimEq: s => pad(s.ankle,74),
  seta:[[168,116],[184,142],[160,166]] },

{ id:'ex-panturrilha-pe', title:'Panturrilha em pé', names:['Panturrilha em pé'],
  eq: rct(80,170,38,10) + ln([146,52],[146,180]) + CHAO,
  ini:{hip:[92,86], torso:-88, head:-90, femur:88, shin:91, arm:34, fore:4, foot:10, drop:6},
  fim:{hip:[92,72], torso:-88, head:-90, femur:88, shin:91, arm:34, fore:4, foot:42, drop:11},
  seta:[[62,140],[46,112],[62,84]] },

{ id:'ex-panturrilha-sentada', title:'Panturrilha sentada', names:['Panturrilha sentada'],
  eq: ln([38,128],[92,128]) + ln([38,128],[30,92]) + rct(94,166,36,10) + CHAO,
  ini:{hip:[62,116], torso:-86, head:-90, femur:0, shin:88, arm:100, fore:70, foot:8, drop:10},
  fim:{hip:[62,116], torso:-86, head:-90, femur:0, shin:88, arm:100, fore:70, foot:44, drop:10},
  fimEq: s => rct(88,100,32,12),
  seta:[[150,168],[168,146],[150,126]] },

/* ================= EMPURRAR ================= */
{ id:'ex-supino-inc-halteres', title:'Supino inclinado com halteres', names:['Supino inclinado com halteres'],
  eq: BANCO_INC + CHAO,
  ini:{hip:[104,116], torso:-130, head:-126, femur:20, shin:80, arm:55, fore:-30},
  fim:{hip:[104,116], torso:-130, head:-126, femur:20, shin:80, arm:-40, fore:-40},
  iniEq: s => db(s.hand,0), fimEq: s => db(s.hand,0),
  seta:[[152,96],[172,68],[156,40]] },

{ id:'ex-supino-maquina', title:'Supino máquina', names:['Supino máquina','Chest press máquina'],
  eq: ln([48,128],[38,82]) + ln([48,128],[104,128]) + ln([150,56],[150,178]) + CHAO,
  ini:{hip:[66,126], torso:-88, head:-90, femur:4, shin:84, arm:32, fore:-24},
  fim:{hip:[66,126], torso:-88, head:-90, femur:4, shin:84, arm:2, fore:-2},
  iniEq: s => grip(s.hand), fimEq: s => grip(s.hand) + ln([s.hand[0],s.hand[1]-12],[150,66]),
  seta:[[106,52],[136,40],[160,54]] },

{ id:'ex-supino-inc-maquina', title:'Supino inclinado máquina', names:['Supino inclinado máquina'],
  eq: ln([46,126],[30,78]) + ln([46,126],[104,126]) + ln([152,34],[152,178]) + ln([152,44],[128,44]) + CHAO,
  ini:{hip:[64,124], torso:-84, head:-88, femur:4, shin:84, arm:40, fore:-52},
  fim:{hip:[64,124], torso:-84, head:-88, femur:4, shin:84, arm:-40, fore:-40},
  iniEq: s => grip(s.hand), fimEq: s => grip(s.hand) + ln([s.hand[0]+4,s.hand[1]-8],[150,46]),
  seta:[[150,110],[174,84],[158,54]] },

{ id:'ex-desenvolvimento-maquina', title:'Desenvolvimento máquina', names:['Desenvolvimento máquina'],
  eq: ln([48,130],[38,84]) + ln([48,130],[104,130]) + ln([132,18],[132,60]) + CHAO,
  ini:{hip:[66,128], torso:-88, head:-90, femur:4, shin:84, arm:74, fore:-72},
  fim:{hip:[66,128], torso:-88, head:-90, femur:4, shin:84, arm:-72, fore:-80},
  iniEq: s => grip(s.hand), fimEq: s => grip(s.hand),
  seta:[[128,92],[152,68],[140,38]] },

/* ================= PUXAR ================= */
{ id:'ex-puxada-frontal', title:'Puxada frontal pronada', names:['Puxada frontal pronada'],
  eq: ln([30,14],[150,14]) + circ([96,22],7) + ln([48,132],[110,132]) + ln([48,132],[40,96]) + rct(86,118,30,10) + CHAO,
  ini:{hip:[72,128], torso:-80, head:-84, femur:2, shin:80, arm:-74, fore:-80},
  fim:{hip:[72,128], torso:-80, head:-84, femur:2, shin:80, arm:104, fore:-54},
  iniEq: s => bar(s.hand,0,26) + cable([[s.hand[0],s.hand[1]],[96,29]]),
  fimEq: s => bar(s.hand,0,26) + cable([[s.hand[0],s.hand[1]],[96,29]]),
  seta:[[150,46],[168,72],[150,98]] },

{ id:'ex-puxada-neutra', title:'Puxada neutra', names:['Puxada neutra'],
  eq: ln([30,14],[150,14]) + circ([96,22],7) + ln([48,132],[110,132]) + ln([48,132],[40,96]) + rct(86,118,30,10) + CHAO,
  ini:{hip:[72,128], torso:-80, head:-84, femur:2, shin:80, arm:-74, fore:-80},
  fim:{hip:[72,128], torso:-80, head:-84, femur:2, shin:80, arm:104, fore:-54},
  iniEq: s => triHandle(s.hand) + cable([[s.hand[0],s.hand[1]-10],[96,29]]),
  fimEq: s => triHandle(s.hand) + cable([[s.hand[0],s.hand[1]-10],[96,29]]),
  seta:[[150,46],[168,72],[150,98]] },

{ id:'ex-remada-baixa', title:'Remada baixa neutra', names:['Remada baixa neutra'],
  eq: ln([38,140],[104,140]) + rct(148,148,24,28) + rct(136,158,18,8) + CHAO,
  ini:{hip:[64,134], torso:-86, head:-88, femur:-6, shin:26, arm:4, fore:-2},
  fim:{hip:[64,134], torso:-86, head:-88, femur:-6, shin:26, arm:128, fore:-4},
  iniEq: s => triHandle(s.hand) + cable([[s.hand[0]+8,s.hand[1]],[152,158]]),
  fimEq: s => triHandle(s.hand) + cable([[s.hand[0]+8,s.hand[1]],[152,158]]),
  seta:[[148,86],[120,72],[92,88]] },

{ id:'ex-remada-apoiada', title:'Remada com peito apoiado', names:['Remada com peito apoiado'],
  eq: ln([92,105],[132,85]) + ln([95,111],[135,91]) + ln([112,100],[112,180]) + CHAO,
  ini:{hip:[86,92], torso:-50, head:-46, femur:88, shin:92, arm:88, fore:86},
  fim:{hip:[86,92], torso:-50, head:-46, femur:88, shin:92, arm:140, fore:60},
  iniEq: s => bar(s.hand,90,16), fimEq: s => bar(s.hand,90,16),
  seta:[[150,144],[142,116],[112,110]] },

/* ================= OMBROS ================= */
{ id:'ex-elev-lateral', title:'Elevação lateral', names:['Elevação lateral'],
  front:true, eq: CHAO,
  ini:{hip:[100,100], torso:-90, head:-90, femur:96, shin:92, arm:100, fore:94,
       femur2:84, shin2:88, arm2:80, fore2:86},
  fim:{hip:[100,100], torso:-90, head:-90, femur:96, shin:92, arm:172, fore:178,
       femur2:84, shin2:88, arm2:8, fore2:2},
  iniEq: s => db(s.hand,90) + db(s.hand2,90), fimEq: s => db(s.hand,90) + db(s.hand2,90),
  seta:[[40,120],[24,92],[40,66]] },

{ id:'ex-elev-lateral-polia', title:'Elevação lateral na polia', names:['Elevação lateral na polia'],
  front:true, eq: rct(12,148,20,30) + CHAO,
  ini:{hip:[104,100], torso:-90, head:-90, femur:96, shin:92, arm:100, fore:94,
       femur2:84, shin2:88, arm2:80, fore2:86},
  fim:{hip:[104,100], torso:-90, head:-90, femur:96, shin:92, arm:172, fore:178,
       femur2:84, shin2:88, arm2:8, fore2:2},
  iniEq: s => cable([[s.hand[0],s.hand[1]],[22,152]]),
  fimEq: s => cable([[s.hand[0],s.hand[1]],[22,152]]),
  seta:[[62,120],[46,92],[58,64]] },

{ id:'ex-elev-lateral-maquina', title:'Elevação lateral máquina', names:['Elevação lateral máquina'],
  front:true, eq: rct(78,108,44,10) + ln([84,118],[84,178]) + ln([116,118],[116,178]) + CHAO,
  ini:{hip:[100,100], torso:-90, head:-90, femur:96, shin:92, arm:104, fore:98,
       femur2:84, shin2:88, arm2:76, fore2:82},
  fim:{hip:[100,100], torso:-90, head:-90, femur:96, shin:92, arm:170, fore:176,
       femur2:84, shin2:88, arm2:10, fore2:4},
  iniEq: s => padArm(s.elbow) + padArm(s.elbow2),
  fimEq: s => padArm(s.elbow) + padArm(s.elbow2),
  seta:[[44,116],[28,90],[44,64]] },

{ id:'ex-crucifixo-inverso', title:'Crucifixo inverso', names:['Crucifixo inverso'],
  front:true, eq: rct(78,112,44,10) + ln([84,122],[84,178]) + ln([116,122],[116,178]) + CHAO,
  ini:{hip:[100,100], torso:-90, head:-90, femur:96, shin:92, arm:146, fore:34,
       femur2:84, shin2:88, arm2:34, fore2:146},
  fim:{hip:[100,100], torso:-90, head:-90, femur:96, shin:92, arm:185, fore:175,
       femur2:84, shin2:88, arm2:-5, fore2:5},
  iniEq: s => grip(s.hand) + grip(s.hand2), fimEq: s => grip(s.hand) + grip(s.hand2),
  seta:[[150,52],[172,64],[176,90]] },

{ id:'ex-face-pull', title:'Face pull', names:['Face pull'],
  eq: ln([172,12],[172,34]) + circ([172,40],7) + CHAO,
  ini:{hip:[76,98], torso:-88, head:-90, femur:88, shin:92, arm:22, fore:18},
  fim:{hip:[76,98], torso:-88, head:-90, femur:88, shin:92, arm:-36, fore:194},
  iniEq: s => cable([[s.hand[0],s.hand[1]],[168,44]]), fimEq: s => rope(s.hand,[168,44]),
  seta:[[146,86],[124,98],[104,84]] },

/* ================= BICEPS ================= */
{ id:'ex-rosca-direta', title:'Rosca direta', names:['Rosca direta'],
  eq: CHAO,
  ini:{hip:[96,92], torso:-88, head:-90, femur:88, shin:91, arm:94, fore:88},
  fim:{hip:[96,92], torso:-88, head:-90, femur:88, shin:91, arm:98, fore:-48},
  iniEq: s => bar(s.hand,0,24), fimEq: s => bar(s.hand,0,24),
  seta:[[148,112],[168,88],[152,62]] },

{ id:'ex-rosca-martelo', title:'Rosca martelo', names:['Rosca martelo'],
  eq: CHAO,
  ini:{hip:[96,92], torso:-88, head:-90, femur:88, shin:91, arm:94, fore:88},
  fim:{hip:[96,92], torso:-88, head:-90, femur:88, shin:91, arm:98, fore:-48},
  iniEq: s => db(s.hand,90), fimEq: s => db(s.hand,-50),
  seta:[[148,112],[168,88],[152,62]] },

{ id:'ex-rosca-scott', title:'Rosca Scott', names:['Rosca Scott'],
  eq: ln([76,96],[126,132]) + ln([50,132],[96,132]) + ln([50,132],[42,98]) + ln([104,132],[104,178]) + CHAO,
  ini:{hip:[68,122], torso:-84, head:-88, femur:4, shin:82, arm:36, fore:30},
  fim:{hip:[68,122], torso:-84, head:-88, femur:4, shin:82, arm:36, fore:-64},
  iniEq: s => bar(s.hand,0,20), fimEq: s => bar(s.hand,0,20),
  seta:[[160,120],[176,94],[158,68]] },

{ id:'ex-rosca-inclinada', title:'Rosca inclinada', names:['Rosca inclinada'],
  eq: BANCO_INC + CHAO,
  ini:{hip:[104,116], torso:-130, head:-126, femur:20, shin:80, arm:100, fore:95},
  fim:{hip:[104,116], torso:-130, head:-126, femur:20, shin:80, arm:100, fore:-30},
  iniEq: s => db(s.hand,0), fimEq: s => db(s.hand,0),
  seta:[[40,140],[26,114],[44,90]] },

/* ================= TRICEPS ================= */
{ id:'ex-triceps-polia', title:'Tríceps na polia', names:['Tríceps na polia'],
  eq: ln([40,14],[160,14]) + circ([112,22],7) + CHAO,
  ini:{hip:[92,94], torso:-88, head:-90, femur:88, shin:91, arm:82, fore:-58},
  fim:{hip:[92,94], torso:-88, head:-90, femur:88, shin:91, arm:82, fore:74},
  iniEq: s => bar(s.hand,0,18) + cable([[s.hand[0],s.hand[1]],[112,29]]),
  fimEq: s => bar(s.hand,0,18) + cable([[s.hand[0],s.hand[1]],[112,29]]),
  seta:[[152,72],[172,96],[156,124]] },

{ id:'ex-triceps-corda', title:'Tríceps corda', names:['Tríceps corda'],
  eq: ln([40,14],[160,14]) + circ([112,22],7) + CHAO,
  ini:{hip:[92,94], torso:-88, head:-90, femur:88, shin:91, arm:82, fore:-58},
  fim:{hip:[92,94], torso:-88, head:-90, femur:88, shin:91, arm:82, fore:74},
  iniEq: s => rope(s.hand,[112,29]), fimEq: s => rope(s.hand,[112,29]),
  seta:[[152,72],[172,96],[156,124]] },

{ id:'ex-triceps-unilateral', title:'Tríceps polia unilateral', names:['Tríceps polia unilateral'],
  eq: ln([40,14],[160,14]) + circ([112,22],7) + CHAO,
  ini:{hip:[92,94], torso:-88, head:-90, femur:88, shin:91, arm:82, fore:-58},
  fim:{hip:[92,94], torso:-88, head:-90, femur:88, shin:91, arm:82, fore:74},
  iniEq: s => grip(s.hand) + cable([[s.hand[0],s.hand[1]],[112,29]]),
  fimEq: s => grip(s.hand) + cable([[s.hand[0],s.hand[1]],[112,29]]),
  seta:[[152,72],[172,96],[156,124]] },

{ id:'ex-triceps-testa-alta', title:'Tríceps acima da cabeça', names:['Tríceps acima da cabeça'],
  eq: CHAO,
  ini:{hip:[96,94], torso:-88, head:-90, femur:88, shin:91, arm:-74, fore:150},
  fim:{hip:[96,94], torso:-88, head:-90, femur:88, shin:91, arm:-74, fore:-78},
  iniEq: s => db(s.hand,0), fimEq: s => db(s.hand,0),
  seta:[[148,54],[170,40],[172,16]] },

/* ================= CORE ================= */
{ id:'ex-ab-wheel', title:'Ab wheel', names:['Ab wheel'],
  eq: CHAO,
  ini:{hip:[104,124], torso:-58, head:-54, femur:150, shin:20, arm:28, fore:44},
  fim:{hip:[100,146], torso:-14, head:-10, femur:174, shin:8, arm:6, fore:10},
  iniEq: s => wheel(s.hand), fimEq: s => wheel(s.hand),
  seta:[[82,60],[124,48],[160,72]] },

{ id:'ex-abdominal-polia', title:'Abdominal na polia', names:['Abdominal na polia'],
  eq: ln([40,14],[160,14]) + circ([120,22],7) + CHAO,
  ini:{hip:[86,130], torso:-84, head:-88, femur:158, shin:14, arm:-42, fore:-118},
  fim:{hip:[86,130], torso:-38, head:-30, femur:158, shin:14, arm:-14, fore:-128},
  iniEq: s => rope(s.headC,[120,29]), fimEq: s => rope(s.headC,[120,29]),
  seta:[[152,72],[168,100],[148,124]] }
,

/* ================= TROCAS PARA ESTIMULOS DISTINTOS ================= */
{ id:'ex-peck-deck', title:'Crucifixo na máquina (peck deck)', names:['Crucifixo na máquina (peck deck)'],
  eq: ln([48,128],[38,82]) + ln([48,128],[104,128]) + CHAO,
  ini:{hip:[66,126], torso:-88, head:-90, femur:4, shin:84, arm:165, fore:-90},
  fim:{hip:[66,126], torso:-88, head:-90, femur:4, shin:84, arm:5, fore:-90},
  iniEq: s => padArm([ (s.elbow[0]+s.hand[0])/2, (s.elbow[1]+s.hand[1])/2 ]) + ln([(s.elbow[0]+s.hand[0])/2, s.hand[1]+8],[(s.elbow[0]+s.hand[0])/2, 178]),
  fimEq: s => padArm([ (s.elbow[0]+s.hand[0])/2, (s.elbow[1]+s.hand[1])/2 ]) + ln([(s.elbow[0]+s.hand[0])/2, s.hand[1]+8],[(s.elbow[0]+s.hand[0])/2, 178]),
  seta:[[44,34],[80,14],[118,34]] },

{ id:'ex-mergulho', title:'Mergulho nas paralelas', names:['Mergulho nas paralelas'],
  eq: ln([56,110],[150,110]) + ln([64,110],[64,182]) + ln([142,110],[142,182]) + CHAO,
  ini:{hip:[98,100], torso:-90, head:-90, femur:80, shin:160, arm:90, fore:90, foot:200, drop:2},
  fim:{hip:[104,116], torso:-80, head:-78, femur:80, shin:160, arm:135, fore:62, foot:200, drop:2},
  seta:[[168,66],[178,92],[168,120]] },

{ id:'ex-hip-thrust', title:'Elevação pélvica (hip thrust)', names:['Elevação pélvica (hip thrust)'],
  eq: rct(18,112,44,40,3) + CHAO,
  ini:{hip:[92,147], torso:-135, head:-150, femur:-17, shin:102, arm:-100, fore:-40, foot:0, drop:4},
  fim:{hip:[105,118], torso:183, head:200, femur:29, shin:116, arm:-100, fore:-40, foot:0, drop:4},
  iniEq: s => bar([s.hip[0]+6, s.hip[1]-14],0,22), fimEq: s => bar([s.hip[0]+6, s.hip[1]-14],0,22),
  seta:[[166,156],[178,132],[166,106]] },

{ id:'ex-agacho-bulgaro', title:'Agachamento búlgaro', names:['Agachamento búlgaro'],
  eq: rct(16,150,42,10) + ln([24,160],[24,182]) + ln([50,160],[50,182]) + CHAO,
  ini:{hip:[96,90], torso:-86, head:-88, femur:80, shin:95, arm:92, fore:90,
       femur2:130, shin2:138, foot2:200, drop2:2},
  fim:{hip:[92,120], torso:-80, head:-84, femur:32, shin:134, arm:92, fore:90,
       femur2:109, shin2:196, foot2:200, drop2:2},
  iniEq: s => db(s.hand,0), fimEq: s => db(s.hand,0),
  seta:[[156,78],[172,104],[158,132]] },

{ id:'ex-triceps-testa', title:'Tríceps testa com barra', names:['Tríceps testa com barra'],
  face:[0,-1],
  eq: ln([30,137],[152,137]) + ln([44,137],[44,182]) + ln([138,137],[138,182]) + CHAO,
  ini:{hip:[110,126], torso:180, head:180, femur:0, shin:90, arm:-90, fore:200, foot:90, drop:0},
  fim:{hip:[110,126], torso:180, head:180, femur:0, shin:90, arm:-90, fore:-90, foot:90, drop:0},
  iniEq: s => bar(s.hand,0,16), fimEq: s => bar(s.hand,0,16),
  seta:[[26,66],[42,44],[74,50]] },

{ id:'ex-triceps-coice', title:'Tríceps coice na polia', names:['Tríceps coice na polia'],
  eq: ln([176,60],[176,182]) + circ([172,150],7) + CHAO,
  ini:{hip:[88,94], torso:-40, head:-36, femur:92, shin:88, arm:150, fore:90},
  fim:{hip:[88,94], torso:-40, head:-36, femur:92, shin:88, arm:150, fore:170},
  iniEq: s => cable([[s.hand[0],s.hand[1]],[168,148]]) + grip(s.hand),
  fimEq: s => cable([[s.hand[0],s.hand[1]],[168,148]]) + grip(s.hand),
  seta:[[104,124],[80,130],[60,104]] }
,

/* ================= SUBSTITUTOS ================= */
{ id:'ex-hiperextensao', title:'Hiperextensão no banco 45°', names:['Hiperextensão no banco 45°'],
  face:[1,1],
  eq: ln([106,114],[46,174]) + ln([112,120],[52,180]) + ln([76,146],[76,180]) +
      pad([36.6,163.4],135) + CHAO,
  ini:{hip:[96,104], torso:85, head:80, femur:135, shin:135, arm:10, fore:170},
  fim:{hip:[96,104], torso:-45, head:-40, femur:135, shin:135, arm:20, fore:160},
  seta:[[152,158],[178,130],[168,92]] },

{ id:'ex-afundo', title:'Afundo com halteres', names:['Afundo com halteres'],
  eq: CHAO,
  ini:{hip:[96,92], torso:-86, head:-88, femur:72, shin:100, arm:92, fore:90,
       femur2:118, shin2:110, foot2:20, drop2:4},
  fim:{hip:[94,116], torso:-84, head:-86, femur:28, shin:98, arm:92, fore:90,
       femur2:106, shin2:150, foot2:28, drop2:3},
  iniEq: s => db(s.hand,0), fimEq: s => db(s.hand,0),
  seta:[[156,80],[172,106],[158,134]] }
,

/* ================= GLUTEOS (programa feminino) ================= */
{ id:'ex-abdutora', title:'Cadeira abdutora', names:['Cadeira abdutora'],
  front:true,
  eq: rct(82,34,36,62,6) + rct(74,98,52,11,4) + ln([84,109],[84,178]) + ln([116,109],[116,178]) + CHAO,
  ini:{hip:[100,92], torso:-90, head:-90, femur:97, shin:95, arm:152, fore:112,
       femur2:83, shin2:85, arm2:28, fore2:68},
  fim:{hip:[100,92], torso:-90, head:-90, femur:122, shin:100, arm:152, fore:112,
       femur2:58, shin2:80, arm2:28, fore2:68},
  iniEq: s => padArm(s.knee) + padArm(s.knee2),
  fimEq: s => padArm(s.knee) + padArm(s.knee2),
  seta:[[130,126],[158,116],[184,130]] },

{ id:'ex-gluteo-coice', title:'Coice na polia (extensão de quadril)', names:['Coice na polia (extensão de quadril)'],
  face:-1,
  eq: ln([30,44],[30,180]) + circ([170,162],7) + ln([178,146],[178,180]) + CHAO,
  ini:{hip:[88,96], torso:-100, head:-104, femur:85, shin:90, arm:190, fore:170,
       femur2:92, shin2:90},
  fim:{hip:[88,96], torso:-104, head:-108, femur:50, shin:45, arm:190, fore:170,
       femur2:92, shin2:90},
  iniEq: s => grip(s.ankle) + cable([[s.ankle[0],s.ankle[1]],[166,162]]),
  fimEq: s => grip(s.ankle) + cable([[s.ankle[0],s.ankle[1]],[166,162]]),
  seta:[[112,180],[148,178],[158,142]] }

];

/* ---------- pecas de equipamento reutilizadas ---------- */
function pad(p, a) {            // rolo / almofada perpendicular ao segmento
  return `<g transform="translate(${F.n(p[0])} ${F.n(p[1])}) rotate(${F.n(a)})"><rect x="-6" y="-15" width="12" height="30" rx="5"/></g>`;
}
function padArm(p) { return `<g transform="translate(${F.n(p[0])} ${F.n(p[1])})"><rect x="-8" y="-12" width="16" height="24" rx="5"/></g>`; }
function plate(p, a) {          // plataforma de pe do leg press
  return `<g transform="translate(${F.n(p[0])} ${F.n(p[1])}) rotate(${F.n(a)})"><rect x="-5" y="-19" width="10" height="38" rx="3"/></g>`;
}
function grip(p) { return `<g transform="translate(${F.n(p[0])} ${F.n(p[1])})"><rect x="-4" y="-11" width="8" height="22" rx="4"/></g>`; }
function triHandle(p) {         // pegada triangulo / neutra
  return `<path d="M${F.n(p[0]-2)} ${F.n(p[1]-11)}L${F.n(p[0]+12)} ${F.n(p[1])}L${F.n(p[0]-2)} ${F.n(p[1]+11)}Z"/>`;
}
function rope(p, anchor) {      // corda: duas pontas
  return cable([[p[0], p[1] - 8], anchor])
    + `<path d="M${F.n(p[0]-10)} ${F.n(p[1]+9)}L${F.n(p[0])} ${F.n(p[1]-8)}L${F.n(p[0]+10)} ${F.n(p[1]+9)}"/>`;
}
function wheel(p) { return circ(p, 13) + circ(p, 3); }

module.exports = EX;
