/* Fumaça do mockup: roda pintar() em TODO estado alcançável.
   node --check só vê sintaxe; erro de referência só aparece rodando. */
var alvos = {}, cliques = [];
function noh(id){ return { id:id, innerHTML:"", textContent:"", hidden:false,
  querySelector:function(){return null;}, closest:function(){return null;},
  setAttribute:function(){}, getAttribute:function(){return null;} }; }
global.document = { getElementById:function(id){ return alvos[id]||(alvos[id]=noh(id)); },
  addEventListener:function(t,f){ if(t==="click") cliques.push(f); },
  querySelector:function(){return null;} };
;(function () {
  "use strict";

  /* ══ 1. O QUE O BARRAMENTO ENTREGOU — medido em 24/08/2026 ═══════════ */
  var APARELHOS = [
    { id: "bt-a",    tipo: "Bluetooth", nome: "TP-Link UB500",    sementeDoCaminho: "3-1.2",   cor: "#bd93f9", classe: "bt",      usb: 2, mA: 500 },
    { id: "bt-b",    tipo: "Bluetooth", nome: "TP-Link UB500",    sementeDoCaminho: "3-1.1.4", cor: "#bd93f9", classe: "bt",      usb: 2, mA: 500 },
    { id: "bt-c",    tipo: "Bluetooth", nome: "TP-Link UB500",    sementeDoCaminho: "3-3",     cor: "#bd93f9", classe: "bt",      usb: 2, mA: 500 },
    { id: "wifi",    tipo: "Wi-Fi",     nome: "Archer T3U",       sementeDoCaminho: "4-1.1.2", cor: "#ff5555", classe: "wifi",    usb: 3, mA: 504 },
    { id: "webcam",  tipo: "Webcam",    nome: "Logitech C920",    sementeDoCaminho: "3-4",     cor: "#8be9fd", classe: "webcam",  usb: 2, mA: 500 },
    { id: "teclado", tipo: "Teclado",   nome: "Receptor 2,4 GHz", sementeDoCaminho: "3-1.4",   cor: "#ffb86c", classe: "teclado", usb: 2, mA: 100 },
    { id: "mouse",   tipo: "Mouse",     nome: "Receptor 2,4 GHz", sementeDoCaminho: "1-3",     cor: "#f1fa8c", classe: "mouse",   usb: 2, mA:  98 },
    { id: "hub",     tipo: "Hub",       nome: "TP-Link UH700",    sementeDoCaminho: "3-1",     cor: "#6272a4", classe: "hub",     usb: 3, mA: 100 }
  ];

  /* ══ 2. AS FACES — declaradas por ela, na foto numerada ══════════════ */
  var FACES = [
    { nome: "Frente do gabinete", forma: "coluna", perto: true, regiao: "pc",
      portas: [ { n: "1", usb: 2, onde: "pc", par: "2" }, { n: "2", usb: 2, onde: "pc", par: "1" } ] },
    { nome: "Traseira", forma: "grade-tras", regiao: "pc", donaDaFaixaPc: true,
      portas: [ { n: "3", usb: 3, onde: "pc", par: "4" }, { n: "4", usb: 3, onde: "pc", par: "3" },
                { n: "5", usb: 3, onde: "pc", par: "6" }, { n: "6", usb: 3, onde: "pc", par: "5" },
                { n: "7", usb: 2, onde: "pc", par: "8" }, { n: "8", usb: 2, onde: "pc", par: "7" } ] },
    { nome: "Hub, no alto do rack", forma: "fileira", alto: true, regiao: "hub",
      portas: [ { n: "9",  usb: 3, onde: "hub", pos: 1, par: "10" }, { n: "10", usb: 3, onde: "hub", pos: 2, par: "9"  },
                { n: "11", usb: 3, onde: "hub", pos: 3, par: "12" }, { n: "12", usb: 3, onde: "hub", pos: 4, par: "11" },
                { n: "13", usb: 3, onde: "hub", pos: 5, par: "14" }, { n: "14", usb: 3, onde: "hub", pos: 6, par: "13" },
                { n: "15", usb: 3, onde: "hub", pos: 7,
                  filho: { n: "15a", usb: 3, onde: "hub", pos: 9, esticada: true,
                           cabo: "extensor de 1 m, declarado por você" } } ] }
  ];

  /* ══ 2.1 O MAPA DECLARADO: entrada -> caminho de barramento ══════════
     Esta é a virada de modelo que faz a re-identificação existir. O mapa NÃO
     guarda "entrada 9 tem um Bluetooth" — guarda "entrada 9 é o caminho
     3-1.2". Qual aparelho está lá é DERIVADO da leitura de agora, pelo
     caminho. Assim, quando ela troca um aparelho de lugar, o caminho dele
     muda, o mapa continua valendo, e o produto reconhece sozinho quem foi
     para onde — sem ela declarar nada de novo.                             */
  var MAPA = {
    "1": "1-3", "4": "3-1", "5": "3-3", "6": "3-4",
    "9": "3-1.2", "11": "4-1.1.2", "13": "3-1.4", "15a": "3-1.1.4"
  };

  /* ══ 2.2 AS DUAS LEITURAS, medidas na MeowSystem em 24/08/2026 ═══════
     A de 20h15 e a de 22h50, depois de ela fazer os movimentos. São dado
     real: é a mesma comparação que o produto faria com duas leituras de
     sysfs separadas por um "Reexaminar".                                   */
  var LEITURAS = {
    antes: { rotulo: "20h15 — antes de você mexer",
      caminho: { "mouse": "1-3", "hub": "3-1", "bt-c": "3-3", "webcam": "3-4",
                 "bt-a": "3-1.2", "wifi": "4-1.1.2", "teclado": "3-1.4", "bt-b": "3-1.1.4" } },
    agora: { rotulo: "22h50 — depois dos seus movimentos",
      caminho: { "teclado": "1-3", "webcam": "1-4", "mouse": "1-6", "hub": "3-1",
                 "bt-c": "3-1.1.1", "bt-b": "3-1.1.4", "bt-a": "3-1.2", "wifi": "4-2" } }
  };

  /* O MAPA MOSTRA SEMPRE A MESA DE AGORA.
     A primeira versão abria na leitura antiga para dar o "antes e depois", e
     ela abriu a página horas depois de mexer nos cabos e viu o Wi-Fi no hub,
     de onde ela mesma o tinha tirado. Estado velho como padrão é o defeito
     F7 desta casa: a tela afirma com confiança uma coisa que não é mais
     verdade. O "antes" é o termo de COMPARAÇÃO do reexame, nunca o estado. */
  var leituraAtual = "agora";
  var leituraAnterior = "antes";
  var MAPA_ORIGINAL = null;
  function leitura() { return LEITURAS[leituraAtual].caminho; }

  /* entrada -> id do aparelho, DERIVADO: junta o mapa com a leitura */
  function alocacaoDerivada() {
    var out = {}, cam = leitura();
    Object.keys(MAPA).forEach(function (porta) {
      for (var id in cam) if (cam[id] === MAPA[porta]) { out[porta] = id; return; }
    });
    return out;
  }

  /* ══ 2.3 A REGIÃO, DEDUZIDA DO BARRAMENTO ════════════════════════════
     O produto não sabe em qual ENTRADA um aparelho novo está — mas sabe se
     ele pende do hub ou está direto no gabinete, porque o caminho de
     barramento conta a topologia. Isso reduz o palpite de dezesseis entradas
     para sete ou oito, e é DEDUÇÃO, não chute: `3-1.1.1` pende de `3-1`, que
     é o hub. Esconder o aparelho por não saber a entrada exata é jogar fora
     a metade da informação que existe.

     O lado USB 3.0 do mesmo hub físico aparece noutro barramento (`4-1.x`
     contra `3-1.x`) porque hub 3.0 é dual-bus — mesmo metal, dois números.  */
  function regiaoDoCaminho(c) {
    var h = leitura()["hub"];
    if (!h || !c) return null;
    if (c.indexOf(h + ".") === 0) return "hub";
    var mh = h.match(/^(\d+)-(.+)$/), mc = c.match(/^(\d+)-(.+)$/);
    if (mh && mc && mc[1] !== mh[1] && mc[2].indexOf(mh[2] + ".") === 0) return "hub";
    return "pc";
  }

  /* aparelhos que a leitura vê e o mapa não sabe onde estão */
  function semEntrada() {
    var cam = leitura(), conhecidos = {};
    Object.keys(MAPA).forEach(function (p) { conhecidos[MAPA[p]] = p; });
    return APARELHOS.filter(function (a) {
      var c = cam[a.id];
      return c && !conhecidos[c];
    }).map(function (a) {
      var c = cam[a.id];
      return { ap: a, caminho: c, regiao: regiaoDoCaminho(c) };
    });
  }
  /* as entradas candidatas de uma região, ainda livres */
  function candidatas(regiao) {
    var usadas = {};
    Object.keys(MAPA).forEach(function (n) { usadas[n] = true; });
    return todasPortas().filter(function (p) {
      if (usadas[p.n]) return false;
      return regiao === "hub" ? p.onde === "hub" : p.onde === "pc";
    });
  }

  var NA_MAO = [
    { id: "bt", rotulo: "Dongle Bluetooth", cor: "#bd93f9" },
    { id: "wifi", rotulo: "Adaptador Wi-Fi", cor: "#ff5555" },
    { id: "teclado", rotulo: "Receptor do teclado", cor: "#ffb86c" },
    { id: "mouse", rotulo: "Receptor do mouse", cor: "#f1fa8c" },
    { id: "webcam", rotulo: "Webcam", cor: "#8be9fd" }
  ];

  var LICOES = {
    bt: { texto: "É este que carrega os seus controles. Duas coisas o atrapalham, e as duas são de <b>lugar</b>: "
        + "tráfego de USB 3.0 num vizinho próximo, e outro rádio de 2,4 GHz colado nele. Um terceiro fator não "
        + "é lugar, é conta — <b>cada adaptador tem 1600 vezes de falar por segundo</b>, e todo controle ligado "
        + "nele divide isso.",
      conta: { titulo: "A conta de um adaptador", linhas: [
        "1 controle com mic ....  277 / 1600", "2 controles com mic ...  554 / 1600",
        "4 controles com mic ... 1108 / 1600", "5 controles com mic ... 1385 / 1600"] } },
    wifi: { texto: "Ele quer uma <b>entrada USB 3.0</b> para ter velocidade — e é o tráfego dele em 3.0 que vira "
        + "ruído para os dongles Bluetooth por perto. O bom lugar é uma entrada azul <b>direta do PC</b>, longe de "
        + "onde as antenas de rádio moram.", conta: null },
    teclado: { texto: "O teclado tem uma exigência que não é de rádio: precisa estar numa <b>entrada direta do "
        + "PC</b>. Hub externo nem sempre é ligado pelo firmware, e sem teclado você não entra na BIOS nem nas "
        + "telas de recuperação.", conta: null },
    mouse: { texto: "É um rádio de 2,4 GHz pequeno. Não precisa de entrada azul e não gosta de estar colado noutro "
        + "rádio — dois receptores encostados se atrapalham.", conta: null },
    webcam: { texto: "Não emite rádio, mas <b>come banda e energia</b>: 500&nbsp;mA e vídeo contínuo. Não precisa "
        + "de entrada azul, e ocupá-la tira uma entrada de quem precisa.", conta: null }
  };

  MAPA_ORIGINAL = Object.assign({}, MAPA);
  var alocacao = alocacaoDerivada();
  var modo = "mesa";       /* mesa | ideal | mao */
  var naMao = null;
  var segurando = null;

  function acha(id) { for (var i = 0; i < APARELHOS.length; i++) if (APARELHOS[i].id === id) return APARELHOS[i]; return null; }
  function portaDeEm(mapa, id) { for (var k in mapa) if (mapa[k] === id) return k; return null; }
  /* SEMPRE derivado da leitura viva. A versão que lia um `alocacao` cacheado
     dava resposta VELHA depois de um reexame — o dongle que ela moveu ainda
     era relatado na entrada antiga. Cache de estado derivado é a fonte do
     defeito, não a otimização. */
  function portaDe(id) { return portaDeEm(alocacaoDerivada(), id); }
  function todasPortas() { var r = []; FACES.forEach(function (f) { f.portas.forEach(function (p) { r.push(p); if (p.filho) r.push(p.filho); }); }); return r; }
  function porNum(n) { var t = todasPortas(); for (var i = 0; i < t.length; i++) if (t[i].n === String(n)) return t[i]; return null; }
  /* DONO ÚNICO de "qual o caminho deste aparelho AGORA".
     A bandeja lia `a.caminho` — o campo gravado na constante — enquanto a
     faixa lia a leitura viva. Duas verdades na mesma tela sobre a mesma
     coisa: depois de um reexame a bandeja publicava o caminho de ANTES.
     O campo da constante vira só semente da primeira leitura.              */
  function caminhoDe(id) { return leitura()[id] || null; }

  function classeDe(id) { var a = acha(id); return a ? a.classe : null; }
  function ehRadio(c) { return c === "bt" || c === "wifi" || c === "teclado" || c === "mouse"; }

  /* Um dongle na entrada-filha ocupa também a entrada-mãe (o extensor está nela). */
  function maeDe(n) { var t = todasPortas(); for (var i = 0; i < t.length; i++) if (t[i].filho && t[i].filho.n === String(n)) return t[i]; return null; }
  function ocupada(mapa, p) {
    if (mapa[p.n]) return true;
    if (p.filho && mapa[p.filho.n]) return true;          /* a mãe some quando o filho é usado */
    var m = maeDe(p.n); if (m && mapa[m.n]) return true;  /* o filho some quando a mãe é usada */
    return false;
  }

  /* ══ 3. O CÁLCULO — o melhor arranjo, e por quê ══════════════════════
     Cada porta ganha uma NOTA para cada aparelho, e o aparelho vai para a
     porta de maior nota. Duas regras salvam a credibilidade do conselho:

       · ficar parado vale um ponto de bônus — entre portas equivalentes,
         a que já está ocupada vence, e o produto não manda mexer à toa;
       · só vira MOVIMENTO se a porta nova tiver nota MAIOR que a de hoje.

     Não é otimizador global: é nota explicável, porque conselho que a
     pessoa não entende ela não segue.                                    */
  var REGRAS = {
    teclado: [
      { n: 100, quando: function (p) { return p.onde === "pc"; }, peso: "essencial", selo: "espec",
        txt: "entrada direta do PC: hub externo nem sempre é ligado pelo firmware, e sem teclado você não entra na BIOS" },
      { n: 20, quando: function (p, ctx) { return ctx.perto; }, selo: "derivado",
        txt: "na frente, que é a mais perto de você" },
      { n: -30, quando: function (p, ctx) { return ctx.vizinhoRadio; }, peso: "essencial", selo: "espec",
        txt: "longe de outro rádio de 2,4 GHz — dois receptores encostados se atrapalham" },
      { n: -6, quando: function (p) { return p.usb === 3; }, selo: "derivado",
        txt: "sem gastar uma entrada azul, que ele não usa" }
    ],
    wifi: [
      { n: 100, quando: function (p) { return p.onde === "pc"; }, peso: "essencial", selo: "espec",
        txt: "fora do hub: o tráfego dele em 5 Gbps é o que vira ruído em 2,4 GHz para os dongles do mesmo hub" },
      { n: 40, quando: function (p) { return p.usb === 3; }, selo: "derivado",
        txt: "entrada azul, para ele manter a velocidade" },
      { n: -30, quando: function (p, ctx) { return ctx.vizinhoRadio; }, peso: "essencial", selo: "espec",
        txt: "sem outro rádio colado" }
    ],
    bt: [
      { n: 60, quando: function (p) { return p.onde === "hub"; }, selo: "derivado",
        txt: "no alto do rack, com a antena acima da linha das cabeças" },
      { n: 25, quando: function (p) { return !!p.esticada; }, selo: "derivado",
        txt: "na ponta do extensor: a antena que fica mais longe das outras" },
      { n: -120, quando: function (p, ctx) { return p.onde === "hub" && ctx.superspeedNoHub; }, peso: "essencial", selo: "espec",
        txt: "sem o Wi-Fi usando o SuperSpeed do mesmo hub" },
      { n: -45, quando: function (p, ctx) { return ctx.vizinhoRadio; }, peso: "essencial", selo: "espec",
        txt: "sem outro rádio de 2,4 GHz na entrada colada" }
    ],
    mouse: [
      { n: 40, quando: function (p) { return p.onde === "pc"; }, selo: "derivado",
        txt: "entrada direta do PC" },
      { n: -40, quando: function (p, ctx) { return ctx.vizinhoRadio; }, peso: "essencial", selo: "espec",
        txt: "longe do receptor do teclado — dois rádios de 2,4 GHz encostados se atrapalham" },
      { n: 10, quando: function (p) { return p.usb === 2; }, selo: "derivado",
        txt: "entrada preta, sem gastar a azul que ele não usa" }
    ],
    webcam: [
      { n: 12, quando: function (p) { return p.usb === 2; }, selo: "derivado",
        txt: "entrada preta: ela não usa a velocidade da azul, e a azul faz falta a quem usa" },
      { n: 6, quando: function (p) { return p.onde === "pc"; }, selo: "derivado",
        txt: "direta do PC, sem gastar entrada do hub" }
    ],
    hub: [
      { n: 40, quando: function (p) { return p.onde === "pc"; }, peso: "essencial", selo: "derivado",
        txt: "entrada direta do PC — o hub não pode pendurar em si mesmo" },
      { n: 20, quando: function (p) { return p.usb === 3; }, selo: "derivado",
        txt: "entrada azul, para o hub entregar o que ele oferece" }
    ]
  };

  /* separação entre dongles: quanto mais longe do irmão mais próximo, melhor */
  function bonusSeparacao(p, jaPostos) {
    if (!jaPostos.length || p.pos === undefined) return { n: 0 };
    var d = Math.min.apply(null, jaPostos.map(function (q) { return Math.abs((q.pos || 0) - p.pos); }));
    return { n: Math.min(d, 6) * 6, selo: "espec",
             txt: "com " + d + " posiç" + (d === 1 ? "ão" : "ões") + " de folga até o dongle mais próximo — dois rádios colados se atrapalham" };
  }

  function notaDe(ap, porta, plano, jaPostos) {
    var face = FACES.filter(function (f) { return f.portas.some(function (x) { return x.n === porta.n || (x.filho && x.filho.n === porta.n); }); })[0] || {};
    var vz = porta.par ? classeDe(plano[porta.par] || alocacao[porta.par]) : null;
    var ctx = { perto: !!face.perto, vizinhoRadio: !!(vz && ehRadio(vz)),
                superspeedNoHub: (function () { var w = portaDeEm(plano, "wifi") || portaDe("wifi"); var pw = w && porNum(w); return !!(pw && pw.onde === "hub"); })() };
    var n = 0, razoes = [], peso = "melhora";
    (REGRAS[ap.classe] || []).forEach(function (r) {
      if (!r.quando(porta, ctx)) return;
      n += r.n;
      if (r.n > 0) razoes.push({ selo: r.selo, txt: r.txt });
      if (r.peso === "essencial" && r.n > 0) peso = "essencial";
    });
    /* penalidades que não casaram viram exigências satisfeitas: também explicam */
    (REGRAS[ap.classe] || []).forEach(function (r) {
      if (r.n >= 0 || r.quando(porta, ctx)) return;
      razoes.push({ selo: r.selo, txt: r.txt });
      if (r.peso === "essencial") peso = "essencial";
    });
    if (ap.classe === "bt") {
      var b = bonusSeparacao(porta, jaPostos);
      n += b.n; if (b.n > 0) razoes.push({ selo: b.selo, txt: b.txt });
    }
    return { n: n, razoes: razoes, peso: peso };
  }

  function planejar(op) {
    op = op || {};
    var bonusParado = op.bonusParado === undefined ? 1 : op.bonusParado;
    var proibida = op.proibir || function () { return false; };
    alocacao = alocacaoDerivada();   /* nunca planejar sobre leitura velha */
    var plano = {}, motivo = {};
    var portas = todasPortas().filter(function (p) { return !proibida(p); });
    /* ordem de decisão: quem tem exigência dura escolhe antes */
    var ordem = ["hub", "teclado", "wifi", "bt", "mouse", "webcam"];
    var jaPostos = [];

    ordem.forEach(function (cl) {
      APARELHOS.filter(function (a) { return a.classe === cl; }).forEach(function (ap) {
        var cands = portas.filter(function (p) { return !ocupada(plano, p); });
        if (!cands.length) return;
        var atual = portaDe(ap.id);
        var melhor = null, melhorNota = null;
        cands.forEach(function (p) {
          var nota = notaDe(ap, p, plano, jaPostos);
          /* bônus de ficar parado: só desempata, nunca troca uma escolha melhor */
          var efetiva = nota.n + (p.n === atual ? bonusParado : 0);
          if (melhor === null || efetiva > melhorNota.efetiva) { melhor = p; melhorNota = { nota: nota, efetiva: efetiva }; }
        });
        if (!melhor) return;
        plano[melhor.n] = ap.id;
        /* Se a porta de hoje foi tomada por outro aparelho no plano, o
           movimento é FORCADO — nao ha "ficar onde esta" para comparar, e
           esconde-lo faria o mapa e a receita discordarem na tela. */
        var tomada = atual && plano[atual] && plano[atual] !== ap.id;
        var notaAtual = (atual && !tomada) ? notaDe(ap, porNum(atual), plano, jaPostos).n : -Infinity;
        var razoes = melhorNota.nota.razoes.slice();
        if (tomada) razoes.unshift({ selo: "derivado",
          txt: "a entrada " + atual + " passou a ser do " + (acha(plano[atual]) || {}).tipo + ", entao este precisa de outro lugar" });
        motivo[ap.id] = {
          razoes: razoes,
          peso: melhorNota.nota.peso,
          ganho: tomada ? Infinity : (melhorNota.nota.n - notaAtual),
          forcado: !!tomada,
          essencial: !!tomada || (melhorNota.nota.peso === "essencial" && (melhorNota.nota.n - notaAtual) >= 30)
        };
        if (ap.classe === "bt") jaPostos.push(melhor);
      });
    });

    /* Passe final: aparelhos INTERCAMBIÁVEIS (mesma classe e mesmo modelo)
       não têm por que trocar de lugar entre si. Se um deles já está numa
       das portas de destino, ele fica nela — o conjunto de portas é o mesmo,
       e cada troca evitada é um movimento a menos que ela precisa fazer.
       Sem isto o plano mandava mover dois UB500 idênticos entre a 9 e a 15a. */
    var porModelo = {};
    APARELHOS.forEach(function (a) {
      var k = a.classe + "|" + a.nome;
      (porModelo[k] = porModelo[k] || []).push(a);
    });
    Object.keys(porModelo).forEach(function (k) {
      var grupo = porModelo[k];
      if (grupo.length < 2) return;
      var destinos = grupo.map(function (a) { return portaDeEm(plano, a.id); }).filter(Boolean);
      if (destinos.length < 2) return;
      var novo = {}, sobram = destinos.slice(), pendentes = [];
      grupo.forEach(function (a) {
        var hoje = portaDe(a.id), i = sobram.indexOf(hoje);
        if (hoje && i !== -1) { novo[a.id] = hoje; sobram.splice(i, 1); }
        else pendentes.push(a);
      });
      pendentes.forEach(function (a) { novo[a.id] = sobram.shift(); });
      destinos.forEach(function (d) { delete plano[d]; });
      grupo.forEach(function (a) { if (novo[a.id]) plano[novo[a.id]] = a.id; });
      /* o motivo acompanha a porta, não o aparelho: recalcula para quem mudou */
      grupo.forEach(function (a) {
        var p = novo[a.id]; if (!p) return;
        var atual = portaDe(a.id);
        var n = notaDe(a, porNum(p), plano, jaPostos.filter(function (q) { return q.n !== p; }));
        var tomada2 = atual && plano[atual] && plano[atual] !== a.id;
        var na = (atual && !tomada2) ? notaDe(a, porNum(atual), plano, []).n : -Infinity;
        var rz = n.razoes.slice();
        if (tomada2) rz.unshift({ selo: "derivado",
          txt: "a entrada " + atual + " passou a ser do " + (acha(plano[atual]) || {}).tipo + ", entao este precisa de outro lugar" });
        motivo[a.id] = { razoes: rz, peso: n.peso, ganho: tomada2 ? Infinity : (n.n - na), forcado: !!tomada2,
                         essencial: !!tomada2 || (n.peso === "essencial" && (n.n - na) >= 30) };
      });
    });

    return { plano: plano, motivo: motivo };
  }

  /* ══ 4. A RECEITA: a diferença entre o que está e o que devia ════════
     Só entra aqui o que MELHORA. Aparelho que já está numa porta tão boa
     quanto a melhor candidata fica onde está, e não vira movimento.      */
  function receita(op) {
    var r = planejar(op), movs = [];
    APARELHOS.forEach(function (a) {
      var de = portaDe(a.id), para = portaDeEm(r.plano, a.id);
      if (!para || de === para) return;
      var m = r.motivo[a.id] || { razoes: [], essencial: false, ganho: 0 };
      if (de && m.ganho <= 0) return;           /* não manda mexer à toa */

      var linhas = [];
      if (de) {
        var pd = porNum(de);
        if (pd && pd.onde === "hub" && a.classe === "wifi")
          linhas.push({ s: "medido", t: "Hoje ele está no hub, e os dois chips do hub enumeram a <b>5000M</b> (<code>4-1</code>, <code>4-1.1</code>): o enlace SuperSpeed fica treinado, e é o <b>tráfego</b> dele que irradia." });
        else if (pd && pd.onde === "hub" && a.classe === "teclado")
          linhas.push({ s: "medido", t: "Hoje ele está pendurado no hub (<code>" + caminhoDe(a.id) + "</code>)." });
        else
          linhas.push({ s: "medido", t: "Hoje ele está na entrada <b>" + de + "</b> (<code>" + caminhoDe(a.id) + "</code>)." });
      } else {
        linhas.push({ s: "medido", t: "Ele apareceu no barramento (<code>" + caminhoDe(a.id) + "</code>) e ainda não tem lugar no mapa." });
      }
      m.razoes.slice(0, 3).forEach(function (z) {
        linhas.push({ s: z.selo, t: z.txt.charAt(0).toUpperCase() + z.txt.slice(1) + "." });
      });
      movs.push({
        essencial: !!m.essencial, ganho: m.ganho,
        titulo: (function (r) { return de ? "Mova " + r.g + " " + r.n + " da entrada " + de + " para a " + para
                                     : "Ponha " + r.g + " " + r.n + " na entrada " + para; })(rot(a))
                + (m.essencial ? "" : "  ·  melhora, não é urgente"),
        linhas: linhas
      });
    });
    /* os essenciais primeiro, e dentro deles o de maior ganho */
    movs.sort(function (x, y) {
      if (x.essencial !== y.essencial) return x.essencial ? -1 : 1;
      if (x.ganho === y.ganho) return 0;
      return y.ganho > x.ganho ? 1 : -1;
    });
    if (movs.length) {
      movs.push({
        titulo: "O que muda quando você terminar", semNumero: true,
        linhas: [
          { s: "derivado", t: "Os dongles ficam no alto e separados, com o Wi-Fi fora do hub deles." },
          { s: "derivado", t: "<b>Quanto isso melhora o seu Bluetooth não foi medido nesta máquina.</b> É o próximo ensaio da bancada: <code>taxa_no_hidraw.py --verificar-crc</code> antes e depois." }
        ]
      });
    }
    return movs;
  }
  function rot(a) {
    if (a.classe === "bt") return { g: "o", n: "dongle Bluetooth" };
    if (a.classe === "hub") return { g: "o", n: "cabo do hub" };
    if (a.classe === "webcam") return { g: "a", n: "webcam" };
    return { g: "o", n: a.tipo.toLowerCase() };
  }

  /* ══ 5. O julgamento por porta, no modo "estou segurando" ════════════ */
  function superspeedNoHub() {
    var p = portaDe("wifi"); var pp = p && porNum(p);
    return !!(pp && pp.onde === "hub");
  }
  function julgar(porta) {
    var oc = alocacao[porta.n];
    if (oc) { var a = acha(oc); return { v: "cheia", txt: "ocupada", porque: a.tipo + " — clique para tirar" }; }
    if (ocupada(alocacao, porta)) return { v: "cheia", txt: "indisponível", porque: porta.filho ? "o extensor está nela" : "a entrada-mãe está em uso" };
    if (segurando) {
      var reg = regiaoDoCaminho(leitura()[segurando]);
      var mesmaRegiao = reg === null || (reg === "hub" ? porta.onde === "hub" : porta.onde === "pc");
      if (!mesmaRegiao) return { v: "fora", txt: "outra região",
        porque: reg === "hub" ? "este está no hub" : "este está direto no PC" };
    }
    if (!naMao) return null;

    var noHub = porta.onde === "hub";
    var vz = porta.par ? acha(alocacao[porta.par]) : null;
    var vzRadio = vz && ehRadio(vz.classe);

    if (naMao === "bt") {
      if (noHub && superspeedNoHub()) return { v: "ruim", txt: "evite", porque: "o Wi-Fi usa o SuperSpeed deste mesmo hub, e esse tráfego vira ruído em 2,4 GHz" };
      if (vzRadio) return { v: "evite", txt: "vale evitar", porque: "colada no " + vz.tipo + ", na entrada " + porta.par };
      if (porta.esticada) return { v: "melhor", txt: "melhor lugar", porque: "na ponta do extensor: a antena mais longe das outras" };
      if (noHub) return { v: "melhor", txt: "melhor lugar", porque: "no alto do rack, com a antena acima das cabeças" };
      return { v: "serve", txt: "serve", porque: "entrada direta, mas na altura da mesa" };
    }
    if (naMao === "wifi") {
      if (noHub) return { v: "ruim", txt: "evite", porque: "aqui o tráfego dele em 5 Gbps fica ao lado dos dongles do controle" };
      if (porta.usb !== 3) return { v: "evite", txt: "vale evitar", porque: "entrada preta — o Wi-Fi perde velocidade" };
      if (vzRadio) return { v: "evite", txt: "vale evitar", porque: "colada no " + vz.tipo + ", na entrada " + porta.par };
      return { v: "melhor", txt: "melhor lugar", porque: "azul, direta do PC e longe das antenas de rádio" };
    }
    if (naMao === "teclado") {
      if (noHub) return { v: "ruim", txt: "evite", porque: "no hub você pode ficar sem teclado na BIOS" };
      if (vzRadio) return { v: "evite", txt: "vale evitar", porque: "colada no " + vz.tipo + ", na entrada " + porta.par };
      return { v: "melhor", txt: "melhor lugar", porque: "direta do PC — funciona na BIOS e na recuperação" };
    }
    if (naMao === "mouse") {
      if (vzRadio) return { v: "evite", txt: "vale evitar", porque: "colada no " + vz.tipo + ", na entrada " + porta.par };
      if (noHub && superspeedNoHub()) return { v: "evite", txt: "vale evitar", porque: "hub com o tráfego do Wi-Fi ao lado" };
      if (porta.usb === 3) return { v: "serve", txt: "serve", porque: "gasta uma entrada azul que ele não usa" };
      return { v: "melhor", txt: "melhor lugar", porque: "entrada preta, longe de outro rádio" };
    }
    if (naMao === "webcam") {
      if (porta.usb === 3) return { v: "serve", txt: "serve", porque: "gasta uma entrada azul que ela não precisa" };
      return { v: "melhor", txt: "melhor lugar", porque: "entrada preta, que é o que ela pede" };
    }
    return null;
  }

  /* ══ 4.1 AS VARIANTES ════════════════════════════════════════════════
     Um arranjo só não serve: o melhor no papel pode ser impossível na mesa
     — o cabo não alcança, o hub está longe, a entrada de trás é inacessível.
     Cada variante é a MESMA regra com uma restrição declarada, e a tela diz
     o que se perde em cada uma.                                            */
  var VARIANTES = [
    { id: "melhor", rotulo: "O melhor no papel", op: {},
      desc: "Sem restrição: o arranjo que a regra escolhe quando tudo é possível." },
    { id: "poucos", rotulo: "Mexendo o mínimo", op: { bonusParado: 45 },
      desc: "Aceita um lugar pior para você mexer em menos coisas. Bom quando desmontar a mesa custa caro." },
    { id: "sem-ext", rotulo: "Sem o extensor", op: { proibir: function (p) { return !!p.esticada; } },
      desc: "Para quando o cabo de extensão não alcança onde você queria, ou você não quer usá-lo." },
    { id: "so-pc", rotulo: "Sem usar o hub", op: { proibir: function (p) { return p.onde === "hub"; } },
      desc: "Só as entradas do gabinete. É o caso de quem não tem hub — e de notebook." }
  ];
  var variante = "melhor";
  function opDaVariante() {
    for (var i = 0; i < VARIANTES.length; i++) if (VARIANTES[i].id === variante) return VARIANTES[i].op;
    return {};
  }
  /* O QUE SE PERDE, em palavra. "437 pontos pior" não diz nada a ninguém;
     a pessoa precisa saber O QUÊ fica pior, para decidir se aceita.        */
  function consequencias(op) {
    var pl = planejar(op).plano, out = [];
    var bts = APARELHOS.filter(function (a) { return a.classe === "bt"; })
      .map(function (a) { return porNum(portaDeEm(pl, a.id)); }).filter(Boolean);
    var noAlto = bts.filter(function (p) { return p.onde === "hub"; }).length;
    if (bts.length && noAlto === 0) out.push("os dongles ficam na altura da mesa, não no alto do rack");
    else if (noAlto < bts.length) out.push((bts.length - noAlto) + " dongle(s) fora do alto");
    if (!bts.some(function (p) { return p.esticada; })) out.push("o extensor não é usado");
    var poss = bts.map(function (p) { return p.pos; }).filter(function (x) { return x !== undefined; }).sort(function (a, b) { return a - b; });
    var minVao = poss.length > 1 ? Math.min.apply(null, poss.slice(1).map(function (v, i) { return v - poss[i]; })) : null;
    if (minVao !== null && minVao <= 1) out.push("dois dongles ficam em entradas coladas");
    var colados = 0;
    APARELHOS.forEach(function (a) {
      if (!ehRadio(a.classe)) return;
      var p = porNum(portaDeEm(pl, a.id)); if (!p || !p.par) return;
      var viz = pl[p.par]; if (viz && ehRadio(classeDe(viz))) colados++;
    });
    if (colados) out.push(Math.ceil(colados / 2) + " par(es) de rádio ficam colados");
    return out;
  }

  /* a nota total de um plano: só para ordenar as variantes entre si */
  function qualidade(op) {
    var r = planejar(op), t = 0, ja = [];
    APARELHOS.forEach(function (a) {
      var p = portaDeEm(r.plano, a.id); if (!p) { t -= 60; return; }
      var pt = porNum(p); if (!pt) return;
      t += notaDe(a, pt, r.plano, ja).n;
      if (a.classe === "bt") ja.push(pt);
    });
    return t;
  }

  /* ══ 4.2 A RE-IDENTIFICAÇÃO ══════════════════════════════════════════
     Ela mexeu nos cabos. O caminho de barramento de quem mudou é outro; o
     serial não. Comparando as duas leituras, o produto diz o que saiu de
     onde — e, quando a entrada nova está declarada no mapa, ele diz para
     onde, sem ela escrever nada.                                          */
  /* a linha de "de onde eu sei" de cada aparelho que mudou de lugar */
  function linhaDoAchado(m, reconhecido) {
    var abre = '<li><span class="selo derivado">derivado</span><span>';
    if (reconhecido) {
      return abre + "Essa entrada está no seu mapa, então eu <b>já sei</b> onde ele está"
           + " — você não precisa declarar nada.</span></li>";
    }
    var reg = regiaoDoCaminho(m.agora);
    var onde = (reg === "hub")
      ? "pende do hub, então ele <b>está no hub</b>"
      : "não pende do hub, então ele <b>está direto no gabinete</b>";
    return abre + "O caminho <code>" + m.agora + "</code> " + onde
         + " — eu só não sei em qual entrada. Ele aparece na faixa tracejada da face certa,"
         + " logo abaixo do desenho: clique nele e depois na entrada, e eu aprendo para sempre."
         + "</span></li>";
  }

  function reexame(de, para) {
    var a = LEITURAS[de].caminho, b = LEITURAS[para].caminho;
    var porCaminho = {};
    Object.keys(MAPA).forEach(function (n) { porCaminho[MAPA[n]] = n; });
    var mudou = [];
    APARELHOS.forEach(function (ap) {
      if (a[ap.id] === b[ap.id]) return;
      mudou.push({
        ap: ap, antes: a[ap.id], agora: b[ap.id],
        entradaAntes: porCaminho[a[ap.id]] || null,
        entradaAgora: porCaminho[b[ap.id]] || null
      });
    });
    return mudou;
  }

  /* ══ 4.3 OS CONTROLES: onde cada um deve ficar para render 100% ══════
     O bond do Bluetooth fica PRESO ao adaptador em que nasceu — o BlueZ não
     reequilibra sozinho, e plugar outro dongle não move ninguém. Então quem
     está em qual adaptador é escolha, e é escolha que decide se a mesa cheia
     funciona. O produto sabe onde cada controle está: o `HID_PHYS` do uevent
     do nó hidraw publica o MAC do adaptador, e abre como uid 1000, sem sudo.

     A CONTA, medida (`daemon/subsystems/bt_mic.py`, A/B de 25/07/2026):
       sem microfone .. 260,4 relatórios por segundo
       com microfone .. 276,7  (o áudio NÃO abre canal novo: divide a fila)
     Gatilho, vibração, barra de luz, giroscópio e touch andam no MESMO canal
     HID — eles não somam pacote. **Só o microfone muda a conta.**            */
  var CUSTO_SEM_MIC = 260, CUSTO_COM_MIC = 277, SLOTS = 1600;

  /* ══ O PERFIL DE DESEMPENHO ══════════════════════════════════════════
     Substitui os CINCO degraus do "Orçamento" de hoje, dos quais QUATRO não
     fazem nada — medido em `core/rumble.py`: `_ORCAMENTO_COM_TETO` só casa
     com "economia"; `balanceado`, `max`, `auto` e o não-declarado devolvem
     `None`. E o teto alcança a vibração e mais nada, coisa que a própria
     tela já confessa.

     UMA decisão no lugar de muitas — mas o MICROFONE fica FORA do perfil,
     de propósito. Ele é o único do grupo que capta a sala, e o mapa de
     canais registra que ele nasce desligado por **privacidade e banda**, não
     só banda. Perfil que liga microfone sozinho transforma uma escolha de
     desempenho numa escolha de privacidade feita pelas costas.

     O que cada perfil governa é o que custa BATERIA. E aqui está o buraco
     honesto: **nenhum dos 178 ensaios desta casa mediu consumo por feature.**
     Os números de bateria abaixo estão marcados como NÃO MEDIDO até alguém
     pôr um controle carregado na mesa e cronometrar.                        */
  var PERFIS = [
    { id: "tudo", rotulo: "Tudo ligado",
      resumo: "Gatilho adaptativo, vibração no que o jogo pedir, barra de luz, giroscópio e touchpad.",
      liga: { gatilho: true, vibracao: "sem teto", lightbar: true },
      bateria: "não medido" },
    { id: "bateria", rotulo: "Bateria longa",
      resumo: "Vibração com teto de 30% e barra de luz apagada. Gatilho, giroscópio e touchpad continuam.",
      liga: { gatilho: true, vibracao: "30%", lightbar: false },
      bateria: "não medido" },
    { id: "escolho", rotulo: "Eu escolho",
      resumo: "Abre os ajustes de cada aba, um por um. É o que existe hoje.",
      liga: null, bateria: "—" }
  ];
  var perfil = "tudo";
  function perfilAtual() {
    for (var i = 0; i < PERFIS.length; i++) if (PERFIS[i].id === perfil) return PERFIS[i];
    return PERFIS[0];
  }
  /* migração dos valores que já estão no disco dela, sem perder nada:
     "economia" tinha teto e vira Bateria longa; os quatro que devolviam
     None se comportavam igual e viram Tudo ligado — quatro nomes para um
     comportamento só é o defeito, não a variedade.                          */
  var MIGRACAO = { economia: "bateria", balanceado: "tudo", max: "tudo",
                   auto: "tudo", "": "tudo", custom: "escolho" };

  var CONTROLES = [
    { nome: "Jogador 1", mic: true,  onde: "bt-a" },
    { nome: "Jogador 2", mic: true,  onde: "bt-a" },
    { nome: "Jogador 3", mic: true,  onde: "bt-b" },
    { nome: "Jogador 4", mic: true,  onde: "bt-b" }
  ];
  var quantos = 4;

  function custo(c) { return c.mic ? CUSTO_COM_MIC : CUSTO_SEM_MIC; }
  function adaptadores() {
    return APARELHOS.filter(function (a) { return a.classe === "bt"; })
      .map(function (a) {
        var p = portaDe(a.id);
        return { id: a.id, entrada: p, rotulo: p ? "entrada " + p : "entrada por confirmar" };
      });
  }

  /* O ARRANJO DOS CONTROLES.
     Regra que salva a credibilidade do conselho, a mesma do mapa: **ninguém
     troca de adaptador à toa.** Trocar custa caro de verdade aqui — desfazer
     o pareamento, apagar o cache SDP e parear de novo, com o controle na mão.
     Então parte-se de onde cada um JÁ está, e só se move alguém quando isso
     BAIXA a carga do adaptador mais cheio. Sem isso, o plano mandava trocar
     três controles entre dongles idênticos, sem ganho nenhum.               */
  function planoDosControles() {
    var ads = adaptadores();
    if (!ads.length) return { ads: [], carga: {}, destino: {}, cabe: false, sobra: 0 };
    var vivos = CONTROLES.slice(0, quantos);
    var carga = {}, destino = {};
    ads.forEach(function (a) { carga[a.id] = 0; });

    /* 1. cada um fica onde está — se o adaptador dele ainda existe */
    var orfaos = [];
    vivos.forEach(function (c) {
      if (carga[c.onde] !== undefined) { destino[c.nome] = c.onde; carga[c.onde] += custo(c); }
      else orfaos.push(c);
    });
    /* 2. quem perdeu o adaptador vai para o menos carregado */
    orfaos.forEach(function (c) {
      var m = ads[0];
      ads.forEach(function (a) { if (carga[a.id] < carga[m.id]) m = a; });
      destino[c.nome] = m.id; carga[m.id] += custo(c);
    });
    /* 3. rebalanceia SÓ enquanto isso baixar o pico */
    for (var volta = 0; volta < vivos.length * 2; volta++) {
      var cheio = ads[0], vazio = ads[0];
      ads.forEach(function (a) {
        if (carga[a.id] > carga[cheio.id]) cheio = a;
        if (carga[a.id] < carga[vazio.id]) vazio = a;
      });
      if (cheio.id === vazio.id) break;
      var cand = vivos.filter(function (c) { return destino[c.nome] === cheio.id; });
      if (!cand.length) break;
      var c = cand[cand.length - 1];
      var picoAntes = carga[cheio.id];
      var picoDepois = Math.max(carga[cheio.id] - custo(c), carga[vazio.id] + custo(c));
      if (picoDepois >= picoAntes) break;          /* não melhora: para */
      carga[cheio.id] -= custo(c); carga[vazio.id] += custo(c); destino[c.nome] = vazio.id;
    }

    var pico = Math.max.apply(null, ads.map(function (a) { return carga[a.id]; }));
    /* quantos MAIS cabem: simula acrescentar até um adaptador estourar.
       Dividir a folga total daria número maior e falso — controle não se
       parte entre dois adaptadores. */
    var teste = {}, sobra = 0;
    ads.forEach(function (a) { teste[a.id] = carga[a.id]; });
    while (sobra < 32) {
      var m2 = ads[0];
      ads.forEach(function (a) { if (teste[a.id] < teste[m2.id]) m2 = a; });
      if (teste[m2.id] + CUSTO_COM_MIC > SLOTS) break;
      teste[m2.id] += CUSTO_COM_MIC; sobra++;
    }
    return { ads: ads, carga: carga, destino: destino, cabe: pico <= SLOTS, sobra: sobra };
  }

  /* ══ 6. DESENHO ══════════════════════════════════════════════════════ */
  function soqueteHTML(porta, ctx) {
    var h = "", ap = null, estado = "", vered = "", porque = "", problema = "";

    if (ctx.modo === "ideal") {
      var idPlano = ctx.plano[porta.n], idAgora = alocacao[porta.n];
      ap = idPlano ? acha(idPlano) : null;
      if (idPlano && idPlano !== idAgora) {
        estado = "chega"; vered = "vem para cá";
        var de = portaDe(idPlano);
        porque = de ? "estava na entrada " + de : "ainda sem lugar";
      } else if (!idPlano && idAgora) {
        ap = acha(idAgora); estado = "sai"; vered = "sai daqui";
        porque = "vai para a entrada " + portaDeEm(ctx.plano, idAgora);
      } else if (idPlano) { estado = "fica"; vered = "fica"; porque = "já está certa"; }
    } else {
      var id = alocacao[porta.n];
      ap = id ? acha(id) : null;
      var j = julgar(porta);
      if (ap) {
        estado = "cheia";
        if (ap.classe === "wifi" && porta.onde === "hub") { problema = ' data-problema="1"'; vered = "mudar daqui"; }
        if (ap.classe === "teclado" && porta.onde === "hub") { problema = ' data-problema="1"'; vered = "mudar daqui"; }
      } else if (j) { estado = j.v; vered = j.txt; porque = j.porque; }
    }

    var titulo = ap ? ap.tipo + " — " + ap.nome : "entrada " + porta.n + ", vazia";
    h += '<div class="soquete"><span class="num">' + porta.n + "</span>"
      + '<button class="plug' + (porta.usb === 3 ? " v3" : "") + '" data-porta="' + porta.n + '"'
      + (estado ? ' data-v="' + estado + '"' : "") + problema
      + ' aria-label="' + titulo + '" title="' + titulo + '"></button><span class="rotulo">';
    if (ap) {
      h += '<b class="nome" style="color:' + ap.cor + '">' + ap.tipo + '</b><span class="caminho">' + (caminhoDe(ap.id) || "—") + "</span>";
      if (vered) h += '<span class="veredito ' + estado + '">' + vered + "</span>";
      if (porque) h += '<span class="porque">' + porque + "</span>";
    } else if (vered) {
      h += '<span class="veredito ' + estado + '">' + vered + '</span><span class="porque">' + porque + "</span>";
    } else {
      h += '<span class="vazio">vazia</span>';
    }
    h += "</span></div>";
    if (porta.filho) h += '<div class="filho"><div class="cabo">↳ ' + porta.filho.cabo + "</div>" + soqueteHTML(porta.filho, ctx) + "</div>";
    return h;
  }

  function pintar() {
    alocacao = alocacaoDerivada();
    var op = opDaVariante();
    var r = planejar(op);
    var ctx = { modo: modo, plano: r.plano };

    /* os modos */
    document.getElementById("modos").innerHTML =
        '<button class="modo" data-modo="mesa" aria-pressed="' + (modo === "mesa") + '">Como está a minha mesa</button>'
      + '<button class="modo destaque" data-modo="ideal" aria-pressed="' + (modo === "ideal") + '">Me mostre os arranjos</button>'
      + '<button class="modo" data-modo="mao" aria-pressed="' + (modo === "mao") + '">Estou com algo na mão</button>'
      + '<button class="modo" id="reexaminar" aria-pressed="false" style="margin-left:auto">Reexaminar a mesa</button>';

    /* o painel */
    var painel = document.getElementById("painel"), html = "";
    /* html é concatenado: o modo ideal empilha abas de variante + receita */
    if (modo === "ideal") {
      var qMelhor = qualidade({});
      html += '<p class="chamada">Quatro arranjos possíveis. O melhor no papel pode não caber na sua mesa — escolha o que cabe.</p>'
        + '<div class="escolhas" style="margin-bottom:.9rem">'
        + VARIANTES.map(function (v) {
            var n = receita(v.op).filter(function (m) { return !m.semNumero; }).length;
            var c = consequencias(v.op), base = consequencias({});
            var novas = c.filter(function (x) { return base.indexOf(x) === -1; });
            return '<button class="escolha" data-var="' + v.id + '" aria-pressed="' + (variante === v.id) + '">'
              + "<span><b>" + v.rotulo + "</b><br><span style=\"font-size:.6875rem;color:var(--color-ink-faint)\">"
              + n + " movimento" + (n === 1 ? "" : "s")
              + (novas.length ? " · " + novas[0] : (v.id === "melhor" ? " · a referência" : " · sem perda"))
              + "</span></span></button>";
          }).join("")
        + "</div>"
        + '<p style="margin:-.4rem 0 .9rem;font-size:var(--text-sm);color:var(--color-ink-quiet)">'
        + VARIANTES.filter(function (v) { return v.id === variante; })[0].desc
        + (function () {
            var c = consequencias(op), base = consequencias({});
            var novas = c.filter(function (x) { return base.indexOf(x) === -1; });
            return novas.length ? '<br><b style="color:var(--color-lacuna)">O que se perde:</b> ' + novas.join("; ") + "." : "";
          })()
        + "</p>";
      var movs = receita(op);
      var reais = movs.filter(function (m) { return !m.semNumero; });
      if (!reais.length) {
        html += '<div class="nada-a-fazer"><b>Nada a mover.</b> Cada aparelho já está na entrada que eu escolheria: '
             + "o teclado numa entrada direta, o Wi-Fi longe dos dongles, e os três dongles no alto e separados.</div>";
      } else {
        html += '<p class="chamada"><span class="grande">' + reais.length + " movimento" + (reais.length > 1 ? "s" : "") + "</span> e a sua mesa fica no melhor arranjo que este hardware permite.</p>"
             + '<ol class="receita">'
             + reais.map(function (m) {
                 return "<li><div><h4>" + m.titulo + "</h4><ul>"
                   + m.linhas.map(function (l) { return '<li><span class="selo ' + l.s + '">' + (l.s === "espec" ? "especificação" : l.s) + "</span><span>" + l.t + "</span></li>"; }).join("")
                   + "</ul></div></li>";
               }).join("")
             + "</ol>";
        var fim = movs.filter(function (m) { return m.semNumero; })[0];
        if (fim) html += '<div class="nada-a-fazer" style="margin-top:.5rem"><b>' + fim.titulo + "</b><ul style=\"list-style:none;margin:.3rem 0 0;padding:0;display:flex;flex-direction:column;gap:.2rem\">"
          + fim.linhas.map(function (l) { return '<li style="display:flex;gap:.4rem;align-items:baseline;font-size:var(--text-sm);color:var(--color-ink-quiet)"><span class="selo ' + l.s + '">' + l.s + "</span><span>" + l.t + "</span></li>"; }).join("") + "</ul></div>";
        html += '<div class="acoes"><button class="btn forte" id="aplicar">Já movi tudo — reexaminar</button>'
             +  '<button class="btn" id="voltar">Voltar para como está</button></div>';
      }
    } else if (modo === "reexame") {
      var mudou = reexame(leituraAnterior, leituraAtual);
      if (!mudou.length) {
        html = '<div class="nada-a-fazer"><b>Nada mudou de lugar.</b> Todos os aparelhos estão no mesmo caminho de barramento da leitura anterior.</div>';
      } else {
        var sabidos = mudou.filter(function (m) { return m.entradaAgora; });
        var novos = mudou.filter(function (m) { return !m.entradaAgora; });
        html = '<p class="chamada">Reexaminei e <span class="grande">' + mudou.length
          + "</span> aparelho" + (mudou.length > 1 ? "s mudaram" : " mudou") + " de lugar."
          + (sabidos.length ? " Reconheci " + sabidos.length + " sozinho." : "") + "</p>"
          + '<p style="margin:-.3rem 0 .8rem;font-size:var(--text-sm);color:var(--color-ink-quiet)">'
          + "O caminho de barramento de quem você moveu é outro; o <b>serial</b> não. É por ele que eu sei quem foi para onde.</p>"
          + '<ol class="receita">'
          + mudou.map(function (m) {
              var reconhecido = !!m.entradaAgora;
              return "<li><div><h4>" + m.ap.tipo + " · " + m.ap.nome
                + (reconhecido ? "" : "  ·  em entrada não declarada") + "</h4><ul>"
                + '<li><span class="selo medido">medido</span><span>Estava em <code>' + m.antes + "</code>"
                + (m.entradaAntes ? " (entrada <b>" + m.entradaAntes + "</b>)" : "")
                + ", agora está em <code>" + m.agora + "</code>"
                + (reconhecido ? " (entrada <b>" + m.entradaAgora + "</b>)" : "") + ".</span></li>"
                + linhaDoAchado(m, reconhecido)
                + "</ul></div></li>";
            }).join("")
          + "</ol>";
        if (novos.length) {
          html += '<div class="nada-a-fazer" style="margin-top:.6rem;border-left-color:var(--color-lacuna)">'
            + '<b style="color:var(--color-lacuna)">Por que ' + novos.length + " ficaram sem entrada</b>"
            + '<p style="margin:.3rem 0 0;font-size:var(--text-sm);color:var(--color-ink-quiet)">'
            + "Você declarou " + Object.keys(MAPA).length + " das " + todasPortas().length
            + " entradas — só as que tinham algo no dia. Quando você move um aparelho para uma entrada"
            + " que nunca foi declarada, eu vejo o aparelho e não sei onde ele está."
            + " <b>Declarar as entradas vazias também</b> é o que faz este reconhecimento nunca mais falhar.</p></div>";
        }
      }
      html += '<div class="acoes"><button class="btn" id="voltar-leitura">Fechar</button>'
        + '<button class="btn" id="ver-antes">Ver como a mesa estava ' + (leituraAtual === "agora" ? "antes" : "agora") + "</button></div>";
    } else if (modo === "mao") {
      html = '<p class="chamada" id="chamada-mao">O que você tem na mão agora?</p><div class="escolhas">'
        + NA_MAO.map(function (m) { return '<button class="escolha" data-mao="' + m.id + '" aria-pressed="' + (naMao === m.id) + '"><i style="background:' + m.cor + '"></i>' + m.rotulo + "</button>"; }).join("")
        + "</div>";
      if (naMao && LICOES[naMao]) {
        var L = LICOES[naMao];
        html += '<div class="licao"><p class="texto">' + L.texto + "</p>"
          + (L.conta ? '<div class="conta-caixa"><b>' + L.conta.titulo + "</b>" + L.conta.linhas.map(function (x) { return "<div>" + x + "</div>"; }).join("") + "</div>" : "")
          + "</div>";
      }
    } else {
      var pend = receita(op).filter(function (m) { return !m.semNumero; }).length;
      var sem = semEntrada();
      html = '<p class="chamada">' + (pend
        ? "Encontrei <span class=\"grande\">" + pend + "</span> coisa" + (pend > 1 ? "s" : "") + " que vale mudar de lugar."
        : "Esta mesa está no melhor arranjo que eu conheço.") + "</p>"
        + '<p style="margin:0;font-size:var(--text-sm);color:var(--color-ink-quiet)">'
        + (pend ? 'Clique em <b style="color:var(--color-ok)">Me mostre os arranjos</b> para ver o que mover, na ordem, e por quê.'
                : "Se o controle ainda engasgar, a causa não é a disposição — olhe a conta de vezes de falar, abaixo.")
        + "</p>"
        + '<p style="margin:.5rem 0 0;font-size:var(--text-xs);color:var(--color-ink-faint)">'
        + (leituraAtual === "agora" ? "Esta é a mesa de agora — " : '<b style="color:var(--color-lacuna)">Você está vendo uma leitura ANTIGA</b> — ')
        + LEITURAS[leituraAtual].rotulo + " · você declarou <b style=\"color:var(--color-ink-quiet)\">"
        + Object.keys(MAPA).length + " de " + todasPortas().length + "</b> entradas."
        + (sem.length ? ' <b style="color:var(--color-lacuna)">' + sem.length
            + " aparelho" + (sem.length > 1 ? "s estão" : " está") + " numa entrada que você não declarou.</b>" : "")
        + "</p>";
    }
    painel.innerHTML = html;

    /* as faces */
    document.getElementById("faces").innerHTML = FACES.map(function (f) {
      var mapa = modo === "ideal" ? r.plano : alocacao;
      var total = f.portas.length + f.portas.filter(function (p) { return p.filho; }).length;
      var cheias = f.portas.reduce(function (s, p) { return s + (mapa[p.n] ? 1 : 0) + (p.filho && mapa[p.filho.n] ? 1 : 0); }, 0);
      /* os aparelhos que ESTA região tem e cuja entrada ainda não foi
         declarada: eles aparecem, porque o produto os vê. Esconder seria
         mentir sobre a mesa dela. */
      var reg = f.regiao;
      var pend = (modo === "ideal") ? [] : semEntrada().filter(function (x) { return x.regiao === reg; });
      /* a região "pc" tem duas faces: a faixa vai numa só, para não duplicar */
      if (reg === "pc" && !f.donaDaFaixaPc) pend = [];
      var faixa = "";
      if (pend.length) {
        faixa = '<div class="por-confirmar">'
          + "<b>" + pend.length + " aparelho" + (pend.length > 1 ? "s estão" : " está")
          + (reg === "hub" ? " no hub" : " numa entrada direta do PC")
          + ", e eu não sei em qual entrada</b>"
          + '<div class="pend-lista">'
          + pend.map(function (x) {
              return '<button class="chip pend" data-ap="' + x.ap.id + '"'
                + (segurando === x.ap.id ? ' data-segurando="1"' : "") + ">"
                + '<i class="marca" style="background:' + x.ap.cor + '"></i>'
                + '<span class="txt"><b>' + x.ap.tipo + "</b><span>" + x.caminho + "</span></span></button>";
            }).join("")
          + "</div>"
          + '<span class="pend-ajuda">Clique o aparelho e depois a entrada onde ele está — as candidatas acendem. Eu aprendo de uma vez.</span>'
          + "</div>";
      }
      return '<div><div class="face-cab"><h3>' + f.nome + '</h3><span class="quantas">' + cheias + " de " + total + " ocupadas</span></div>"
        + '<div class="rolar"><div class="chapa ' + f.forma + '">' + f.portas.map(function (p) { return soqueteHTML(p, ctx); }).join("") + "</div></div>"
        + faixa + "</div>";
    }).join("");

    /* a bandeja */
    document.getElementById("bandeja").innerHTML = APARELHOS.map(function (a) {
      var p = modo === "ideal" ? portaDeEm(r.plano, a.id) : portaDe(a.id);
      return '<button class="chip" data-ap="' + a.id + '"' + (p ? ' data-alocado="1"' : "")
        + (segurando === a.id ? ' data-segurando="1"' : "") + ">"
        + '<i class="marca" style="background:' + a.cor + '"></i>'
        + '<span class="txt"><b>' + a.tipo + "</b><span>" + a.nome + " · " + (caminhoDe(a.id) || "não está plugado") + "</span></span>"
        + (p ? '<span class="num">' + p + "</span>" : "") + "</button>";
    }).join("");
    var soltos = APARELHOS.filter(function (a) { return !portaDe(a.id); }).length;
    document.getElementById("ajuda-bandeja").textContent = segurando
      ? "Na mão: " + acha(segurando).tipo + ". Clique a entrada em que ele vai."
      : (soltos ? soltos + " ainda sem lugar no mapa." : "O número é a entrada em que cada um está.");

    /* legenda */
    document.getElementById("legenda").innerHTML = modo === "ideal"
      ? '<span><i class="amostra r-ok"></i> vem para cá</span><span><i class="amostra r-ru"></i> sai daqui</span>'
        + '<span><i class="amostra v3"></i> USB 3.0</span><span><i class="amostra v2"></i> USB 2.0</span>'
      : modo === "mao"
      ? '<span><i class="amostra r-ok"></i> melhor lugar</span><span><i class="amostra r-ev"></i> vale evitar</span>'
        + '<span><i class="amostra r-ru"></i> evite</span><span><i class="amostra v3"></i> USB 3.0</span><span><i class="amostra v2"></i> USB 2.0</span>'
      : '<span><i class="amostra v3"></i> USB 3.0</span><span><i class="amostra v2"></i> USB 2.0</span>'
        + '<span><i class="amostra r-ru"></i> está num lugar ruim</span>';

    /* ── os controles: onde cada um deve ficar ────────────────────── */
    var alvo = document.getElementById("adaptadores");
    var pc = planoDosControles();
    var pa = perfilAtual();
    var micLigado = CONTROLES.slice(0, quantos).some(function (c) { return c.mic; });
    var h2 = '<div class="linha-perfil"><span class="ctl-rot">Perfil de desempenho:</span>'
      + PERFIS.map(function (v) {
          return '<button class="escolha" data-perfil="' + v.id + '" aria-pressed="' + (perfil === v.id) + '">' + v.rotulo + "</button>";
        }).join("")
      + '<span class="ctl-rot" style="margin-left:auto">Controles na mesa:</span>'
      + [1,2,3,4].map(function (n) {
          return '<button class="escolha" data-quantos="' + n + '" aria-pressed="' + (quantos === n) + '">' + n + "</button>";
        }).join("")
      + "</div>"
      + '<p class="ctl-nota">' + pa.resumo
      + ' <b>Nenhum deles muda a conta do rádio</b> — gatilho, vibração, barra de luz, giroscópio e touchpad andam no mesmo canal e não somam pacote. O que eles mudam é a <b>bateria</b>, e o preço disso <span class="selo derivado">não medido</span> nesta casa: nenhum dos 178 ensaios cronometrou consumo por feature.</p>'
      + '<div class="linha-mic"><b>Microfone</b>'
      + '<button class="escolha" data-mic="nenhum" aria-pressed="' + (!micLigado) + '">Desligado</button>'
      + '<button class="escolha" data-mic="todos" aria-pressed="' + micLigado + '">Ligado</button>'
      + '<span class="mic-porque">Fica fora do perfil de propósito: ele é o único que <b>capta a sala</b>, e é o único que muda a conta do rádio — <b>277</b> em vez de 260 vezes de falar por segundo. Nasce desligado, e só você o liga.</span>'
      + "</div>";

    pc.ads.forEach(function (a) {
      var meus = CONTROLES.slice(0, quantos).filter(function (c) { return pc.destino[c.nome] === a.id; });
      var usado = pc.carga[a.id] || 0;
      var pct = Math.min(100, Math.round(usado / SLOTS * 100));
      var apertado = usado > SLOTS;
      h2 += '<div class="adap"><div class="quem"><b>Adaptador · ' + a.rotulo + "</b><span>"
        + (meus.length ? meus.map(function (c) { return c.nome.replace("Jogador ", "P") + (c.mic ? " com mic" : ""); }).join(" · ") : "nenhum controle")
        + '</span></div><div class="barra"><i class="' + (apertado ? "apertado" : "") + '" style="width:' + pct + '%"></i></div>'
        + '<div class="conta">' + usado + " / " + SLOTS + ' · <em class="' + (apertado ? "apertado" : "") + '">'
        + (apertado ? "não cabe" : usado === 0 ? "livre" : "folgada") + "</em></div></div>";
    });

    h2 += '<div class="veredito-mesa ' + (pc.cabe ? "bom" : "ruim") + '">'
      + (pc.cabe
          ? "<b>Cabe, com folga.</b> Os " + quantos + " controles com tudo ligado usam no máximo "
            + Math.max.apply(null, pc.ads.map(function (a) { return pc.carga[a.id] || 0; }))
            + " das " + SLOTS + " vezes de falar do adaptador mais cheio."
            + (pc.sobra > 0 ? " Ainda caberiam <b>mais " + pc.sobra + "</b> com microfone." : "")
          : "<b>Não cabe.</b> Um adaptador passaria das " + SLOTS + " vezes de falar por segundo, e aí o controle engasga.")
      + '<br><span class="selo derivado">derivado</span> A conta vem de uma medição de <b>um</b> controle. '
      + "Quatro no rádio ao mesmo tempo <b>nunca foi medido nesta casa</b> — o maior ensaio já feito foi de dois."
      + "</div>";

    /* o que ela precisa MOVER de adaptador, e como */
    var mudancas = CONTROLES.slice(0, quantos).filter(function (c) { return pc.destino[c.nome] !== c.onde; });
    if (mudancas.length) {
      h2 += '<div class="veredito-mesa aviso"><b>' + mudancas.length + " controle" + (mudancas.length > 1 ? "s estão" : " está")
        + " no adaptador errado.</b> O pareamento fica preso ao adaptador onde nasceu — plugar outro dongle não move ninguém.<ul class=\"mudar\">"
        + mudancas.map(function (c) {
            var de = adaptadores().filter(function (a) { return a.id === c.onde; })[0];
            var para = adaptadores().filter(function (a) { return a.id === pc.destino[c.nome]; })[0];
            return "<li><b>" + c.nome + "</b>: " + (de ? de.rotulo : "adaptador atual") + " → " + (para ? para.rotulo : "?")
              + '<br><span class="passo">tire o pareamento do adaptador antigo, apague o cache SDP, e pareie de novo no novo '
              + "(o Hefesto faz os três passos por você — sem terminal).</span></li>";
          }).join("")
        + "</ul></div>";
    }
    alvo.innerHTML = h2;
  }

  /* ══ 7. INTERAÇÃO ════════════════════════════════════════════════════ */
  document.addEventListener("click", function (ev) {
    var m = ev.target.closest(".modo[data-modo]");
    if (m) { modo = m.getAttribute("data-modo"); if (modo !== "mao") { naMao = null; segurando = null; } pintar(); return; }

    var pb = ev.target.closest(".escolha[data-perfil]");
    if (pb) { perfil = pb.getAttribute("data-perfil"); pintar(); return; }
    var qb = ev.target.closest(".escolha[data-quantos]");
    if (qb) { quantos = parseInt(qb.getAttribute("data-quantos"), 10); pintar(); return; }
    var mb = ev.target.closest(".escolha[data-mic]");
    if (mb) { var v = mb.getAttribute("data-mic") === "todos";
      CONTROLES.forEach(function (c) { c.mic = v; }); pintar(); return; }

    var vb = ev.target.closest(".escolha[data-var]");
    if (vb) { variante = vb.getAttribute("data-var"); pintar(); return; }

    if (ev.target.id === "reexaminar") {
      /* relata a diferença; NÃO troca o que o mapa mostra */
      modo = "reexame"; segurando = null; naMao = null; pintar(); return;
    }
    if (ev.target.id === "voltar-leitura") { modo = "mesa"; pintar(); return; }
    if (ev.target.id === "ver-antes") {
      var t = leituraAtual; leituraAtual = leituraAnterior; leituraAnterior = t;
      modo = "mesa"; pintar(); return;
    }
    if (ev.target.id === "aplicar") {
      /* aplicar o plano = redeclarar o mapa: cada entrada do plano passa a
         apontar para o caminho do aparelho que o plano pôs nela */
      var pl = planejar(opDaVariante()).plano, cam = leitura(), novo = {};
      Object.keys(pl).forEach(function (n) { if (cam[pl[n]]) novo[n] = cam[pl[n]]; });
      MAPA = novo; pintar(); return;
    }
    if (ev.target.id === "voltar") { MAPA = Object.assign({}, MAPA_ORIGINAL); pintar(); return; }

    var esc = ev.target.closest(".escolha[data-mao]");
    if (esc) { var x = esc.getAttribute("data-mao"); naMao = (naMao === x ? null : x); segurando = null; pintar(); return; }

    var chip = ev.target.closest(".chip[data-ap]");
    if (chip) {
      modo = "mao";
      var ap = acha(chip.getAttribute("data-ap"));
      var atual = portaDe(ap.id); if (atual) delete alocacao[atual];
      segurando = ap.id;
      naMao = ({ bt: "bt", wifi: "wifi", teclado: "teclado", mouse: "mouse", webcam: "webcam" })[ap.classe] || null;
      pintar(); return;
    }

    var plug = ev.target.closest(".plug[data-porta]");
    if (plug) {
      if (modo === "ideal") return;
      var n = plug.getAttribute("data-porta"), p = porNum(n);
      if (segurando) {
        if (ocupada(alocacao, p)) return;
        /* ENSINAR O MAPA: esta entrada é o caminho deste aparelho, para sempre */
        var c = leitura()[segurando];
        if (c) {
          Object.keys(MAPA).forEach(function (k) { if (MAPA[k] === c) delete MAPA[k]; });
          MAPA[n] = c;
        }
        segurando = null; naMao = null; modo = "mesa";
      } else if (alocacao[n]) {
        var quem = acha(alocacao[n]);
        delete MAPA[n];                 /* desdeclara: ela vai dizer onde é */
        segurando = quem.id; modo = "mao";
        naMao = ({ bt: "bt", wifi: "wifi", teclado: "teclado", mouse: "mouse", webcam: "webcam" })[quem.classe] || null;
      }
      pintar(); return;
    }
  });

  global.__t = { pintar:pintar, set modo(v){ modo=v; }, get modo(){ return modo; },
                 set variante(v){ variante=v; }, set naMao(v){ naMao=v; },
                 set segurando(v){ segurando=v; }, set quantos(v){ quantos=v; },
                 set perfil(v){ perfil=v; }, set leituraAtual(v){ leituraAtual=v; },
                 set MAPA(v){ MAPA=v; }, get MAPA(){ return MAPA; },
                 CONTROLES:CONTROLES, VARIANTES:VARIANTES, PERFIS:PERFIS, APARELHOS:APARELHOS };
})();
var t = global.__t, falhas = 0, casos = 0;
function caso(nome, fn){
  casos++;
  try { fn(); t.pintar();
        var v = ["modos","painel","faces","bandeja","legenda","adaptadores"]
          .filter(function(k){ return !(alvos[k]&&alvos[k].innerHTML.length); });
        if (v.length) { falhas++; console.log("  VAZIO  "+nome+"  -> "+v.join(",")); }
        else console.log("  ok     "+nome);
  } catch(e){ falhas++; console.log("  ERRO   "+nome+"  -> "+e.message); }
}
["mesa","ideal","mao","reexame"].forEach(function(m){ caso("modo="+m, function(){ t.modo=m; }); });
t.VARIANTES.forEach(function(v){ caso("ideal/variante="+v.id, function(){ t.modo="ideal"; t.variante=v.id; }); });
["bt","wifi","teclado","mouse","webcam",null].forEach(function(x){
  caso("mao/naMao="+x, function(){ t.modo="mao"; t.naMao=x; }); });
t.PERFIS.forEach(function(p){ caso("perfil="+p.id, function(){ t.modo="mesa"; t.perfil=p.id; }); });
[1,2,3,4].forEach(function(n){ caso("controles="+n, function(){ t.quantos=n; }); });
[true,false].forEach(function(m){ caso("mic="+m, function(){ t.CONTROLES.forEach(function(c){c.mic=m;}); }); });
["antes","agora"].forEach(function(L){ caso("leitura="+L, function(){ t.leituraAtual=L; }); });
caso("mapa VAZIO (primeira abertura)", function(){ t.modo="mesa"; t.MAPA={}; });
caso("mapa vazio + ideal", function(){ t.modo="ideal"; });
caso("mapa vazio + segurando", function(){ t.modo="mao"; t.segurando="wifi"; t.naMao="wifi"; });
caso("mapa com entrada inexistente", function(){ t.segurando=null; t.modo="mesa"; t.MAPA={"99":"9-9"}; });
console.log("\n  "+(casos-falhas)+"/"+casos+" estados pintaram"+(falhas?"  <<< "+falhas+" FALHAS":"  — nenhum erro de execução"));
process.exit(falhas?1:0);
