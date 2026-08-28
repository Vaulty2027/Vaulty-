/* ═══════════════════════════════════════════════════
   STOCK WARS 2.0 — game.js
   ═══════════════════════════════════════════════════ */

"use strict";

const GOAL = 20000;
const START_CASH = 10000;

const STOCK_DEFS = [
  { ticker:"NXCR", name:"NexaCorp", sector:"Tech", vol:0.10, basePrice:120, color:"#a78bfa" },
  { ticker:"AURM", name:"Aurum Bank", sector:"Finanzas", vol:0.04, basePrice:90, color:"#fbbf24" },
  { ticker:"VRDX", name:"VerdeX", sector:"Energía", vol:0.07, basePrice:150, color:"#34d399" },
  { ticker:"MNRV", name:"MinerVa", sector:"Minería", vol:0.11, basePrice:60, color:"#f87171" },
  { ticker:"HLTH", name:"HealthPlus", sector:"Salud", vol:0.06, basePrice:200, color:"#60a5fa" }
];

const EVENTS = [
  { name:"💻 Boom Tecnológico", desc:"NXCR sube fuerte. AURM cae.", effect:{NXCR:.35,AURM:-.12} },
  { name:"🦠 Pandemia Mundial", desc:"HLTH explota. Materias primas sufren.", effect:{HLTH:.50,VRDX:-.15,MNRV:-.10} },
  { name:"⚡ Crisis Energética", desc:"VRDX y MNRV suben. Economía tensa.", effect:{VRDX:.40,MNRV:.25,AURM:-.08} },
  { name:"🏦 Escándalo Bancario", desc:"AURM desploma. Pánico general.", effect:{AURM:-.45,NXCR:-.10} },
  { name:"💎 Mineral Descubierto", desc:"MNRV explota. VerdeX pierde.", effect:{MNRV:.60,VRDX:-.12} },
  { name:"⚖️ Regulación Tech", desc:"NXCR y HLTH bajan por nuevas leyes.", effect:{NXCR:-.25,HLTH:-.15} },
  { name:"💊 Cura Milagrosa", desc:"HLTH sube mucho. El resto neutro.", effect:{HLTH:.45} },
  { name:"🌿 Boom Renovable", desc:"VRDX se dispara. MNRV cae.", effect:{VRDX:.38,MNRV:-.20} },
  { name:"📉 Recesión Global", desc:"Todo el mercado cae. Hay oportunidades.", effect:{NXCR:-.20,AURM:-.25,VRDX:-.18,MNRV:-.22,HLTH:-.15} },
  { name:"🤝 Fusión Corporativa", desc:"NXCR y HLTH se alían. Ambas suben.", effect:{NXCR:.22,HLTH:.18} }
];

const HINTS = [
  "Algo bueno se avecina para el sector tecnológico...",
  "Los bancos podrían estar en problemas pronto.",
  "El sector energético podría moverse esta semana.",
  "Rumores de un gran descubrimiento en minería.",
  "El sector salud podría protagonizar el próximo movimiento."
];

let G = {};
let paused = false;
let stats = JSON.parse(localStorage.getItem("stockWarsStats") || '{"games":0,"wins":0,"losses":0,"best":10000}');

const TUTORIAL_COMPLETED_KEY = "stockWarsTutorialCompleted";
const TUTORIAL_SEEN_KEY = "stockWarsTutorialSeen";
const GUIDED_SEEN_KEY = "stockWarsGuidedSeen";

const TUTORIAL_STEPS = [
  {
    kicker:"PRIMER CONTACTO",
    title:"Bienvenido a Stock Wars",
    focus:["#screen-intro .rules-box"],
    content:`
      <div class="tutorial-hero-copy">
        <span class="tutorial-index">01</span>
        <div>
          <p class="tutorial-lead">Stock Wars es un juego de estrategia financiera. Invierte en empresas, lee el mercado y supera a la IA rival.</p>
          <p>No se trata solo de comprar y esperar: cada turno exige decidir cu&aacute;ndo entrar, cu&aacute;ndo salir y cu&aacute;nto riesgo aceptar.</p>
        </div>
      </div>
      <div class="tutorial-metrics">
        <div><span>CAPITAL INICIAL</span><strong>$10,000</strong></div>
        <div><span>META</span><strong>$20,000</strong></div>
        <div><span>RIVAL</span><strong>IA</strong></div>
      </div>
      <div class="tutorial-callout"><strong>Tu misi&oacute;n:</strong> hacer crecer tu capital antes que la IA sin quedarte sin fondos.</div>`
  },
  {
    kicker:"LECTURA DEL MERCADO",
    title:"Conoce las acciones",
    focus:["#stocks-list"],
    content:`
      <p class="tutorial-lead">Cada acci&oacute;n representa una empresa. Su precio cambia seg&uacute;n los movimientos normales y los eventos del mercado.</p>
      <div class="tutorial-stock-list">
        <div><b style="color:#a78bfa">NXCR</b><span>NexaCorp</span><em>Tecnolog&iacute;a</em></div>
        <div><b style="color:#fbbf24">AURM</b><span>Aurum Bank</span><em>Finanzas</em></div>
        <div><b style="color:#34d399">VRDX</b><span>VerdeX</span><em>Energ&iacute;a</em></div>
        <div><b style="color:#f87171">MNRV</b><span>MinerVa</span><em>Miner&iacute;a</em></div>
        <div><b style="color:#60a5fa">HLTH</b><span>HealthPlus</span><em>Salud</em></div>
      </div>
      <div class="tutorial-split-cards">
        <div><strong>PRECIO</strong><p>Lo que cuesta comprar una acci&oacute;n ahora.</p></div>
        <div><strong>GR&Aacute;FICO</strong><p>La l&iacute;nea muestra el historial reciente: arriba sube, abajo baja.</p></div>
        <div><strong>TENDENCIA</strong><p><span class="green">ALCISTA</span>, <span class="red">BAJISTA</span> o <span class="amber">LATERAL</span> resume el impulso.</p></div>
      </div>`
  },
  {
    kicker:"PRIMERA OPERACI&Oacute;N",
    title:"Comprar una acci&oacute;n",
    focus:["#btn-buy"],
    content:`
      <div class="tutorial-action-layout">
        <div>
          <p class="tutorial-lead">Comprar significa gastar parte de tu efectivo para adquirir acciones.</p>
          <p>Selecciona una empresa, elige la cantidad y pulsa <strong class="green">COMPRAR</strong>. Las acciones pasan a tu portafolio.</p>
        </div>
        <div class="tutorial-example buy-example"><span>EJEMPLO</span><strong>5 &times; $100 = $500</strong><small>Tu efectivo baja $500 y recibes 5 acciones.</small></div>
      </div>
      <div class="tutorial-callout"><strong>Consejo:</strong> no comprometas todo tu efectivo en una sola empresa; guarda margen para aprovechar nuevas oportunidades.</div>`
  },
  {
    kicker:"SALIDA ESTRAT&Eacute;GICA",
    title:"Vender una acci&oacute;n",
    focus:["#btn-sell"],
    content:`
      <div class="tutorial-action-layout">
        <div>
          <p class="tutorial-lead">Vender significa deshacerte de acciones que ya tienes y recuperar dinero.</p>
          <p>Selecciona una acci&oacute;n de tu portafolio, indica cu&aacute;ntas quieres cerrar y pulsa <strong class="red">VENDER</strong>.</p>
        </div>
        <div class="tutorial-example sell-example"><span>EJEMPLO</span><strong>5 &times; $130 = $650</strong><small>Compraste a $100 y ahora recuperas $650.</small></div>
      </div>
      <div class="tutorial-callout"><strong>Idea clave:</strong> una ganancia solo queda asegurada cuando vendes; tambi&eacute;n puedes vender para limitar una p&eacute;rdida.</div>`
  },
  {
    kicker:"TU CAPITAL EN TIEMPO REAL",
    title:"Efectivo, portafolio y total",
    focus:["#stat-cash","#stat-port","#stat-total","#portfolio-list"],
    content:`
      <p class="tutorial-lead">Estas tres cifras cuentan la historia completa de tu partida.</p>
      <div class="tutorial-metrics tutorial-finance-metrics">
        <div><span>EFECTIVO</span><strong>$7,000</strong><small>Dinero listo para comprar.</small></div>
        <div><span>PORTAFOLIO</span><strong>$4,000</strong><small>Valor actual de tus acciones.</small></div>
        <div><span>TOTAL</span><strong class="amber">$11,000</strong><small>Efectivo + portafolio.</small></div>
      </div>
      <div class="tutorial-callout"><strong>Para ganar:</strong> vigila el TOTAL. Es la cifra que avanza hacia la meta de $20,000, aunque el efectivo y el portafolio suban o bajen por separado.</div>`
  },
  {
    kicker:"EL TIEMPO ES UNA DECISI&Oacute;N",
    title:"Turnos y cambios del mercado",
    focus:["#btn-turn"],
    content:`
      <div class="tutorial-hero-copy">
        <span class="tutorial-index">06</span>
        <div><p class="tutorial-lead">Cada vez que pulsas <strong class="amber">SIGUIENTE TURNO</strong>, el mercado avanza.</p><p>Ese paso actualiza los precios y resuelve lo que ocurre en el mundo de Stock Wars.</p></div>
      </div>
      <div class="tutorial-sequence">
        <div><b>01</b><span>Cambian los precios</span></div>
        <div><b>02</b><span>Puede aparecer un evento</span></div>
        <div><b>03</b><span>La IA compra o vende</span></div>
        <div><b>04</b><span>Puede llegar una pista</span></div>
      </div>
      <div class="tutorial-callout"><strong>Antes de avanzar:</strong> revisa tu posici&oacute;n y decide si quieres comprar, vender o esperar.</div>`
  },
  {
    kicker:"SE&Ntilde;ALES DEL MUNDO",
    title:"Eventos, pistas y tendencias",
    focus:["#event-banner","#hint-box","#detail-chart"],
    content:`
      <p class="tutorial-lead">Los eventos aleatorios pueden cambiar mucho el mercado. Una acci&oacute;n puede subir mientras otra cae.</p>
      <div class="tutorial-event-chips"><span>Boom Tecnol&oacute;gico</span><span>Pandemia Mundial</span><span>Crisis Energ&eacute;tica</span><span>Esc&aacute;ndalo Bancario</span><span>Mineral Descubierto</span><span>Regulaci&oacute;n Tech</span><span>Cura Milagrosa</span><span>Boom Renovable</span><span>Recesi&oacute;n Global</span><span>Fusi&oacute;n Corporativa</span></div>
      <div class="tutorial-split-cards">
        <div><strong>PISTAS</strong><p>&ldquo;Algo bueno se avecina para el sector tecnol&oacute;gico...&rdquo; Ayudan a orientar tu decisi&oacute;n, pero no garantizan el resultado.</p></div>
        <div><strong>GR&Aacute;FICO</strong><p>Compara el recorrido reciente: <span class="green">alcista</span> sube, <span class="red">bajista</span> baja y <span class="amber">lateral</span> se mueve sin direcci&oacute;n clara.</p></div>
      </div>`
  },
  {
    kicker:"CONDICIONES DE VICTORIA",
    title:"Compite, gana y aprende de la dificultad",
    focus:["#bar-you","#bar-rival"],
    content:`
      <div class="tutorial-win-grid">
        <div class="win-rule positive"><b>GANAS</b><p>Llegas a $20,000 antes que la IA.</p></div>
        <div class="win-rule negative"><b>PIERDES</b><p>La IA llega primero o tu capital baja a $0.</p></div>
        <div class="win-rule neutral"><b>AL FINAL</b><p>Si se acaban los turnos, gana quien tenga m&aacute;s capital.</p></div>
      </div>
      <p class="tutorial-lead difficulty-title">Elige el ritmo que prefieras:</p>
      <div class="difficulty-cards"><div><b>F&Aacute;CIL</b><span>40 turnos</span></div><div><b>NORMAL</b><span>30 turnos</span></div><div><b>DIF&Iacute;CIL</b><span>22 turnos</span></div></div>
      <div class="tutorial-callout final-callout"><strong>Ya tienes el mapa.</strong> Lee el mercado, protege tu efectivo y haz que cada turno cuente.</div>`
  }
];

const GUIDED_STEPS = [
  {target:"#stocks-list", title:"Selecciona una acci&oacute;n", text:"Empieza aqu&iacute;: toca una empresa para ver su precio, gr&aacute;fico y tendencia."},
  {target:"#btn-buy", title:"Decide si comprar", text:"Con una acci&oacute;n seleccionada, usa COMPRAR para invertir efectivo."},
  {target:"#qty-input", title:"Elige la cantidad", text:"Ajusta cu&aacute;ntas acciones quieres operar. Puedes usar +, MAX o los presets."},
  {target:"#btn-turn", title:"Avanza el mercado", text:"Cuando termines tu jugada, pulsa SIGUIENTE TURNO para mover precios y dejar actuar a la IA."}
];

let tutorialIndex = 0;
let guidedIndex = 0;
let toastTimer = null;
let guidedResizeObserver = null;

function createState(diff) {
  const maxTurns = diff === "easy" ? 40 : diff === "normal" ? 30 : 22;

  return {
    diff,
    maxTurns,
    turn:1,
    cash:START_CASH,
    portfolio:{},
    buyAvg:{},
    stocks:initStocks(),
    rival:{cash:START_CASH,port:{},buyAvg:{}},
    activeEvent:null,
    eventCooldown:0,
    selected:null,
    hint:null,
    operations:0,
    events:0,
    log:[{msg:"— Mercado abierto. ¡Suerte! —",type:"info",turn:1}]
  };
}

function initStocks() {
  return STOCK_DEFS.map(def => ({
    ...def,
    price:def.basePrice * (.85 + Math.random() * .3),
    history:[]
  })).map(stock => {

    let p = stock.price;
    const history = [];

    for(let i=0;i<10;i++){
      p = Math.max(1,p * (1 + (Math.random()-.5)*.06));
      history.push(p);
    }

    history[history.length-1] = stock.price;

    return {...stock,history};
  });
}

function fmt(n) {
  return "$" + Math.round(n).toLocaleString("es");
}

function fmtPct(n) {
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}

function portfolioValue(cash,port,stocks) {
  return cash + stocks.reduce(
    (acc,s) => acc + (port[s.ticker] || 0) * s.price,
    0
  );
}

function pointsForHistory(history,W,H,pad=2) {

  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max-min || 1;

  return history.map((v,i) => ({
    x:(i/(history.length-1))*W,
    y:H-pad-((v-min)/range)*(H-pad*2),
    v
  }));
}

function sparklineSVG(history,color) {

  if(history.length < 2) return "";

  const W=100;
  const H=30;

  const pts=pointsForHistory(history,W,H,3)
    .map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const last=pointsForHistory(history,W,H,3).at(-1);

  return `
  <svg class="sparkline-svg" viewBox="0 0 ${W} ${H}">
    <polyline
      points="${pts}"
      fill="none"
      stroke="${color}"
      stroke-width="5"
      opacity=".2"
      stroke-linejoin="round"
      stroke-linecap="round"/>
    <polyline
      points="${pts}"
      fill="none"
      stroke="${color}"
      stroke-width="2"
      stroke-linejoin="round"
      stroke-linecap="round"/>
    <circle
      cx="${last.x.toFixed(1)}"
      cy="${last.y.toFixed(1)}"
      r="2.2"
      fill="${color}"/>
  </svg>`;
}

function chartSVG(history,color) {

  if(history.length < 2) return "";

  const W=320;
  const H=126;

  const points=pointsForHistory(history,W,H,12);
  const line=points
    .map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const area=`0,${H} ${line} ${W},${H}`;
  const last=points.at(-1);

  return `
  <svg class="detail-chart-svg" viewBox="0 0 ${W} ${H}">
    <line class="chart-grid" x1="0" y1="31.5" x2="${W}" y2="31.5"/>
    <line class="chart-grid" x1="0" y1="63" x2="${W}" y2="63"/>
    <line class="chart-grid" x1="0" y1="94.5" x2="${W}" y2="94.5"/>

    <polygon
      points="${area}"
      fill="${color}"
      opacity=".12"/>

    <polyline
      points="${line}"
      fill="none"
      stroke="${color}"
      stroke-width="7"
      opacity=".18"
      stroke-linejoin="round"
      stroke-linecap="round"/>

    <polyline
      points="${line}"
      fill="none"
      stroke="${color}"
      stroke-width="3"
      stroke-linejoin="round"
      stroke-linecap="round"/>

    <circle
      cx="${last.x.toFixed(1)}"
      cy="${last.y.toFixed(1)}"
      r="4"
      fill="${color}"/>
  </svg>`;
}

function renderStocks() {

  const container=document.getElementById("stocks-list");
  if(!container) return;

  container.innerHTML="";

  G.stocks.forEach(s => {

    const prev=s.history.length>1
      ? s.history[s.history.length-2]
      : s.price;

    const chg=(s.price-prev)/prev*100;
    const up=chg>=0;
    const clr=up?"var(--green)":"var(--red)";
    const ownedQ=G.portfolio[s.ticker] || 0;

    const div=document.createElement("div");

    div.className=[
      "stock-item",
      up?"is-up":"is-down",
      G.selected===s.ticker?"selected":""
    ].filter(Boolean).join(" ");

    div.dataset.ticker=s.ticker;

    div.innerHTML=`
      <div class="stock-head">
        <span class="s-ticker" style="color:${s.color}">${s.ticker}</span>
        <span class="s-name">${s.name}</span>
        <span class="sector-tag">${s.sector}</span>
        ${ownedQ>0?`<span class="owned-badge">${ownedQ} acc.</span>`:""}
      </div>

      <div class="stock-foot">
        <span class="s-price" style="color:${clr}">${fmt(s.price)}</span>
        <span class="s-change" style="color:${clr}">${fmtPct(chg)}</span>
        <div class="s-sparkline">
          ${sparklineSVG(s.history,clr)}
        </div>
      </div>

      <div class="stock-actions">
        <button class="mini-trade mini-buy"
          data-action="buy"
          ${G.cash<s.price?"disabled":""}>+1</button>

        <button class="mini-trade mini-sell"
          data-action="sell"
          ${ownedQ<=0?"disabled":""}>-1</button>
      </div>
    `;

    div.addEventListener("click",()=>selectStock(s.ticker));

    div.querySelectorAll(".mini-trade").forEach(btn=>{
      btn.addEventListener("click",event=>{
        event.stopPropagation();
        quickTrade(s.ticker,btn.dataset.action);
      });
    });

    container.appendChild(div);
  });
}

function renderTradePanel() {

  const empty=document.getElementById("trade-empty");
  const active=document.getElementById("trade-active");

  if(!empty || !active) return;

  if(!G.selected){
    empty.style.display="block";
    active.style.display="none";
    return;
  }

  empty.style.display="none";
  active.style.display="block";

  const s=G.stocks.find(x=>x.ticker===G.selected);
  if(!s) return;

  const prev=s.history.length>1
    ? s.history[s.history.length-2]
    : s.price;

  const chg=(s.price-prev)/prev*100;
  const up=chg>=0;
  const ownedQ=G.portfolio[s.ticker] || 0;
  const color=up?"var(--green)":"var(--red)";

  const sessionStart=s.history[0] || s.price;
  const sessionPct=(s.price-sessionStart)/sessionStart*100;

  const momentumStart=
    s.history[Math.max(0,s.history.length-6)] || sessionStart;

  const momentumPct=(s.price-momentumStart)/momentumStart*100;

  const low=Math.min(...s.history);
  const high=Math.max(...s.history);

  const avg=G.buyAvg[s.ticker] || s.price;

  const positionPct=
    ownedQ>0
      ? ((s.price-avg)/avg)*100
      : 0;

  const trend=
    momentumPct>1.2
      ?"ALCISTA"
      :momentumPct<-1.2
        ?"BAJISTA"
        :"LATERAL";

  const set=(id,value)=>{
    const el=document.getElementById(id);
    if(el) el.textContent=value;
  };

  set("sel-ticker",s.ticker);
  set("sel-name",s.name);
  set("sel-price",fmt(s.price));
  set("sel-owned",`Tienes ${ownedQ} acc. · Valor: ${fmt(ownedQ*s.price)}`);

  const ticker=document.getElementById("sel-ticker");
  if(ticker) ticker.style.color=s.color;

  const price=document.getElementById("sel-price");
  if(price) price.style.color=color;

  const chart=document.getElementById("detail-chart");
  if(chart) chart.innerHTML=chartSVG(s.history,color);

  set("detail-change",fmtPct(chg));
  set("detail-range",`${fmt(low)} - ${fmt(high)}`);
  set("detail-trend",trend);
  set("detail-session",fmtPct(sessionPct));
  set("detail-position",
    ownedQ>0 ? fmtPct(positionPct) : "SIN POSICION"
  );

  updateCost();

  const buy=document.getElementById("btn-buy");
  const sell=document.getElementById("btn-sell");

  if(buy) buy.disabled=G.cash<s.price;
  if(sell) sell.disabled=ownedQ<=0;

  const hintBox=document.getElementById("hint-box");

  if(hintBox){

    if(G.hint){
      hintBox.style.display="block";
      hintBox.textContent="💡 "+G.hint;
    }else{
      hintBox.style.display="none";
    }
  }
}

function updateCost() {

  if(!G.selected) return;

  const s=G.stocks.find(x=>x.ticker===G.selected);
  const input=document.getElementById("qty-input");

  if(!s || !input) return;

  const qty=parseInt(input.value) || 0;
  const cost=qty*s.price;
  const canBuy=cost<=G.cash;

  const row=document.getElementById("cost-row");

  if(row){
    row.innerHTML=
      `Costo total: <strong class="${canBuy?"green":"red"}">${fmt(cost)}</strong>`;
  }
}

function setQty(value) {

  const input=document.getElementById("qty-input");
  if(!input) return;

  input.value=Math.max(1,Math.floor(value||1));
  updateCost();
}

function maxBuyQty() {

  if(!G.selected) return 1;

  const s=G.stocks.find(x=>x.ticker===G.selected);

  return Math.max(1,Math.floor(G.cash/s.price));
}

function applyQtyPreset(value) {

  if(value==="max"){
    setQty(maxBuyQty());
    return;
  }

  if(value==="half"){
    setQty(Math.max(1,Math.floor(maxBuyQty()/2)));
    return;
  }

  setQty(parseInt(value));
}

function nudgeQty(delta) {

  const input=document.getElementById("qty-input");
  if(!input) return;

  const current=parseInt(input.value)||1;

  setQty(current+delta);
}

function renderPortfolio() {

  const container=document.getElementById("portfolio-list");
  if(!container) return;

  const entries=
    Object.entries(G.portfolio)
      .filter(([,q])=>q>0);

  if(!entries.length){
    container.innerHTML=
      `<div class="empty-msg">Sin acciones todavía</div>`;
    return;
  }

  container.innerHTML="";

  entries.forEach(([ticker,qty])=>{

    const s=G.stocks.find(x=>x.ticker===ticker);

    if(!s) return;

    const val=qty*s.price;
    const avg=G.buyAvg[ticker] || s.price;
    const gl=val-avg*qty;
    const pct=(gl/(avg*qty))*100;

    const row=document.createElement("div");

    row.className="port-row";

    row.innerHTML=`
      <span class="port-ticker" style="color:${s.color}">
        ${ticker}
      </span>

      <span class="port-qty">
        ${qty} acc.
      </span>

      <span class="port-val">
        ${fmt(val)}
      </span>

      <span class="port-gl ${gl>=0?"green":"red"}">
        ${gl>=0?"+":""}${pct.toFixed(1)}%
      </span>
    `;

    container.appendChild(row);
  });
}

function renderStats() {

  const portVal=
    G.stocks.reduce(
      (acc,s)=>acc+(G.portfolio[s.ticker]||0)*s.price,
      0
    );

  const total=G.cash+portVal;

  const rivalTotal=
    portfolioValue(
      G.rival.cash,
      G.rival.port,
      G.stocks
    );

  const progress=Math.min(100,total/GOAL*100);
  const rivalProgress=Math.min(100,rivalTotal/GOAL*100);

  const chgPct=
    (total-START_CASH)/START_CASH*100;

  const set=(id,value)=>{
    const el=document.getElementById(id);
    if(el) el.textContent=value;
  };

  set("stat-cash",fmt(G.cash));
  set("stat-port",fmt(portVal));
  set("stat-total",fmt(total));
  set("stat-turn",`${G.turn}/${G.maxTurns}`);

  set("race-you-val",fmt(total));
  set("race-you-pct",
    `${progress.toFixed(1)}% (${fmtPct(chgPct)})`
  );

  set("race-rival-val",fmt(rivalTotal));
  set("race-rival-pct",
    rivalProgress.toFixed(1)+"%"
  );

  set("qs-cash",fmt(G.cash));
  set("qs-rival",fmt(rivalTotal));
  set("qs-goal",fmt(Math.max(0,GOAL-total)));

  const barYou=document.getElementById("bar-you");
  const barRival=document.getElementById("bar-rival");

  if(barYou) barYou.style.width=progress+"%";
  if(barRival) barRival.style.width=rivalProgress+"%";
}

function renderMarketTape() {

  const track=document.getElementById("ticker-track");
  if(!track) return;

  const items=G.stocks.map(s=>{

    const prev=
      s.history.length>1
        ? s.history[s.history.length-2]
        : s.price;

    const chg=(s.price-prev)/prev*100;
    const up=chg>=0;

    return `
      <span class="ticker-chip ${up?"up":"down"}">
        <strong>${s.ticker}</strong>
        <span>${fmt(s.price)}</span>
        <em>${fmtPct(chg)}</em>
      </span>
    `;
  }).join("");

  track.innerHTML=items+items;
}

function renderEvent() {

  const banner=document.getElementById("event-banner");
  if(!banner) return;

  if(G.activeEvent){

    banner.style.display="block";

    banner.innerHTML=`
      <strong>${G.activeEvent.name}</strong>
      — ${G.activeEvent.desc}
    `;

    showNews(G.activeEvent);

  }else{

    banner.style.display="none";
  }
}

function renderLog() {

  const container=document.getElementById("log-list");
  if(!container) return;

  container.innerHTML="";

  G.log.forEach(entry=>{

    const div=document.createElement("div");

    div.className="log-entry "+entry.type;

    div.innerHTML=`
      <span class="log-turn">
        T${entry.turn}
      </span>
      ${entry.msg}
    `;

    container.appendChild(div);
  });
}

function renderAll() {

  renderStats();
  renderMarketTape();
  renderStocks();
  renderTradePanel();
  renderPortfolio();
  renderEvent();
  renderLog();
}

function selectStock(ticker) {

  G.selected=ticker;

  renderStocks();
  renderTradePanel();
}

function addLog(msg,type="info") {

  G.log.unshift({
    msg,
    type,
    turn:G.turn
  });

  if(G.log.length>60){
    G.log.pop();
  }
}

function pulseInterface(type) {

  document.body.classList.remove(
    "pulse-buy",
    "pulse-sell",
    "pulse-turn"
  );

  void document.body.offsetWidth;

  document.body.classList.add(`pulse-${type}`);

  setTimeout(()=>{
    document.body.classList.remove(`pulse-${type}`);
  },520);
}

function quickTrade(ticker,type) {

  const s=G.stocks.find(x=>x.ticker===ticker);

  if(!s) return;

  G.selected=ticker;

  if(type==="buy"){

    if(G.cash<s.price){
      showToast("Fondos insuficientes","var(--red)");
      return;
    }

    G.cash-=s.price;

    const prevQ=G.portfolio[ticker]||0;
    const prevAvg=G.buyAvg[ticker]||s.price;

    G.buyAvg[ticker]=
      (prevAvg*prevQ+s.price)/(prevQ+1);

    G.portfolio[ticker]=prevQ+1;

    G.operations++;

    addLog(
      `COMPRA RAPIDA: 1x ${ticker} @ ${fmt(s.price)}`,
      "buy"
    );

    showToast(`+1 ${ticker}`,"var(--green)");

    pulseInterface("buy");

  }else{

    const owned=G.portfolio[ticker]||0;

    if(owned<=0){
      showToast("No tienes acciones","var(--red)");
      return;
    }

    G.cash+=s.price;

    G.portfolio[ticker]=owned-1;

    if(G.portfolio[ticker]<=0){
      delete G.portfolio[ticker];
    }

    G.operations++;

    addLog(
      `VENTA RAPIDA: 1x ${ticker} @ ${fmt(s.price)}`,
      "sell"
    );

    showToast(
      `${fmt(s.price)} recibidos`,
      "var(--blue)"
    );

    pulseInterface("sell");
  }

  renderAll();
}

function executeTrade(type) {

  if(!G.selected) return;

  const s=G.stocks.find(x=>x.ticker===G.selected);
  const qty=parseInt(
    document.getElementById("qty-input").value
  )||0;

  if(qty<=0) return;

  if(type==="buy"){

    const cost=qty*s.price;

    if(cost>G.cash){
      showToast(
        "Fondos insuficientes",
        "var(--red)"
      );
      return;
    }

    G.cash-=cost;

    const prevQ=G.portfolio[s.ticker]||0;
    const prevAvg=G.buyAvg[s.ticker]||s.price;

    G.buyAvg[s.ticker]=
      (prevAvg*prevQ+s.price*qty)/(prevQ+qty);

    G.portfolio[s.ticker]=prevQ+qty;

    addLog(
      `COMPRA: ${qty}× ${s.ticker} @ ${fmt(s.price)} = ${fmt(cost)}`,
      "buy"
    );

    showToast(
      `+${qty} ${s.ticker} compradas`,
      "var(--green)"
    );

    pulseInterface("buy");

  }else{

    const owned=G.portfolio[s.ticker]||0;

    if(qty>owned){
      showToast(
        "No tienes suficientes acciones",
        "var(--red)"
      );
      return;
    }

    const revenue=qty*s.price;

    G.cash+=revenue;

    G.portfolio[s.ticker]=owned-qty;

    if(G.portfolio[s.ticker]<=0){
      delete G.portfolio[s.ticker];
    }

    addLog(
      `VENTA: ${qty}× ${s.ticker} @ ${fmt(s.price)} = ${fmt(revenue)}`,
      "sell"
    );

    showToast(
      `${fmt(revenue)} recibidos`,
      "var(--blue)"
    );

    pulseInterface("sell");
  }

  G.operations++;

  renderAll();
}

function nextTurn() {

  if(paused) return;

  G.turn++;

  G.activeEvent=null;

  if(G.eventCooldown>0){

    G.eventCooldown--;

  }else{

    const prob=
      G.diff==="hard"
        ? .55
        : G.diff==="normal"
          ? .40
          : .28;

    if(Math.random()<prob){

      G.activeEvent=
        EVENTS[Math.floor(Math.random()*EVENTS.length)];

      G.eventCooldown=2;
      G.events++;

      addLog(
        `${G.activeEvent.name}: ${G.activeEvent.desc}`,
        "event"
      );
    }
  }

  G.hint=null;

  if(
    G.diff!=="hard" &&
    Math.random()<.35
  ){
    G.hint=
      HINTS[Math.floor(Math.random()*HINTS.length)];
  }

  G.stocks=G.stocks.map(s=>{

    let change=
      (Math.random()-.5)*2*s.vol;

    if(
      G.activeEvent &&
      G.activeEvent.effect[s.ticker]!==undefined
    ){
      change+=G.activeEvent.effect[s.ticker];
    }

    const newPrice=
      Math.max(1,s.price*(1+change));

    return {
      ...s,
      price:newPrice,
      history:[
        ...s.history,
        newPrice
      ].slice(-20)
    };
  });

  G.rival=
    rivalAI(
      G.rival,
      G.stocks,
      G.diff
    );

  const rivalTotal=
    portfolioValue(
      G.rival.cash,
      G.rival.port,
      G.stocks
    );

  addLog(
    `🤖 IA opera · total rival: ${fmt(rivalTotal)}`,
    "rival"
  );

  pulseInterface("turn");

  renderAll();

  checkEndGame();
}

function rivalAI(rivalState, stocks, diff) {

  let {
    cash,
    port,
    buyAvg
  } = rivalState;

  const aggressiveness =
    diff === "hard"
      ? 0.88
      : diff === "normal"
        ? 0.68
        : 0.38;

  const analyzedStocks = stocks.map(s => {

    const history = s.history || [];
    const current = s.price;
    const previous =
      history.length > 1
        ? history[history.length - 2]
        : current;
    const old =
      history.length > 6
        ? history[history.length - 6]
        : history[0] || current;

    const shortTrend =
      previous > 0
        ? (current - previous) / previous
        : 0;

    const mediumTrend =
      old > 0
        ? (current - old) / old
        : 0;

    let score =
      shortTrend * 2 +
      mediumTrend * 1.5;

    if (mediumTrend < -0.08) {
      score += 0.04;
    }

    score += Math.random() * 0.025;

    return {
      ...s,
      aiScore: score
    };
  });

  stocks.forEach(s => {

    const owned =
      port[s.ticker] || 0;

    if (owned <= 0) return;

    const avg =
      buyAvg[s.ticker] || s.price;

    const profit =
      avg > 0
        ? (s.price - avg) / avg
        : 0;

    const losing =
      profit < -0.10;

    const profitable =
      profit > 0.12;

    const shouldSell =
      losing ||
      (
        profitable &&
        Math.random() <
          (
            diff === "hard"
              ? 0.28
              : diff === "normal"
                ? 0.18
                : 0.08
          )
      );

    if (!shouldSell) return;

    const percentage =
      diff === "hard"
        ? 0.35 + Math.random() * 0.45
        : diff === "normal"
          ? 0.25 + Math.random() * 0.40
          : 0.20 + Math.random() * 0.30;

    const sellQ =
      Math.max(
        1,
        Math.floor(owned * percentage)
      );

    cash +=
      sellQ * s.price;

    port = {
      ...port,
      [s.ticker]:
        owned - sellQ
    };

    if (port[s.ticker] <= 0) {
      delete port[s.ticker];
    }
  });

  if (Math.random() < aggressiveness) {

    const sorted =
      [...analyzedStocks]
        .sort(
          (a, b) =>
            b.aiScore - a.aiScore
        );

    let target;

    if (diff === "hard") {
      target = sorted[0];
    } else if (diff === "normal") {
      target =
        sorted[
          Math.random() < 0.75
            ? 0
            : Math.min(
                1,
                sorted.length - 1
              )
        ];
    } else {
      target =
        sorted[
          Math.floor(
            Math.random() *
            Math.min(3, sorted.length)
          )
        ];
    }

    if (!target) {
      return {
        cash,
        port,
        buyAvg
      };
    }

    const budgetPercent =
      diff === "hard"
        ? 0.35 + Math.random() * 0.30
        : diff === "normal"
          ? 0.28 + Math.random() * 0.27
          : 0.20 + Math.random() * 0.25;

    const budget =
      cash * budgetPercent;

    const qty =
      Math.floor(
        budget / target.price
      );

    if (
      qty > 0 &&
      cash >= qty * target.price
    ) {

      const oldQty =
        port[target.ticker] || 0;

      const oldAvg =
        buyAvg[target.ticker] ||
        target.price;

      const newAvg =
        oldQty > 0
          ? (
              oldAvg * oldQty +
              target.price * qty
            ) /
            (oldQty + qty)
          : target.price;

      cash -=
        qty * target.price;

      port = {
        ...port,
        [target.ticker]:
          oldQty + qty
      };

      buyAvg = {
        ...buyAvg,
        [target.ticker]:
          newAvg
      };
    }
  }

  return {
    cash,
    port,
    buyAvg
  };
}

function checkEndGame() {

  const portVal=
    G.stocks.reduce(
      (acc,s)=>
        acc+
        (G.portfolio[s.ticker]||0)*s.price,
      0
    );

  const total=G.cash+portVal;

  const rivalTotal=
    portfolioValue(
      G.rival.cash,
      G.rival.port,
      G.stocks
    );

  if(total>=GOAL){

    finishGame(
      true,
      total,
      rivalTotal,
      `¡Alcanzaste ${fmt(total)} en el turno ${G.turn}!\nLa IA quedó en ${fmt(rivalTotal)}.`
    );

  }else if(total<=0){

    finishGame(
      false,
      total,
      rivalTotal,
      `Te quedaste sin capital en el turno ${G.turn}.\nLa IA terminó con ${fmt(rivalTotal)}.`
    );

  }else if(rivalTotal>=GOAL){

    finishGame(
      false,
      total,
      rivalTotal,
      `La IA llegó primero a ${fmt(rivalTotal)}.\nTú tenías ${fmt(total)}.`
    );

  }else if(G.turn>=G.maxTurns){

    const won=total>rivalTotal;

    const msg=won
      ? `Tiempo agotado. ¡Ganaste por capital!\nTú: ${fmt(total)} · IA: ${fmt(rivalTotal)}`
      : `Tiempo agotado. La IA ganó por capital.\nTú: ${fmt(total)} · IA: ${fmt(rivalTotal)}`;

    finishGame(
      won,
      total,
      rivalTotal,
      msg
    );
  }
}

function finishGame(won,myTotal,rivalTotal,text){

  endGuidedTutorial();
  closeQuickHelp();
  closeTutorial();

  stats.games++;

  if(won){
    stats.wins++;
  }else{
    stats.losses++;
  }

  if(myTotal>stats.best){
    stats.best=myTotal;
  }

  localStorage.setItem(
    "stockWarsStats",
    JSON.stringify(stats)
  );

  showEndOverlay(
    won,
    myTotal,
    rivalTotal,
    text
  );
}

function showToast(message,color="var(--blue)") {
  
  let toast = document.getElementById("game-toast");
  
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "game-toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 10000;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.style.color = color;
  toast.style.opacity = "1";
  
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  
  toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
  }, 2000);
}

function setOverlayVisibility(id, visible) {
  const overlay = document.getElementById(id);
  if(!overlay) return;

  // Limpiar cualquier estado anterior
  overlay.classList.remove("show");
  
  // Forzar reflow para reiniciar animaciones
  void overlay.offsetWidth;
  
  if(visible) {
    // Mostrar el overlay
    overlay.style.display = "flex";
    overlay.style.visibility = "visible";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    overlay.style.zIndex = "1000";
    
    // Agregar clase show después de un pequeño delay
    requestAnimationFrame(() => {
      overlay.classList.add("show");
    });
    
    // Prevenir scroll del body cuando el overlay está abierto
    document.body.style.overflow = "hidden";
  } else {
    // Ocultar el overlay
    overlay.classList.remove("show");
    
    // Esperar a que termine la transición si existe
    const transitionDuration = 300;
    
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.style.visibility = "hidden";
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      
      // Solo restaurar el scroll si no hay otros overlays abiertos
      const anyOverlayOpen = 
        document.getElementById("quick-help-overlay")?.classList.contains("show") ||
        document.getElementById("tutorial-overlay")?.classList.contains("show");
      
      if(!anyOverlayOpen) {
        document.body.style.overflow = "";
      }
    }, transitionDuration);
  }
}

function clearTutorialFocus() {
  // Limpiar todas las clases de foco del tutorial y guía
  document.querySelectorAll(
    ".tutorial-focus, .guided-focus, .tutorial-highlight, .guided-highlight"
  ).forEach(el => {
    el.classList.remove(
      "tutorial-focus", 
      "guided-focus", 
      "tutorial-highlight", 
      "guided-highlight"
    );
    
    // Restaurar estilos originales si fueron modificados
    el.style.zIndex = "";
    el.style.position = "";
    el.style.boxShadow = "";
    el.style.border = "";
  });
  
  // Limpiar cualquier backdrop o elemento temporal
  document.querySelectorAll(
    ".tutorial-backdrop, .guided-backdrop"
  ).forEach(el => el.remove());
  
  // Restaurar el scroll del body
  document.body.style.overflow = "";
  document.body.style.pointerEvents = "";
}

function renderTutorialStep() {
  const step = TUTORIAL_STEPS[tutorialIndex];
  const content = document.getElementById("tutorial-step-content");
  const label = document.getElementById("tutorial-step-label");
  const kicker = document.getElementById("tutorial-step-kicker");
  const bar = document.getElementById("tutorial-progress-bar");
  const prev = document.getElementById("btn-tutorial-prev");
  const next = document.getElementById("btn-tutorial-next");
  const start = document.getElementById("btn-tutorial-start");

  if(!step || !content) return;

  if(label) label.textContent = `PASO ${tutorialIndex + 1} DE ${TUTORIAL_STEPS.length}`;
  if(kicker) kicker.innerHTML = step.kicker;
  if(bar) bar.style.width = `${((tutorialIndex + 1) / TUTORIAL_STEPS.length) * 100}%`;

  content.innerHTML = `
    <div class="tutorial-title-row">
      <div class="tutorial-title-marker">SW</div>
      <div><h2 id="tutorial-title">${step.title}</h2><span>PROTOCOLO DE APRENDIZAJE // ${String(tutorialIndex + 1).padStart(2,"0")}</span></div>
    </div>
    <div class="tutorial-content-body">${step.content}</div>
  `;

  clearTutorialFocus();
  (step.focus || []).forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.classList.add("tutorial-focus"));
  });

  if(prev) prev.disabled = tutorialIndex === 0;
  if(next) next.style.display = tutorialIndex === TUTORIAL_STEPS.length - 1 ? "none" : "inline-flex";
  if(start) start.style.display = tutorialIndex === TUTORIAL_STEPS.length - 1 ? "inline-flex" : "none";
}

function openTutorial(startAt = 0) {
  tutorialIndex = Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, startAt));
  localStorage.setItem(TUTORIAL_SEEN_KEY, "1");
  endGuidedTutorial();
  setOverlayVisibility("quick-help-overlay", false);
  setOverlayVisibility("tutorial-overlay", true);
  renderTutorialStep();
}

function closeTutorial() {
  // Limpiar cualquier foco del tutorial
  clearTutorialFocus();
  
  // Ocultar el overlay del tutorial
  setOverlayVisibility("tutorial-overlay", false);
  
  // Asegurar que los botones del tutorial no queden con listeners activos
  const tutorialButtons = [
    "btn-tutorial-prev",
    "btn-tutorial-next",
    "btn-tutorial-start",
    "btn-tutorial-close",
    "btn-tutorial-skip"
  ];
  
  tutorialButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if(btn) {
      btn.disabled = false;
      btn.style.pointerEvents = "";
    }
  });
  
  // Verificar que no queden overlays de ayuda abiertos
  const helpOverlay = document.getElementById("quick-help-overlay");
  if(helpOverlay && helpOverlay.classList.contains("show")) {
    setOverlayVisibility("quick-help-overlay", false);
  }
}

function nextTutorialStep() {
  if(tutorialIndex < TUTORIAL_STEPS.length - 1) {
    tutorialIndex++;
    renderTutorialStep();
  }
}

function prevTutorialStep() {
  if(tutorialIndex > 0) {
    tutorialIndex--;
    renderTutorialStep();
  }
}

function ensureGameInteractivity() {
  // Verificar que no haya overlays bloqueando
  const overlays = [
    "tutorial-overlay",
    "quick-help-overlay",
    "guided-tour"
  ];
  
  let anyBlocking = false;
  
  overlays.forEach(id => {
    const overlay = document.getElementById(id);
    if(overlay && overlay.style.display !== "none") {
      // Verificar si realmente está visible
      const rect = overlay.getBoundingClientRect();
      if(rect.width > 0 && rect.height > 0) {
        anyBlocking = true;
      }
    }
  });
  
  if(anyBlocking) {
    console.warn("Hay overlays bloqueando la interfaz del juego");
    
    // Forzar cierre de todos los overlays
    closeTutorial();
    closeQuickHelp();
    endGuidedTutorial();
  }
  
  // Verificar que los botones principales estén habilitados
  const criticalButtons = [
    "btn-buy",
    "btn-sell",
    "btn-turn",
    "btn-pause"
  ];
  
  criticalButtons.forEach(id => {
    const btn = document.getElementById(id);
    if(btn) {
      btn.style.pointerEvents = "";
      btn.disabled = false;
    }
  });
}

function endTutorial() {
  localStorage.setItem(TUTORIAL_COMPLETED_KEY, "1");
  
  // Cerrar tutorial de forma segura
  closeTutorial();
  
  // Iniciar juego si es necesario
  if(!G || !G.stocks || !G.stocks.length) {
    setTimeout(() => {
      startGame();
      
      // Asegurar que la interfaz del juego esté completamente interactiva
      setTimeout(() => {
        ensureGameInteractivity();
      }, 100);
    }, 200);
  } else {
    showToast("Tutorial completado. El mercado te espera.", "var(--green)");
    
    // Asegurar que la interfaz del juego esté completamente interactiva
    setTimeout(() => {
      ensureGameInteractivity();
    }, 100);
  }
}

function openQuickHelp() {
  closeTutorial();
  setOverlayVisibility("quick-help-overlay", true);
}

function closeQuickHelp() {
  setOverlayVisibility("quick-help-overlay", false);
}

function positionGuidedCard() {
  const step = GUIDED_STEPS[guidedIndex];
  const tour = document.getElementById("guided-tour");
  const card = document.getElementById("guided-card");

  if (!step || !tour || !card) return;

  const target = document.querySelector(step.target);

  if (!target) {
    card.style.top = "50%";
    card.style.left = "50%";
    card.style.transform = "translate(-50%, -50%)";
    return;
  }

  const margin = 18;
  const gap = 16;

  const rect = target.getBoundingClientRect();

  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;

  let left = rect.left + rect.width / 2 - cardWidth / 2;

  if (left < margin) {
    left = margin;
  }

  if (left + cardWidth > window.innerWidth - margin) {
    left = window.innerWidth - cardWidth - margin;
  }

  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  let top;

  if (spaceBelow >= cardHeight + gap) {
    top = rect.bottom + gap;
  } else if (spaceAbove >= cardHeight + gap) {
    top = rect.top - cardHeight - gap;
  } else {
    top = Math.max(
      margin,
      Math.min(
        window.innerHeight - cardHeight - margin,
        rect.top + rect.height / 2 - cardHeight / 2
      )
    );
  }

  card.style.transform = "none";
  card.style.top = `${top}px`;
  card.style.left = `${left}px`;
}

function renderGuidedStep() {

  const step = GUIDED_STEPS[guidedIndex];

  const tour = document.getElementById("guided-tour");
  const card = document.getElementById("guided-card");

  const eyebrow =
    document.getElementById("guided-eyebrow");

  const title =
    document.getElementById("guided-title");

  const text =
    document.getElementById("guided-text");

  const next =
    document.getElementById("btn-guided-next");

  if (!step || !tour || !card) return;

  tour.style.display = "block";
  tour.style.pointerEvents = "auto";
  tour.style.visibility = "visible";
  tour.style.opacity = "1";

  clearTutorialFocus();

  if (eyebrow) {
    eyebrow.textContent =
      `GUÍA ${guidedIndex + 1}/${GUIDED_STEPS.length}`;
  }

  if (title) {
    title.innerHTML = step.title;
  }

  if (text) {
    text.innerHTML = step.text;
  }

  if (next) {
    next.innerHTML =
      guidedIndex === GUIDED_STEPS.length - 1
        ? "TERMINAR"
        : "SIGUIENTE →";
  }

  const target =
    document.querySelector(step.target);

  if (target) {
    target.classList.add("guided-focus");

    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });

    setTimeout(() => {
      positionGuidedCard();
    }, 350);
  } else {
    positionGuidedCard();
  }

  card.classList.remove("guided-animate");

  void card.offsetWidth;

  card.classList.add("guided-animate");
}

function startGuidedTutorial() {

  if (!G || !G.stocks || !G.stocks.length) {
    showToast(
      "Inicia una partida para usar la guía visual.",
      "var(--amber)"
    );
    return;
  }

  guidedIndex = 0;

  localStorage.setItem(
    GUIDED_SEEN_KEY,
    "1"
  );

  closeQuickHelp();
  closeTutorial();

  renderGuidedStep();

  window.addEventListener(
    "resize",
    positionGuidedCard
  );

  window.addEventListener(
    "scroll",
    positionGuidedCard,
    true
  );

  if (guidedResizeObserver) {
    guidedResizeObserver.disconnect();
  }

  guidedResizeObserver =
    new ResizeObserver(() => {
      positionGuidedCard();
    });

  guidedResizeObserver.observe(
    document.getElementById("guided-card")
  );
}

function nextGuidedStep() {

  if (
    guidedIndex >=
    GUIDED_STEPS.length - 1
  ) {
    endGuidedTutorial();
    return;
  }

  guidedIndex++;

  renderGuidedStep();
}

function endGuidedTutorial() {

  const tour =
    document.getElementById("guided-tour");

  const card =
    document.getElementById("guided-card");

  if (tour) {
    tour.style.display = "none";
    tour.style.pointerEvents = "none";
    tour.style.visibility = "hidden";
    tour.style.opacity = "0";
  }

  if (card) {
    card.style.top = "";
    card.style.left = "";
    card.style.transform = "";
  }

  clearTutorialFocus();

  window.removeEventListener(
    "resize",
    positionGuidedCard
  );

  window.removeEventListener(
    "scroll",
    positionGuidedCard,
    true
  );

  if (guidedResizeObserver) {
    guidedResizeObserver.disconnect();
    guidedResizeObserver = null;
  }
}

function showNews(event){

  const news=document.getElementById("news-banner") || document.getElementById("breaking-news");

  if(!news) return;

  news.innerHTML=`
    <span class="breaking-label">BREAKING NEWS</span>
    <strong>${event.name}</strong>
    <span>${event.desc}</span>
  `;

  news.classList.remove("news-show");

  void news.offsetWidth;

  news.classList.add("news-show");

  setTimeout(()=>{
    news.classList.remove("news-show");
  },5000);
}

function showEndOverlay(
  won,
  myTotal,
  rivalTotal,
  subText
){

  const overlay=
    document.getElementById("overlay");

  if(!overlay) return;

  const box=
    overlay.querySelector(".overlay-box");

  const icon=
    document.getElementById("ov-icon");

  const title=
    document.getElementById("ov-title");

  const sub=
    document.getElementById("ov-sub");

  if(icon) icon.textContent=won?"🏆":"💀";

  if(title){

    title.textContent=
      won
        ?"¡GANASTE!"
        :"GAME OVER";

    title.className=
      "overlay-title "+
      (won?"win":"lose");
  }

  if(sub){
    sub.textContent=subText;
  }

  if(box){
    box.className=
      "overlay-box "+
      (won?"win":"lose");
  }

  overlay.style.display="flex";
  overlay.style.pointerEvents="auto";
  overlay.style.visibility="visible";
  overlay.style.opacity="1";
  overlay.classList.add("show");
}

function showScreen(id){

  document
    .querySelectorAll(".screen")
    .forEach(s=>
      s.classList.remove("active")
    );

  const screen=
    document.getElementById(id);

  if(screen){
    screen.classList.add("active");
  }
}

function startGame(){

  const active=
    document.querySelector(
      ".diff-btn.active"
    );

  const diff=
    active?.dataset.diff ||
    "normal";

  G=createState(diff);

  paused=false;

  showScreen("screen-game");

  renderAll();

  showToast(
    "MERCADO ABIERTO",
    "var(--green)"
  );
}

function restartGame(){

  const overlay=
    document.getElementById("overlay");

  if(overlay){
    overlay.style.display="none";
    overlay.style.pointerEvents="none";
    overlay.style.visibility="hidden";
    overlay.style.opacity="0";
    overlay.classList.remove("show");
  }

  paused=false;

  showScreen("screen-intro");
}

function togglePause(){

  if(!G || !G.stocks) return;

  paused=!paused;

  const menu=
    document.getElementById("pause-menu") ||
    document.getElementById("pause-overlay");

  if(menu){
    menu.style.display=
      paused
        ?"flex"
        :"none";
    
    menu.style.pointerEvents=
      paused
        ?"auto"
        :"none";
    
    menu.style.visibility=
      paused
        ?"visible"
        :"hidden";
    
    menu.style.opacity=
      paused
        ?"1"
        :"0";
  }

  const pauseBtn=
    document.getElementById("btn-pause");

  if(pauseBtn){
    pauseBtn.textContent=
      paused
        ?"▶ CONTINUAR"
        :"Ⅱ PAUSA";
  }
}

function restartCurrentGame(){

  const diff=G.diff;

  paused=false;

  const menu=
    document.getElementById("pause-menu") ||
    document.getElementById("pause-overlay");

  if(menu){
    menu.style.display="none";
    menu.style.pointerEvents="none";
    menu.style.visibility="hidden";
    menu.style.opacity="0";
  }

  G=createState(diff);

  renderAll();
}

function showPersistentStats(){

  showToast(
    `Partidas: ${stats.games} · Victorias: ${stats.wins} · Mejor: ${fmt(stats.best)}`,
    "var(--amber)"
  );
}

document.addEventListener(
  "DOMContentLoaded",
  ()=>{

    const tutorialButton=document.getElementById("btn-tutorial");
    if(tutorialButton){
      tutorialButton.addEventListener("click",()=>openTutorial());
    }

    const tutorialClose=document.getElementById("btn-tutorial-close");
    if(tutorialClose){
      tutorialClose.addEventListener("click",closeTutorial);
    }

    const tutorialSkip=document.getElementById("btn-tutorial-skip");
    if(tutorialSkip){
      tutorialSkip.addEventListener("click",closeTutorial);
    }

    const tutorialPrev=document.getElementById("btn-tutorial-prev");
    if(tutorialPrev){
      tutorialPrev.addEventListener("click",prevTutorialStep);
    }

    const tutorialNext=document.getElementById("btn-tutorial-next");
    if(tutorialNext){
      tutorialNext.addEventListener("click",nextTutorialStep);
    }

    const tutorialStart=document.getElementById("btn-tutorial-start");
    if(tutorialStart){
      tutorialStart.addEventListener("click",endTutorial);
    }

    const tutorialOverlay=document.getElementById("tutorial-overlay");
    if(tutorialOverlay){
      tutorialOverlay.addEventListener("click",event=>{
        if(event.target===tutorialOverlay) closeTutorial();
      });
    }

    const helpButton=document.getElementById("btn-help");
    if(helpButton){
      helpButton.addEventListener("click",openQuickHelp);
    }

    const guidedButton=document.getElementById("btn-guided");
    if(guidedButton){
      guidedButton.addEventListener("click",startGuidedTutorial);
    }

    const helpClose=document.getElementById("btn-help-close");
    if(helpClose){
      helpClose.addEventListener("click",closeQuickHelp);
    }

    const helpTutorial=document.getElementById("btn-help-tutorial");
    if(helpTutorial){
      helpTutorial.addEventListener("click",()=>openTutorial());
    }

    const helpGuided=document.getElementById("btn-help-guided");
    if(helpGuided){
      helpGuided.addEventListener("click",startGuidedTutorial);
    }

    const helpOverlay=document.getElementById("quick-help-overlay");
    if(helpOverlay){
      helpOverlay.addEventListener("click",event=>{
        if(event.target===helpOverlay) closeQuickHelp();
      });
    }

    const guidedNext=document.getElementById("btn-guided-next");
    if(guidedNext){
      guidedNext.addEventListener("click",nextGuidedStep);
    }

    const guidedClose=document.getElementById("btn-guided-close");
    if(guidedClose){
      guidedClose.addEventListener("click",endGuidedTutorial);
    }

    if(!localStorage.getItem(TUTORIAL_SEEN_KEY)){
      setTimeout(()=>{
        const intro=document.getElementById("screen-intro");
        if(intro && intro.classList.contains("active")) openTutorial();
      },350);
    }

    document
      .querySelectorAll(".diff-btn")
      .forEach(btn=>{

        btn.addEventListener(
          "click",
          ()=>{

            document
              .querySelectorAll(".diff-btn")
              .forEach(b=>
                b.classList.remove("active")
              );

            btn.classList.add("active");
          }
        );
      });

    const start=
      document.getElementById("btn-start");

    if(start){
      start.addEventListener(
        "click",
        startGame
      );
    }

    const turn=
      document.getElementById("btn-turn");

    if(turn){
      turn.addEventListener(
        "click",
        nextTurn
      );
    }

    const buy=
      document.getElementById("btn-buy");

    if(buy){
      buy.addEventListener(
        "click",
        ()=>executeTrade("buy")
      );
    }

    const sell=
      document.getElementById("btn-sell");

    if(sell){
      sell.addEventListener(
        "click",
        ()=>executeTrade("sell")
      );
    }

    const input=
      document.getElementById("qty-input");

    if(input){
      input.addEventListener(
        "input",
        updateCost
      );
    }

    document
      .querySelectorAll(".qty-step")
      .forEach(btn=>{

        btn.addEventListener(
          "click",
          ()=>{
            nudgeQty(
              parseInt(btn.dataset.step)
            );
          }
        );
      });

    document
      .querySelectorAll(".qty-preset")
      .forEach(btn=>{

        btn.addEventListener(
          "click",
          ()=>{
            applyQtyPreset(
              btn.dataset.qty
            );
          }
        );
      });

    const restart=
      document.getElementById("btn-restart");

    if(restart){
      restart.addEventListener(
        "click",
        restartGame
      );
    }

    const pause=
      document.getElementById("btn-pause");

    if(pause){
      pause.addEventListener(
        "click",
        togglePause
      );
    }

    const continueBtn=
      document.getElementById("btn-continue");

    if(continueBtn){
      continueBtn.addEventListener(
        "click",
        togglePause
      );
    }

    const pauseRestart=
      document.getElementById(
        "btn-pause-restart"
      );

    if(pauseRestart){
      pauseRestart.addEventListener(
        "click",
        restartCurrentGame
      );
    }

    const pauseMenuBtn=
      document.getElementById(
        "btn-pause-menu"
      );

    if(pauseMenuBtn){
      pauseMenuBtn.addEventListener(
        "click",
        ()=>{
          paused=false;

          const menu=
            document.getElementById(
              "pause-menu"
            );

          if(menu){
            menu.style.display="none";
            menu.style.pointerEvents="none";
            menu.style.visibility="hidden";
            menu.style.opacity="0";
          }

          showScreen("screen-intro");
        }
      );
    }

    document.addEventListener(
      "keydown",
      event=>{

        const tag=
          document.activeElement?.tagName;

        const typing=
          tag==="INPUT" ||
          tag==="TEXTAREA";

        if(typing) return;

        const tutorialOpen=document.getElementById("tutorial-overlay")?.classList.contains("show");
        const helpOpen=document.getElementById("quick-help-overlay")?.classList.contains("show");
        const guidedOpen=document.getElementById("guided-tour")?.style.display==="block";

        if(tutorialOpen){
          if(event.key==="Escape") closeTutorial();
          return;
        }

        if(helpOpen){
          if(event.key==="Escape") closeQuickHelp();
          return;
        }

        if(guidedOpen && event.key==="Escape"){
          endGuidedTutorial();
          return;
        }

        if(event.key==="Escape"){
          event.preventDefault();
          togglePause();
        }

        if(event.key==="Enter"){
          event.preventDefault();

          if(
            G &&
            G.stocks &&
            !paused
          ){
            nextTurn();
          }
        }

        if(
          event.key.toLowerCase()==="b" &&
          G &&
          G.selected &&
          !paused
        ){
          executeTrade("buy");
        }

        if(
          event.key.toLowerCase()==="s" &&
          G &&
          G.selected &&
          !paused
        ){
          executeTrade("sell");
        }
      }
    );
  }
);