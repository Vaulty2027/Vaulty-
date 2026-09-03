/* ═══════════════════════════════════════════════════
   STOCK WARS — Juego_2.js (ES/EN)
   ═══════════════════════════════════════════════════ */
"use strict";

/* ── MOTOR DE IDIOMA ─────────────────────────────── */
const LANGS = ["es", "en"];

function langActual() {
  const g = localStorage.getItem("lang");
  return LANGS.includes(g) ? g : "es";
}

function T(f) {
  if (f == null) return "";
  if (typeof f !== "object") return String(f);
  return f[langActual()] ?? f.es ?? "";
}

/* ── TEXTOS FIJOS DEL HTML ───────────────────────── */
const TRAD = {
  ".intro-title": ["MERCADO DE<br><span class=\"title-accent\">ACCIONES</span>", "STOCK<br><span class=\"title-accent\">MARKET</span>", "html"],
  ".intro-tagline": ["Invierte, especula y supera a la IA rival.<br>Llega a $20,000 antes que ella.", "Invest, speculate and beat the rival AI.<br>Reach $20,000 before it does.", "html"],
  ".rules-box .section-label": ["REGLAS", "RULES"],
  ".rules-box .rule-row:nth-child(2)": ["<span class=\"rule-icon\">$</span>Empiezas con $10,000 en efectivo", "<span class=\"rule-icon\">$</span>You start with $10,000 in cash", "html"],
  ".rules-box .rule-row:nth-child(3)": ["<span class=\"rule-icon\">→</span>Compra y vende acciones cada turno", "<span class=\"rule-icon\">→</span>Buy and sell shares every turn", "html"],
  ".rules-box .rule-row:nth-child(4)": ["<span class=\"rule-icon\">!</span>Eventos y noticias sacuden el mercado", "<span class=\"rule-icon\">!</span>Events and news shake the market", "html"],
  ".rules-box .rule-row:nth-child(5)": ["<span class=\"rule-icon\">🤖</span>La IA rival invierte al mismo tiempo", "<span class=\"rule-icon\">🤖</span>The rival AI invests at the same time", "html"],
  ".rules-box .rule-row:nth-child(6)": ["<span class=\"rule-icon\">🏆</span>Gana quien llega primero a $20,000", "<span class=\"rule-icon\">🏆</span>First to reach $20,000 wins", "html"],
  ".rules-box .rule-row:nth-child(7)": ["<span class=\"rule-icon\">☠</span>Si tu capital cae a $0, pierdes", "<span class=\"rule-icon\">☠</span>If your capital drops to $0, you lose", "html"],
  "#btn-tutorial": ["¿CÓMO JUGAR?", "HOW TO PLAY?"],
  "#btn-continue-intro": ["⏩ CONTINUAR PARTIDA", "⏩ CONTINUE GAME"],
  ".diff-label": ["DIFICULTAD", "DIFFICULTY"],
  ".diff-btn[data-diff='easy']": ["Fácil", "Easy"],
  ".diff-btn[data-diff='normal']": ["Normal", "Normal"],
  ".diff-btn[data-diff='hard']": ["Difícil", "Hard"],
  "#btn-start": ["INICIAR MERCADO ▶", "START MARKET ▶"],
  "#btn-help": ["? AYUDA", "? HELP"],
  ".topbar > .stat-pill:nth-child(3) .stat-label": ["Efectivo", "Cash"],
  ".topbar > .stat-pill:nth-child(4) .stat-label": ["Portafolio", "Portfolio"],
  ".topbar > .stat-pill:nth-child(6) .stat-label": ["Turno", "Turn"],
  ".topbar > .stat-pill:nth-child(7) .stat-label": ["Nivel", "Level"],
  "#stat-level": ["1 · Novato", "1 · Rookie"],
  ".race-box > .race-row:nth-child(1) .race-label": ["👤 Tú — ", "👤 You — ", "first"],
  ".race-box > .race-row:nth-child(3) .race-label": ["🤖 IA — ", "🤖 AI — ", "first"],
  ".market-tape": ["Movimiento del mercado", "Market movement", "aria"],
  ".col-left .panel:nth-child(1) .section-label": ["MERCADO — selecciona una acción", "MARKET — pick a stock"],
  ".log-panel .section-label": ["ACTIVIDAD", "ACTIVITY"],
  ".tab-btn[data-tab='trade']": ["📊 Operar", "📊 Trade"],
  ".tab-btn[data-tab='portfolio']": ["💼 Portafolio", "💼 Portfolio"],
  ".tab-btn[data-tab='news']": ["📰 Noticias", "📰 News"],
  ".tab-btn[data-tab='missions']": ["🎯 Misiones", "🎯 Missions"],
  ".tab-btn[data-tab='history']": ["📋 Historial", "📋 History"],
  "#trade-empty": ["← Selecciona una acción del mercado", "← Select a stock from the market"],
  ".detail-grid .detail-stat:nth-child(1) span": ["Ultimo mov.", "Last move"],
  ".detail-grid .detail-stat:nth-child(2) span": ["Rango", "Range"],
  ".detail-grid .detail-stat:nth-child(3) span": ["Tendencia", "Trend"],
  ".detail-grid .detail-stat:nth-child(4) span": ["Sesion", "Session"],
  ".detail-grid .detail-stat:nth-child(5) span": ["Tu posicion", "Your position"],
  ".qty-label": ["CANTIDAD", "AMOUNT"],
  "#cost-row": ["Costo total: <strong>—</strong>", "Total cost: <strong>—</strong>", "html"],
  "#btn-buy": ["COMPRAR", "BUY"],
  "#btn-sell": ["VENDER", "SELL"],
  "#tab-portfolio .panel:nth-child(1) .section-label": ["RESUMEN DEL PORTAFOLIO", "PORTFOLIO SUMMARY"],
  "#tab-portfolio .panel:nth-child(2) .section-label": ["ANÁLISIS DE RIESGO", "RISK ANALYSIS"],
  "#tab-portfolio .panel:nth-child(3) .section-label": ["POSICIONES", "POSITIONS"],
  "#tab-news .section-label": ["NOTICIAS DEL MERCADO", "MARKET NEWS"],
  "#tab-news .empty-msg": ["Sin noticias aún", "No news yet"],
  "#tab-missions .section-label": ["MISIONES", "MISSIONS"],
  "#tab-history .section-label": ["HISTORIAL DE OPERACIONES", "TRADE HISTORY"],
  "#tab-history .empty-msg": ["Sin operaciones aún", "No trades yet"],
  ".quick-stats .qs-row:nth-child(1) .qs-label": ["Efectivo disponible", "Available cash"],
  ".quick-stats .qs-row:nth-child(2) .qs-label": ["Rival IA", "AI rival"],
  ".quick-stats .qs-row:nth-child(3) .qs-label": ["Meta restante", "Remaining goal"],
  "#btn-pause": ["Ⅱ PAUSA", "Ⅱ PAUSE"],
  "#btn-turn": ["SIGUIENTE TURNO →", "NEXT TURN →"],
  "#btn-restart": ["JUGAR DE NUEVO", "PLAY AGAIN"],
  "#tutorial-overlay .tutorial-brand": ["STOCK WARS // ACADEMIA", "STOCK WARS // ACADEMY"],
  "#btn-tutorial-close": ["Cerrar tutorial", "Close tutorial", "aria"],
  "#btn-tutorial-skip": ["SALTAR TUTORIAL", "SKIP TUTORIAL"],
  "#btn-tutorial-prev": ["&larr; ATRÁS", "&larr; BACK", "html"],
  "#btn-tutorial-next": ["SIGUIENTE &rarr;", "NEXT &rarr;", "html"],
  "#btn-tutorial-start": ["EMPEZAR A JUGAR", "START PLAYING"],
  "#quick-help-overlay .tutorial-brand": ["STOCK WARS // SOPORTE", "STOCK WARS // SUPPORT"],
  "#btn-help-close": ["Cerrar ayuda", "Close help", "aria"],
  ".help-shell h2": ["CENTRO DE AYUDA", "HELP CENTER"],
  ".help-intro": ["Consulta lo esencial y vuelve al mercado cuando quieras.", "Check the essentials and come back to the market whenever you want."],
  ".help-grid .help-card:nth-child(1) strong": ["ELIGE", "PICK"],
  ".help-grid .help-card:nth-child(1) p": ["Selecciona una acción para ver su precio, gráfico y tendencia.", "Select a stock to see its price, chart and trend."],
  ".help-grid .help-card:nth-child(2) strong": ["OPERA", "TRADE"],
  ".help-grid .help-card:nth-child(2) p": ["Compra con efectivo disponible o vende acciones de tu portafolio.", "Buy with available cash or sell shares from your portfolio."],
  ".help-grid .help-card:nth-child(3) strong": ["OBSERVA", "WATCH"],
  ".help-grid .help-card:nth-child(3) p": ["Los eventos y las noticias pueden mover sectores completos.", "Events and news can move entire sectors."],
  ".help-grid .help-card:nth-child(4) strong": ["AVANZA", "ADVANCE"],
  ".help-grid .help-card:nth-child(4) p": ["Pulsa SIGUIENTE TURNO para actualizar precios y dejar actuar a la IA.", "Press NEXT TURN to update prices and let the AI act."],
  ".help-tip": ["<strong>Atajos:</strong> <kbd>B</kbd> comprar · <kbd>S</kbd> vender · <kbd>ENTER</kbd> siguiente turno · <kbd>ESC</kbd> pausa", "<strong>Shortcuts:</strong> <kbd>B</kbd> buy · <kbd>S</kbd> sell · <kbd>ENTER</kbd> next turn · <kbd>ESC</kbd> pause", "html"],
  "#btn-help-tutorial": ["ABRIR TUTORIAL", "OPEN TUTORIAL"],
  "#btn-help-guided": ["TUTORIAL GUIADO", "GUIDED TUTORIAL"],
  "#btn-guided-close": ["CERRAR GUÍA", "CLOSE GUIDE"],
  "#pause-menu .overlay-title": ["PAUSA", "PAUSED"],
  "#btn-continue": ["CONTINUAR", "RESUME"],
  "#btn-pause-restart": ["REINICIAR PARTIDA", "RESTART GAME"],
  "#btn-pause-menu": ["VOLVER AL MENÚ", "BACK TO MENU"],
  "#restart-confirm .overlay-title": ["⚠ CONFIRMAR", "⚠ CONFIRM"],
  "#restart-confirm .overlay-sub": ["¿Seguro que quieres reiniciar? Se perderá todo el progreso de esta partida.", "Are you sure you want to restart? All progress in this game will be lost."],
  "#btn-restart-yes": ["SÍ, REINICIAR", "YES, RESTART"],
  "#btn-restart-no": ["CANCELAR", "CANCEL"]
};

const TRAD_TITLE = ["Stock Wars — Mercado de Acciones", "Stock Wars — Stock Market"];

function aplicarIdioma() {
  const i = langActual() === "en" ? 1 : 0;
  Object.entries(TRAD).forEach(([sel, def]) => {
    const txt = def[i], modo = def[2];
    document.querySelectorAll(sel).forEach(el => {
      if (modo === "html") el.innerHTML = txt;
      else if (modo === "aria") el.setAttribute("aria-label", txt);
      else if (modo === "first") {
        const tn = Array.from(el.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
        if (tn) tn.textContent = txt;
      } else el.textContent = txt;
    });
  });
  document.title = TRAD_TITLE[i];
  document.documentElement.lang = langActual();
}

/* ── FRASES DINÁMICAS ────────────────────────────── */
const UI = {
  acc: { es: n => `${n} acc.`, en: n => `${n} sh.` },
  tienes: { es: (q, v) => `Tienes ${q} acc. · Valor: ${fmt(v)}`, en: (q, v) => `You own ${q} sh. · Value: ${fmt(v)}` },
  sinPos: { es: "SIN POSICIÓN", en: "NO POSITION" },
  alcista: { es: "ALCISTA", en: "BULLISH" },
  bajista: { es: "BAJISTA", en: "BEARISH" },
  lateral: { es: "LATERAL", en: "SIDEWAYS" },
  costo: { es: "Costo total: ", en: "Total cost: " },
  portVacio: { es: "Sin acciones todavía", en: "No stocks yet" },
  mercadoAbierto: { es: "MERCADO ABIERTO", en: "MARKET OPEN" },
  sinFondos: { es: "Fondos insuficientes", en: "Not enough funds" },
  sinAcc: { es: "No tienes acciones", en: "You have no shares" },
  pocasAcc: { es: "No tienes suficientes acciones", en: "You don't have enough shares" },
  recibido: { es: v => `${v} recibidos`, en: v => `${v} received` },
  compraste: { es: (q, t) => `+${q} ${t} compradas`, en: (q, t) => `+${q} ${t} bought` },
  aperturaLog: { es: "— Mercado abierto. ¡Suerte! —", en: "— Market open. Good luck! —" },
  logCompraRapida: { es: (t, p) => `COMPRA RÁPIDA: 1x ${t} @ ${p}`, en: (t, p) => `QUICK BUY: 1x ${t} @ ${p}` },
  logVentaRapida: { es: (t, p) => `VENTA RÁPIDA: 1x ${t} @ ${p}`, en: (t, p) => `QUICK SELL: 1x ${t} @ ${p}` },
  logCompra: { es: (q, t, p, c) => `COMPRA: ${q}× ${t} @ ${p} = ${c}`, en: (q, t, p, c) => `BUY: ${q}× ${t} @ ${p} = ${c}` },
  logVenta: { es: (q, t, p, r) => `VENTA: ${q}× ${t} @ ${p} = ${r}`, en: (q, t, p, r) => `SELL: ${q}× ${t} @ ${p} = ${r}` },
  rivalLog: { es: v => `🤖 IA opera · total rival: ${v}`, en: v => `🤖 AI trading · rival total: ${v}` },
  ganaste: { es: "¡GANASTE!", en: "YOU WIN!" },
  gameOver: { es: "GAME OVER", en: "GAME OVER" },
  ultimaHora: { es: "ÚLTIMA HORA", en: "BREAKING NEWS" },
  btnPausa: { es: p => p ? "▶ CONTINUAR" : "Ⅱ PAUSA", en: p => p ? "▶ RESUME" : "Ⅱ PAUSE" },
  stats: { es: (g, w, b) => `Partidas: ${g} · Victorias: ${w} · Mejor: ${b}`, en: (g, w, b) => `Games: ${g} · Wins: ${w} · Best: ${b}` },
  paso: { es: (n, m) => `PASO ${n} DE ${m}`, en: (n, m) => `STEP ${n} OF ${m}` },
  protocolo: { es: n => `PROTOCOLO DE APRENDIZAJE // ${n}`, en: n => `LEARNING PROTOCOL // ${n}` },
  guia: { es: (n, m) => `GUÍA ${n}/${m}`, en: (n, m) => `GUIDE ${n}/${m}` },
  terminar: { es: "TERMINAR", en: "FINISH" },
  siguiente: { es: "SIGUIENTE →", en: "NEXT →" },
  sinPartida: { es: "Inicia una partida para usar la guía visual.", en: "Start a game to use the visual guide." },
  tutorialOk: { es: "Tutorial completado. El mercado te espera.", en: "Tutorial complete. The market awaits." }
};

/* ── DATOS DEL JUEGO (bilingües) ─────────────────── */
const GOAL = 20000;
const START_CASH = 10000;

const STOCK_DEFS = [
  { ticker:"NXCR", name:"NexaCorp", sector:{es:"Tech",en:"Tech"}, sectorClass:"tag-Tech", vol:0.10, basePrice:120, color:"#a78bfa" },
  { ticker:"AURM", name:"Aurum Bank", sector:{es:"Finanzas",en:"Finance"}, sectorClass:"tag-Finanzas", vol:0.04, basePrice:90, color:"#fbbf24" },
  { ticker:"VRDX", name:"VerdeX", sector:{es:"Energía",en:"Energy"}, sectorClass:"tag-Energía", vol:0.07, basePrice:150, color:"#34d399" },
  { ticker:"MNRV", name:"MinerVa", sector:{es:"Minería",en:"Mining"}, sectorClass:"tag-Minería", vol:0.11, basePrice:60, color:"#f87171" },
  { ticker:"HLTH", name:"HealthPlus", sector:{es:"Salud",en:"Health"}, sectorClass:"tag-Salud", vol:0.06, basePrice:200, color:"#60a5fa" }
];

const EVENTS = [
  { name:{es:"💻 Boom Tecnológico",en:"💻 Tech Boom"}, desc:{es:"NXCR sube fuerte. AURM cae.",en:"NXCR surges. AURM falls."}, effect:{NXCR:.35,AURM:-.12} },
  { name:{es:"🦠 Pandemia Mundial",en:"🦠 Global Pandemic"}, desc:{es:"HLTH explota. Materias primas sufren.",en:"HLTH explodes. Commodities suffer."}, effect:{HLTH:.50,VRDX:-.15,MNRV:-.10} },
  { name:{es:"⚡ Crisis Energética",en:"⚡ Energy Crisis"}, desc:{es:"VRDX y MNRV suben. Economía tensa.",en:"VRDX and MNRV rise. The economy strains."}, effect:{VRDX:.40,MNRV:.25,AURM:-.08} },
  { name:{es:"🏦 Escándalo Bancario",en:"🏦 Banking Scandal"}, desc:{es:"AURM se desploma. Pánico general.",en:"AURM crashes. Widespread panic."}, effect:{AURM:-.45,NXCR:-.10} },
  { name:{es:"💎 Mineral Descubierto",en:"💎 Mineral Discovered"}, desc:{es:"MNRV explota. VerdeX pierde.",en:"MNRV explodes. VerdeX drops."}, effect:{MNRV:.60,VRDX:-.12} },
  { name:{es:"⚖️ Regulación Tech",en:"⚖️ Tech Regulation"}, desc:{es:"NXCR y HLTH bajan por nuevas leyes.",en:"NXCR and HLTH fall under new laws."}, effect:{NXCR:-.25,HLTH:-.15} },
  { name:{es:"💊 Cura Milagrosa",en:"💊 Miracle Cure"}, desc:{es:"HLTH sube mucho. El resto neutro.",en:"HLTH surges. Everything else stays neutral."}, effect:{HLTH:.45} },
  { name:{es:"🌿 Boom Renovable",en:"🌿 Renewable Boom"}, desc:{es:"VRDX se dispara. MNRV cae.",en:"VRDX soars. MNRV falls."}, effect:{VRDX:.38,MNRV:-.20} },
  { name:{es:"📉 Recesión Global",en:"📉 Global Recession"}, desc:{es:"Todo el mercado cae. Hay oportunidades.",en:"The whole market falls. Opportunities appear."}, effect:{NXCR:-.20,AURM:-.25,VRDX:-.18,MNRV:-.22,HLTH:-.15} },
  { name:{es:"🤝 Fusión Corporativa",en:"🤝 Corporate Merger"}, desc:{es:"NXCR y HLTH se alían. Ambas suben.",en:"NXCR and HLTH join forces. Both rise."}, effect:{NXCR:.22,HLTH:.18} }
];

const HINTS = [
  { es:"Algo bueno se avecina para el sector tecnológico...", en:"Something good is coming for the tech sector..." },
  { es:"Los bancos podrían estar en problemas pronto.", en:"The banks could be in trouble soon." },
  { es:"El sector energético podría moverse esta semana.", en:"The energy sector could move this week." },
  { es:"Rumores de un gran descubrimiento en minería.", en:"Rumors of a big mining discovery." },
  { es:"El sector salud podría protagonizar el próximo movimiento.", en:"The health sector could lead the next move." }
];

let G = {};
let paused = false;
let stats = JSON.parse(localStorage.getItem("stockWarsStats") || '{"games":0,"wins":0,"losses":0,"best":10000}');

const TUTORIAL_COMPLETED_KEY = "stockWarsTutorialCompleted";
const TUTORIAL_SEEN_KEY = "stockWarsTutorialSeen";
const GUIDED_SEEN_KEY = "stockWarsGuidedSeen";

/* ── TUTORIAL (bilingüe) ─────────────────────────── */
const TUTORIAL_STEPS = [
  { kicker:{es:"PRIMER CONTACTO",en:"FIRST CONTACT"}, title:{es:"Bienvenido a Stock Wars",en:"Welcome to Stock Wars"}, focus:["#screen-intro .rules-box"],
    content:{es:`
      <div class="tutorial-hero-copy"><span class="tutorial-index">01</span><div>
        <p class="tutorial-lead">Stock Wars es un juego de estrategia financiera. Invierte en empresas, lee el mercado y supera a la IA rival.</p>
        <p>No se trata solo de comprar y esperar: cada turno exige decidir cuándo entrar, cuándo salir y cuánto riesgo aceptar.</p>
      </div></div>
      <div class="tutorial-metrics"><div><span>CAPITAL INICIAL</span><strong>$10,000</strong></div><div><span>META</span><strong>$20,000</strong></div><div><span>RIVAL</span><strong>IA</strong></div></div>
      <div class="tutorial-callout"><strong>Tu misión:</strong> hacer crecer tu capital antes que la IA sin quedarte sin fondos.</div>`,
    en:`
      <div class="tutorial-hero-copy"><span class="tutorial-index">01</span><div>
        <p class="tutorial-lead">Stock Wars is a financial strategy game. Invest in companies, read the market and beat the rival AI.</p>
        <p>It's not just buying and waiting: every turn demands deciding when to enter, when to exit and how much risk to take.</p>
      </div></div>
      <div class="tutorial-metrics"><div><span>STARTING CAPITAL</span><strong>$10,000</strong></div><div><span>GOAL</span><strong>$20,000</strong></div><div><span>RIVAL</span><strong>AI</strong></div></div>
      <div class="tutorial-callout"><strong>Your mission:</strong> grow your capital before the AI does, without running out of money.</div>`} },
  { kicker:{es:"LECTURA DEL MERCADO",en:"READING THE MARKET"}, title:{es:"Conoce las acciones",en:"Meet the stocks"}, focus:["#stocks-list"],
    content:{es:`
      <p class="tutorial-lead">Cada acción representa una empresa. Su precio cambia según los movimientos normales y los eventos del mercado.</p>
      <div class="tutorial-stock-list">
        <div><b style="color:#a78bfa">NXCR</b><span>NexaCorp</span><em>Tecnología</em></div>
        <div><b style="color:#fbbf24">AURM</b><span>Aurum Bank</span><em>Finanzas</em></div>
        <div><b style="color:#34d399">VRDX</b><span>VerdeX</span><em>Energía</em></div>
        <div><b style="color:#f87171">MNRV</b><span>MinerVa</span><em>Minería</em></div>
        <div><b style="color:#60a5fa">HLTH</b><span>HealthPlus</span><em>Salud</em></div>
      </div>
      <div class="tutorial-split-cards">
        <div><strong>PRECIO</strong><p>Lo que cuesta comprar una acción ahora.</p></div>
        <div><strong>GRÁFICO</strong><p>La línea muestra el historial reciente: arriba sube, abajo baja.</p></div>
        <div><strong>TENDENCIA</strong><p><span class="green">ALCISTA</span>, <span class="red">BAJISTA</span> o <span class="amber">LATERAL</span> resume el impulso.</p></div>
      </div>`,
    en:`
      <p class="tutorial-lead">Each stock represents a company. Its price changes with normal market movement and market events.</p>
      <div class="tutorial-stock-list">
        <div><b style="color:#a78bfa">NXCR</b><span>NexaCorp</span><em>Technology</em></div>
        <div><b style="color:#fbbf24">AURM</b><span>Aurum Bank</span><em>Finance</em></div>
        <div><b style="color:#34d399">VRDX</b><span>VerdeX</span><em>Energy</em></div>
        <div><b style="color:#f87171">MNRV</b><span>MinerVa</span><em>Mining</em></div>
        <div><b style="color:#60a5fa">HLTH</b><span>HealthPlus</span><em>Health</em></div>
      </div>
      <div class="tutorial-split-cards">
        <div><strong>PRICE</strong><p>What it costs to buy one share right now.</p></div>
        <div><strong>CHART</strong><p>The line shows recent history: up means rising, down means falling.</p></div>
        <div><strong>TREND</strong><p><span class="green">BULLISH</span>, <span class="red">BEARISH</span> or <span class="amber">SIDEWAYS</span> sums up the momentum.</p></div>
      </div>`} },
  { kicker:{es:"PRIMERA OPERACIÓN",en:"FIRST TRADE"}, title:{es:"Comprar una acción",en:"Buying a stock"}, focus:["#btn-buy"],
    content:{es:`
      <div class="tutorial-action-layout"><div>
        <p class="tutorial-lead">Comprar significa gastar parte de tu efectivo para adquirir acciones.</p>
        <p>Selecciona una empresa, elige la cantidad y pulsa <strong class="green">COMPRAR</strong>. Las acciones pasan a tu portafolio.</p>
      </div>
      <div class="tutorial-example buy-example"><span>EJEMPLO</span><strong>5 &times; $100 = $500</strong><small>Tu efectivo baja $500 y recibes 5 acciones.</small></div></div>
      <div class="tutorial-callout"><strong>Consejo:</strong> no comprometas todo tu efectivo en una sola empresa; guarda margen para nuevas oportunidades.</div>`,
    en:`
      <div class="tutorial-action-layout"><div>
        <p class="tutorial-lead">Buying means spending part of your cash to acquire shares.</p>
        <p>Pick a company, choose the quantity and press <strong class="green">BUY</strong>. The shares go to your portfolio.</p>
      </div>
      <div class="tutorial-example buy-example"><span>EXAMPLE</span><strong>5 &times; $100 = $500</strong><small>Your cash drops $500 and you receive 5 shares.</small></div></div>
      <div class="tutorial-callout"><strong>Tip:</strong> don't commit all your cash to one company; keep margin for new opportunities.</div>`} },
  { kicker:{es:"SALIDA ESTRATÉGICA",en:"STRATEGIC EXIT"}, title:{es:"Vender una acción",en:"Selling a stock"}, focus:["#btn-sell"],
    content:{es:`
      <div class="tutorial-action-layout"><div>
        <p class="tutorial-lead">Vender significa deshacerte de acciones que ya tienes y recuperar dinero.</p>
        <p>Selecciona una acción de tu portafolio, indica cuántas quieres cerrar y pulsa <strong class="red">VENDER</strong>.</p>
      </div>
      <div class="tutorial-example sell-example"><span>EJEMPLO</span><strong>5 &times; $130 = $650</strong><small>Compraste a $100 y ahora recuperas $650.</small></div></div>
      <div class="tutorial-callout"><strong>Idea clave:</strong> una ganancia solo queda asegurada cuando vendes; también puedes vender para limitar una pérdida.</div>`,
    en:`
      <div class="tutorial-action-layout"><div>
        <p class="tutorial-lead">Selling means letting go of shares you own and getting money back.</p>
        <p>Select a stock from your portfolio, enter how many you want to close and press <strong class="red">SELL</strong>.</p>
      </div>
      <div class="tutorial-example sell-example"><span>EXAMPLE</span><strong>5 &times; $130 = $650</strong><small>You bought at $100 and now you get $650 back.</small></div></div>
      <div class="tutorial-callout"><strong>Key idea:</strong> a gain is only locked in when you sell; you can also sell to limit a loss.</div>`} },
  { kicker:{es:"TU CAPITAL EN TIEMPO REAL",en:"YOUR CAPITAL IN REAL TIME"}, title:{es:"Efectivo, portafolio y total",en:"Cash, portfolio and total"}, focus:["#stat-cash","#stat-port","#stat-total","#portfolio-list"],
    content:{es:`
      <p class="tutorial-lead">Estas tres cifras cuentan la historia completa de tu partida.</p>
      <div class="tutorial-metrics tutorial-finance-metrics">
        <div><span>EFECTIVO</span><strong>$7,000</strong><small>Dinero listo para comprar.</small></div>
        <div><span>PORTAFOLIO</span><strong>$4,000</strong><small>Valor actual de tus acciones.</small></div>
        <div><span>TOTAL</span><strong class="amber">$11,000</strong><small>Efectivo + portafolio.</small></div>
      </div>
      <div class="tutorial-callout"><strong>Para ganar:</strong> vigila el TOTAL. Es la cifra que avanza hacia la meta de $20,000.</div>`,
    en:`
      <p class="tutorial-lead">These three numbers tell the whole story of your run.</p>
      <div class="tutorial-metrics tutorial-finance-metrics">
        <div><span>CASH</span><strong>$7,000</strong><small>Money ready to buy.</small></div>
        <div><span>PORTFOLIO</span><strong>$4,000</strong><small>Current value of your shares.</small></div>
        <div><span>TOTAL</span><strong class="amber">$11,000</strong><small>Cash + portfolio.</small></div>
      </div>
      <div class="tutorial-callout"><strong>To win:</strong> watch the TOTAL. It's the number moving toward the $20,000 goal.</div>`} },
  { kicker:{es:"EL TIEMPO ES UNA DECISIÓN",en:"TIME IS A DECISION"}, title:{es:"Turnos y cambios del mercado",en:"Turns and market shifts"}, focus:["#btn-turn"],
    content:{es:`
      <div class="tutorial-hero-copy"><span class="tutorial-index">06</span><div>
        <p class="tutorial-lead">Cada vez que pulsas <strong class="amber">SIGUIENTE TURNO</strong>, el mercado avanza.</p>
        <p>Ese paso actualiza los precios y resuelve lo que ocurre en el mundo de Stock Wars.</p>
      </div></div>
      <div class="tutorial-sequence"><div><b>01</b><span>Cambian los precios</span></div><div><b>02</b><span>Puede aparecer un evento</span></div><div><b>03</b><span>La IA compra o vende</span></div><div><b>04</b><span>Puede llegar una pista</span></div></div>
      <div class="tutorial-callout"><strong>Antes de avanzar:</strong> revisa tu posición y decide si quieres comprar, vender o esperar.</div>`,
    en:`
      <div class="tutorial-hero-copy"><span class="tutorial-index">06</span><div>
        <p class="tutorial-lead">Every time you press <strong class="amber">NEXT TURN</strong>, the market moves forward.</p>
        <p>That step updates prices and resolves what happens in the world of Stock Wars.</p>
      </div></div>
      <div class="tutorial-sequence"><div><b>01</b><span>Prices change</span></div><div><b>02</b><span>An event may appear</span></div><div><b>03</b><span>The AI buys or sells</span></div><div><b>04</b><span>A hint may arrive</span></div></div>
      <div class="tutorial-callout"><strong>Before advancing:</strong> review your position and decide whether to buy, sell or wait.</div>`} },
  { kicker:{es:"SEÑALES DEL MUNDO",en:"SIGNALS FROM THE WORLD"}, title:{es:"Eventos, pistas y tendencias",en:"Events, hints and trends"}, focus:["#event-banner","#hint-box","#detail-chart"],
    content:{es:`
      <p class="tutorial-lead">Los eventos aleatorios pueden cambiar mucho el mercado. Una acción puede subir mientras otra cae.</p>
      <div class="tutorial-event-chips"><span>Boom Tecnológico</span><span>Pandemia Mundial</span><span>Crisis Energética</span><span>Escándalo Bancario</span><span>Mineral Descubierto</span><span>Regulación Tech</span><span>Cura Milagrosa</span><span>Boom Renovable</span><span>Recesión Global</span><span>Fusión Corporativa</span></div>
      <div class="tutorial-split-cards">
        <div><strong>PISTAS</strong><p>&ldquo;Algo bueno se avecina para el sector tecnológico...&rdquo; Orientan tu decisión, pero no garantizan el resultado.</p></div>
        <div><strong>GRÁFICO</strong><p><span class="green">Alcista</span> sube, <span class="red">bajista</span> baja y <span class="amber">lateral</span> se mueve sin dirección clara.</p></div>
      </div>`,
    en:`
      <p class="tutorial-lead">Random events can shake the market hard. One stock may soar while another crashes.</p>
      <div class="tutorial-event-chips"><span>Tech Boom</span><span>Global Pandemic</span><span>Energy Crisis</span><span>Banking Scandal</span><span>Mineral Discovered</span><span>Tech Regulation</span><span>Miracle Cure</span><span>Renewable Boom</span><span>Global Recession</span><span>Corporate Merger</span></div>
      <div class="tutorial-split-cards">
        <div><strong>HINTS</strong><p>"Something good is coming for the tech sector..." They guide your decision, but don't guarantee the outcome.</p></div>
        <div><strong>CHART</strong><p><span class="green">Bullish</span> rises, <span class="red">bearish</span> falls and <span class="amber">sideways</span> drifts with no clear direction.</p></div>
      </div>`} },
  { kicker:{es:"CONDICIONES DE VICTORIA",en:"WINNING CONDITIONS"}, title:{es:"Compite, gana y aprende de la dificultad",en:"Compete, win and learn from difficulty"}, focus:["#bar-you","#bar-rival"],
    content:{es:`
      <div class="tutorial-win-grid">
        <div class="win-rule positive"><b>GANAS</b><p>Llegas a $20,000 antes que la IA.</p></div>
        <div class="win-rule negative"><b>PIERDES</b><p>La IA llega primero o tu capital baja a $0.</p></div>
        <div class="win-rule neutral"><b>AL FINAL</b><p>Si se acaban los turnos, gana quien tenga más capital.</p></div>
      </div>
      <p class="tutorial-lead difficulty-title">Elige el ritmo que prefieras:</p>
      <div class="difficulty-cards"><div><b>FÁCIL</b><span>40 turnos</span></div><div><b>NORMAL</b><span>30 turnos</span></div><div><b>DIFÍCIL</b><span>22 turnos</span></div></div>
      <div class="tutorial-callout final-callout"><strong>Ya tienes el mapa.</strong> Lee el mercado, protege tu efectivo y haz que cada turno cuente.</div>`,
    en:`
      <div class="tutorial-win-grid">
        <div class="win-rule positive"><b>YOU WIN</b><p>You reach $20,000 before the AI.</p></div>
        <div class="win-rule negative"><b>YOU LOSE</b><p>The AI gets there first or your capital drops to $0.</p></div>
        <div class="win-rule neutral"><b>AT THE END</b><p>If turns run out, whoever has more capital wins.</p></div>
      </div>
      <p class="tutorial-lead difficulty-title">Choose your pace:</p>
      <div class="difficulty-cards"><div><b>EASY</b><span>40 turns</span></div><div><b>NORMAL</b><span>30 turns</span></div><div><b>HARD</b><span>22 turns</span></div></div>
      <div class="tutorial-callout final-callout"><strong>You have the map now.</strong> Read the market, protect your cash and make every turn count.</div>`} }
];

const GUIDED_STEPS = [
  { target:"#stocks-list", title:{es:"Selecciona una acción",en:"Select a stock"}, text:{es:"Empieza aquí: toca una empresa para ver su precio, gráfico y tendencia.",en:"Start here: tap a company to see its price, chart and trend."} },
  { target:"#btn-buy", title:{es:"Decide si comprar",en:"Decide whether to buy"}, text:{es:"Con una acción seleccionada, usa COMPRAR para invertir efectivo.",en:"With a stock selected, use BUY to invest cash."} },
  { target:"#qty-input", title:{es:"Elige la cantidad",en:"Choose the amount"}, text:{es:"Ajusta cuántas acciones quieres operar. Puedes usar +, MAX o los presets.",en:"Adjust how many shares to trade. Use +, MAX or the presets."} },
  { target:"#btn-turn", title:{es:"Avanza el mercado",en:"Advance the market"}, text:{es:"Cuando termines tu jugada, pulsa SIGUIENTE TURNO para mover precios y dejar actuar a la IA.",en:"When you're done, press NEXT TURN to move prices and let the AI act."} }
];

let tutorialIndex = 0;
let guidedIndex = 0;
let toastTimer = null;
let guidedResizeObserver = null;

/* ── LÓGICA DEL JUEGO ────────────────────────────── */
function createState(diff) {
  const maxTurns = diff === "easy" ? 40 : diff === "normal" ? 30 : 22;
  return {
    diff, maxTurns, turn:1, cash:START_CASH, portfolio:{}, buyAvg:{},
    stocks:initStocks(), rival:{cash:START_CASH,port:{},buyAvg:{}},
    activeEvent:null, eventCooldown:0, selected:null, hint:null,
    operations:0, events:0,
    log:[{ msg:{...UI.aperturaLog}, type:"info", turn:1 }]
  };
}

function initStocks() {
  return STOCK_DEFS.map(def => ({ ...def, price:def.basePrice * (.85 + Math.random() * .3), history:[] })).map(stock => {
    let p = stock.price;
    const history = [];
    for (let i = 0; i < 10; i++) { p = Math.max(1, p * (1 + (Math.random() - .5) * .06)); history.push(p); }
    history[history.length - 1] = stock.price;
    return { ...stock, history };
  });
}

function fmt(n) {
  return "$" + Math.round(n).toLocaleString(langActual() === "en" ? "en-US" : "es");
}

function fmtPct(n) { return (n >= 0 ? "+" : "") + n.toFixed(2) + "%"; }

function portfolioValue(cash, port, stocks) {
  return cash + stocks.reduce((acc, s) => acc + (port[s.ticker] || 0) * s.price, 0);
}

function pointsForHistory(history, W, H, pad = 2) {
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  return history.map((v, i) => ({ x:(i/(history.length-1))*W, y:H-pad-((v-min)/range)*(H-pad*2), v }));
}

function sparklineSVG(history, color) {
  if (history.length < 2) return "";
  const W = 100, H = 30;
  const pts = pointsForHistory(history, W, H, 3).map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const last = pointsForHistory(history, W, H, 3).at(-1);
  return `<svg class="sparkline-svg" viewBox="0 0 ${W} ${H}">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="5" opacity=".2" stroke-linejoin="round" stroke-linecap="round"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${last.x.toFixed(1)}" cy="${last.y.toFixed(1)}" r="2.2" fill="${color}"/>
  </svg>`;
}

function chartSVG(history, color) {
  if (history.length < 2) return "";
  const W = 320, H = 126;
  const points = pointsForHistory(history, W, H, 12);
  const line = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `0,${H} ${line} ${W},${H}`;
  const last = points.at(-1);
  return `<svg class="detail-chart-svg" viewBox="0 0 ${W} ${H}">
    <line class="chart-grid" x1="0" y1="31.5" x2="${W}" y2="31.5"/>
    <line class="chart-grid" x1="0" y1="63" x2="${W}" y2="63"/>
    <line class="chart-grid" x1="0" y1="94.5" x2="${W}" y2="94.5"/>
    <polygon points="${area}" fill="${color}" opacity=".12"/>
    <polyline points="${line}" fill="none" stroke="${color}" stroke-width="7" opacity=".18" stroke-linejoin="round" stroke-linecap="round"/>
    <polyline points="${line}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${last.x.toFixed(1)}" cy="${last.y.toFixed(1)}" r="4" fill="${color}"/>
  </svg>`;
}

function renderStocks() {
  const container = document.getElementById("stocks-list");
  if (!container) return;
  container.innerHTML = "";

  G.stocks.forEach(s => {
    const prev = s.history.length > 1 ? s.history[s.history.length-2] : s.price;
    const chg = (s.price - prev) / prev * 100;
    const up = chg >= 0;
    const clr = up ? "var(--green)" : "var(--red)";
    const ownedQ = G.portfolio[s.ticker] || 0;

    const div = document.createElement("div");
    div.className = ["stock-item", up ? "is-up" : "is-down", G.selected === s.ticker ? "selected" : ""].filter(Boolean).join(" ");
    div.dataset.ticker = s.ticker;

    div.innerHTML = `
      <div class="stock-head">
        <span class="s-ticker" style="color:${s.color}">${s.ticker}</span>
        <span class="s-name">${s.name}</span>
        <span class="sector-tag ${s.sectorClass}">${T(s.sector)}</span>
        ${ownedQ > 0 ? `<span class="owned-badge">${T(UI.acc)(ownedQ)}</span>` : ""}
      </div>
      <div class="stock-foot">
        <span class="s-price" style="color:${clr}">${fmt(s.price)}</span>
        <span class="s-change" style="color:${clr}">${fmtPct(chg)}</span>
        <div class="s-sparkline">${sparklineSVG(s.history, clr)}</div>
      </div>
      <div class="stock-actions">
        <button class="mini-trade mini-buy" data-action="buy" ${G.cash < s.price ? "disabled" : ""}>+1</button>
        <button class="mini-trade mini-sell" data-action="sell" ${ownedQ <= 0 ? "disabled" : ""}>-1</button>
      </div>`;

    div.addEventListener("click", () => selectStock(s.ticker));
    div.querySelectorAll(".mini-trade").forEach(btn => {
      btn.addEventListener("click", event => { event.stopPropagation(); quickTrade(s.ticker, btn.dataset.action); });
    });
    container.appendChild(div);
  });
}

function renderTradePanel() {
  const empty = document.getElementById("trade-empty");
  const active = document.getElementById("trade-active");
  if (!empty || !active) return;

  if (!G.selected) { empty.style.display = "block"; active.style.display = "none"; return; }
  empty.style.display = "none";
  active.style.display = "block";

  const s = G.stocks.find(x => x.ticker === G.selected);
  if (!s) return;

  const prev = s.history.length > 1 ? s.history[s.history.length-2] : s.price;
  const chg = (s.price - prev) / prev * 100;
  const up = chg >= 0;
  const ownedQ = G.portfolio[s.ticker] || 0;
  const color = up ? "var(--green)" : "var(--red)";

  const sessionStart = s.history[0] || s.price;
  const sessionPct = (s.price - sessionStart) / sessionStart * 100;
  const momentumStart = s.history[Math.max(0, s.history.length - 6)] || sessionStart;
  const momentumPct = (s.price - momentumStart) / momentumStart * 100;
  const low = Math.min(...s.history);
  const high = Math.max(...s.history);
  const avg = G.buyAvg[s.ticker] || s.price;
  const positionPct = ownedQ > 0 ? ((s.price - avg) / avg) * 100 : 0;

  const trend = momentumPct > 1.2 ? T(UI.alcista) : momentumPct < -1.2 ? T(UI.bajista) : T(UI.lateral);

  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };

  set("sel-ticker", s.ticker);
  set("sel-name", s.name);
  set("sel-price", fmt(s.price));
  set("sel-owned", T(UI.tienes)(ownedQ, ownedQ * s.price));

  const ticker = document.getElementById("sel-ticker");
  if (ticker) ticker.style.color = s.color;
  const price = document.getElementById("sel-price");
  if (price) price.style.color = color;
  const chart = document.getElementById("detail-chart");
  if (chart) chart.innerHTML = chartSVG(s.history, color);

  set("detail-change", fmtPct(chg));
  set("detail-range", `${fmt(low)} - ${fmt(high)}`);
  set("detail-trend", trend);
  set("detail-session", fmtPct(sessionPct));
  set("detail-position", ownedQ > 0 ? fmtPct(positionPct) : T(UI.sinPos));

  updateCost();

  const buy = document.getElementById("btn-buy");
  const sell = document.getElementById("btn-sell");
  if (buy) buy.disabled = G.cash < s.price;
  if (sell) sell.disabled = ownedQ <= 0;

  const hintBox = document.getElementById("hint-box");
  if (hintBox) {
    if (G.hint) { hintBox.style.display = "block"; hintBox.textContent = "💡 " + T(G.hint); }
    else hintBox.style.display = "none";
  }
}

function updateCost() {
  if (!G.selected) return;
  const s = G.stocks.find(x => x.ticker === G.selected);
  const input = document.getElementById("qty-input");
  if (!s || !input) return;
  const qty = parseInt(input.value) || 0;
  const cost = qty * s.price;
  const canBuy = cost <= G.cash;
  const row = document.getElementById("cost-row");
  if (row) row.innerHTML = `${T(UI.costo)}<strong class="${canBuy ? "green" : "red"}">${fmt(cost)}</strong>`;
}

function setQty(value) {
  const input = document.getElementById("qty-input");
  if (!input) return;
  input.value = Math.max(1, Math.floor(value || 1));
  updateCost();
}

function maxBuyQty() {
  if (!G.selected) return 1;
  const s = G.stocks.find(x => x.ticker === G.selected);
  return Math.max(1, Math.floor(G.cash / s.price));
}

function applyQtyPreset(value) {
  if (value === "max") { setQty(maxBuyQty()); return; }
  if (value === "half") { setQty(Math.max(1, Math.floor(maxBuyQty() / 2))); return; }
  setQty(parseInt(value));
}

function nudgeQty(delta) {
  const input = document.getElementById("qty-input");
  if (!input) return;
  setQty((parseInt(input.value) || 1) + delta);
}

function renderPortfolio() {
  const container = document.getElementById("portfolio-list");
  if (!container) return;
  const entries = Object.entries(G.portfolio).filter(([, q]) => q > 0);

  if (!entries.length) { container.innerHTML = `<div class="empty-msg">${T(UI.portVacio)}</div>`; return; }
  container.innerHTML = "";

  entries.forEach(([ticker, qty]) => {
    const s = G.stocks.find(x => x.ticker === ticker);
    if (!s) return;
    const val = qty * s.price;
    const avg = G.buyAvg[ticker] || s.price;
    const gl = val - avg * qty;
    const pct = (gl / (avg * qty)) * 100;

    const row = document.createElement("div");
    row.className = "port-row";
    row.innerHTML = `
      <span class="port-ticker" style="color:${s.color}">${ticker}</span>
      <span class="port-qty">${T(UI.acc)(qty)}</span>
      <span class="port-val">${fmt(val)}</span>
      <span class="port-gl ${gl >= 0 ? "green" : "red"}">${gl >= 0 ? "+" : ""}${pct.toFixed(1)}%</span>`;
    container.appendChild(row);
  });
}

function renderStats() {
  const portVal = G.stocks.reduce((acc, s) => acc + (G.portfolio[s.ticker] || 0) * s.price, 0);
  const total = G.cash + portVal;
  const rivalTotal = portfolioValue(G.rival.cash, G.rival.port, G.stocks);
  const progress = Math.min(100, total / GOAL * 100);
  const rivalProgress = Math.min(100, rivalTotal / GOAL * 100);
  const chgPct = (total - START_CASH) / START_CASH * 100;

  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };

  set("stat-cash", fmt(G.cash));
  set("stat-port", fmt(portVal));
  set("stat-total", fmt(total));
  set("stat-turn", `${G.turn}/${G.maxTurns}`);
  set("race-you-val", fmt(total));
  set("race-you-pct", `${progress.toFixed(1)}% (${fmtPct(chgPct)})`);
  set("race-rival-val", fmt(rivalTotal));
  set("race-rival-pct", rivalProgress.toFixed(1) + "%");
  set("qs-cash", fmt(G.cash));
  set("qs-rival", fmt(rivalTotal));
  set("qs-goal", fmt(Math.max(0, GOAL - total)));

  const barYou = document.getElementById("bar-you");
  const barRival = document.getElementById("bar-rival");
  if (barYou) barYou.style.width = progress + "%";
  if (barRival) barRival.style.width = rivalProgress + "%";
}

function renderMarketTape() {
  const track = document.getElementById("ticker-track");
  if (!track) return;
  const items = G.stocks.map(s => {
    const prev = s.history.length > 1 ? s.history[s.history.length-2] : s.price;
    const chg = (s.price - prev) / prev * 100;
    const up = chg >= 0;
    return `<span class="ticker-chip ${up ? "up" : "down"}"><strong>${s.ticker}</strong><span>${fmt(s.price)}</span><em>${fmtPct(chg)}</em></span>`;
  }).join("");
  track.innerHTML = items + items;
}

function renderEvent() {
  const banner = document.getElementById("event-banner");
  if (!banner) return;
  if (G.activeEvent) {
    banner.style.display = "block";
    banner.innerHTML = `<strong>${T(G.activeEvent.name)}</strong> — ${T(G.activeEvent.desc)}`;
    showNews(G.activeEvent);
  } else {
    banner.style.display = "none";
  }
}

function renderLog() {
  const container = document.getElementById("log-list");
  if (!container) return;
  container.innerHTML = "";
  G.log.forEach(entry => {
    const div = document.createElement("div");
    div.className = "log-entry " + entry.type;
    div.innerHTML = `<span class="log-turn">T${entry.turn}</span>${T(entry.msg)}`;
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
  G.selected = ticker;
  renderStocks();
  renderTradePanel();
}

function addLog(msg, type = "info") {
  G.log.unshift({ msg, type, turn: G.turn });
  if (G.log.length > 60) G.log.pop();
}

function pulseInterface(type) {
  document.body.classList.remove("pulse-buy", "pulse-sell", "pulse-turn");
  void document.body.offsetWidth;
  document.body.classList.add(`pulse-${type}`);
  setTimeout(() => document.body.classList.remove(`pulse-${type}`), 520);
}

function quickTrade(ticker, type) {
  const s = G.stocks.find(x => x.ticker === ticker);
  if (!s) return;
  G.selected = ticker;

  if (type === "buy") {
    if (G.cash < s.price) { showToast(T(UI.sinFondos), "var(--red)"); return; }
    G.cash -= s.price;
    const prevQ = G.portfolio[ticker] || 0;
    const prevAvg = G.buyAvg[ticker] || s.price;
    G.buyAvg[ticker] = (prevAvg * prevQ + s.price) / (prevQ + 1);
    G.portfolio[ticker] = prevQ + 1;
    G.operations++;
    addLog(T(UI.logCompraRapida)(ticker, fmt(s.price)) && { es:`COMPRA RÁPIDA: 1x ${ticker} @ ${fmt(s.price)}`, en:`QUICK BUY: 1x ${ticker} @ ${fmt(s.price)}` }, "buy");
    showToast(`+1 ${ticker}`, "var(--green)");
    pulseInterface("buy");
  } else {
    const owned = G.portfolio[ticker] || 0;
    if (owned <= 0) { showToast(T(UI.sinAcc), "var(--red)"); return; }
    G.cash += s.price;
    G.portfolio[ticker] = owned - 1;
    if (G.portfolio[ticker] <= 0) delete G.portfolio[ticker];
    G.operations++;
    addLog({ es:`VENTA RÁPIDA: 1x ${ticker} @ ${fmt(s.price)}`, en:`QUICK SELL: 1x ${ticker} @ ${fmt(s.price)}` }, "sell");
    showToast(T(UI.recibido)(fmt(s.price)), "var(--blue)");
    pulseInterface("sell");
  }
  renderAll();
}

function executeTrade(type) {
  if (!G.selected) return;
  const s = G.stocks.find(x => x.ticker === G.selected);
  const qty = parseInt(document.getElementById("qty-input").value) || 0;
  if (qty <= 0) return;

  if (type === "buy") {
    const cost = qty * s.price;
    if (cost > G.cash) { showToast(T(UI.sinFondos), "var(--red)"); return; }
    G.cash -= cost;
    const prevQ = G.portfolio[s.ticker] || 0;
    const prevAvg = G.buyAvg[s.ticker] || s.price;
    G.buyAvg[s.ticker] = (prevAvg * prevQ + s.price * qty) / (prevQ + qty);
    G.portfolio[s.ticker] = prevQ + qty;
    addLog({ es:`COMPRA: ${qty}× ${s.ticker} @ ${fmt(s.price)} = ${fmt(cost)}`, en:`BUY: ${qty}× ${s.ticker} @ ${fmt(s.price)} = ${fmt(cost)}` }, "buy");
    showToast(T(UI.compraste)(qty, s.ticker), "var(--green)");
    pulseInterface("buy");
  } else {
    const owned = G.portfolio[s.ticker] || 0;
    if (qty > owned) { showToast(T(UI.pocasAcc), "var(--red)"); return; }
    const revenue = qty * s.price;
    G.cash += revenue;
    G.portfolio[s.ticker] = owned - qty;
    if (G.portfolio[s.ticker] <= 0) delete G.portfolio[s.ticker];
    addLog({ es:`VENTA: ${qty}× ${s.ticker} @ ${fmt(s.price)} = ${fmt(revenue)}`, en:`SELL: ${qty}× ${s.ticker} @ ${fmt(s.price)} = ${fmt(revenue)}` }, "sell");
    showToast(T(UI.recibido)(fmt(revenue)), "var(--blue)");
    pulseInterface("sell");
  }
  G.operations++;
  renderAll();
}

function nextTurn() {
  if (paused) return;
  G.turn++;
  G.activeEvent = null;

  if (G.eventCooldown > 0) {
    G.eventCooldown--;
  } else {
    const prob = G.diff === "hard" ? .55 : G.diff === "normal" ? .40 : .28;
    if (Math.random() < prob) {
      G.activeEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      G.eventCooldown = 2;
      G.events++;
      addLog({ es:`${G.activeEvent.name.es}: ${G.activeEvent.desc.es}`, en:`${G.activeEvent.name.en}: ${G.activeEvent.desc.en}` }, "event");
    }
  }

  G.hint = null;
  if (G.diff !== "hard" && Math.random() < .35) {
    G.hint = HINTS[Math.floor(Math.random() * HINTS.length)];
  }

  G.stocks = G.stocks.map(s => {
    let change = (Math.random() - .5) * 2 * s.vol;
    if (G.activeEvent && G.activeEvent.effect[s.ticker] !== undefined) change += G.activeEvent.effect[s.ticker];
    const newPrice = Math.max(1, s.price * (1 + change));
    return { ...s, price:newPrice, history:[...s.history, newPrice].slice(-20) };
  });

  G.rival = rivalAI(G.rival, G.stocks, G.diff);
  const rivalTotal = portfolioValue(G.rival.cash, G.rival.port, G.stocks);
  addLog({ es:T(UI.rivalLog).toString() === "" ? "" : `🤖 IA opera · total rival: ${fmt(rivalTotal)}`, en:`🤖 AI trading · rival total: ${fmt(rivalTotal)}` }, "rival");

  pulseInterface("turn");
  renderAll();
  checkEndGame();
}

function rivalAI(rivalState, stocks, diff) {
  let { cash, port, buyAvg } = rivalState;

  const aggressiveness = diff === "hard" ? 0.88 : diff === "normal" ? 0.68 : 0.38;

  const analyzedStocks = stocks.map(s => {
    const history = s.history || [];
    const current = s.price;
    const previous = history.length > 1 ? history[history.length - 2] : current;
    const old = history.length > 6 ? history[history.length - 6] : history[0] || current;
    const shortTrend = previous > 0 ? (current - previous) / previous : 0;
    const mediumTrend = old > 0 ? (current - old) / old : 0;
    let score = shortTrend * 2 + mediumTrend * 1.5;
    if (mediumTrend < -0.08) score += 0.04;
    score += Math.random() * 0.025;
    return { ...s, aiScore: score };
  });

  stocks.forEach(s => {
    const owned = port[s.ticker] || 0;
    if (owned <= 0) return;
    const avg = buyAvg[s.ticker] || s.price;
    const profit = avg > 0 ? (s.price - avg) / avg : 0;
    const losing = profit < -0.10;
    const profitable = profit > 0.12;
    const shouldSell = losing || (profitable && Math.random() < (diff === "hard" ? 0.28 : diff === "normal" ? 0.18 : 0.08));
    if (!shouldSell) return;
    const percentage = diff === "hard" ? 0.35 + Math.random() * 0.45 : diff === "normal" ? 0.25 + Math.random() * 0.40 : 0.20 + Math.random() * 0.30;
    const sellQ = Math.max(1, Math.floor(owned * percentage));
    cash += sellQ * s.price;
    port = { ...port, [s.ticker]: owned - sellQ };
    if (port[s.ticker] <= 0) delete port[s.ticker];
  });

  if (Math.random() < aggressiveness) {
    const sorted = [...analyzedStocks].sort((a, b) => b.aiScore - a.aiScore);
    let target;
    if (diff === "hard") target = sorted[0];
    else if (diff === "normal") target = sorted[Math.random() < 0.75 ? 0 : Math.min(1, sorted.length - 1)];
    else target = sorted[Math.floor(Math.random() * Math.min(3, sorted.length))];

    if (!target) return { cash, port, buyAvg };

    const budgetPercent = diff === "hard" ? 0.35 + Math.random() * 0.30 : diff === "normal" ? 0.28 + Math.random() * 0.27 : 0.20 + Math.random() * 0.25;
    const budget = cash * budgetPercent;
    const qty = Math.floor(budget / target.price);

    if (qty > 0 && cash >= qty * target.price) {
      const oldQty = port[target.ticker] || 0;
      const oldAvg = buyAvg[target.ticker] || target.price;
      const newAvg = oldQty > 0 ? (oldAvg * oldQty + target.price * qty) / (oldQty + qty) : target.price;
      cash -= qty * target.price;
      port = { ...port, [target.ticker]: oldQty + qty };
      buyAvg = { ...buyAvg, [target.ticker]: newAvg };
    }
  }

  return { cash, port, buyAvg };
}

function checkEndGame() {
  const portVal = G.stocks.reduce((acc, s) => acc + (G.portfolio[s.ticker] || 0) * s.price, 0);
  const total = G.cash + portVal;
  const rivalTotal = portfolioValue(G.rival.cash, G.rival.port, G.stocks);

  if (total >= GOAL) {
    finishGame(true, total, rivalTotal, { es:`¡Alcanzaste ${fmt(total)} en el turno ${G.turn}!\nLa IA quedó en ${fmt(rivalTotal)}.`, en:`You reached ${fmt(total)} on turn ${G.turn}!\nThe AI finished at ${fmt(rivalTotal)}.` });
  } else if (total <= 0) {
    finishGame(false, total, rivalTotal, { es:`Te quedaste sin capital en el turno ${G.turn}.\nLa IA terminó con ${fmt(rivalTotal)}.`, en:`You ran out of capital on turn ${G.turn}.\nThe AI ended with ${fmt(rivalTotal)}.` });
  } else if (rivalTotal >= GOAL) {
    finishGame(false, total, rivalTotal, { es:`La IA llegó primero a ${fmt(rivalTotal)}.\nTú tenías ${fmt(total)}.`, en:`The AI reached ${fmt(rivalTotal)} first.\nYou had ${fmt(total)}.` });
  } else if (G.turn >= G.maxTurns) {
    const won = total > rivalTotal;
    finishGame(won, total, rivalTotal, {
      es: won ? `Tiempo agotado. ¡Ganaste por capital!\nTú: ${fmt(total)} · IA: ${fmt(rivalTotal)}` : `Tiempo agotado. La IA ganó por capital.\nTú: ${fmt(total)} · IA: ${fmt(rivalTotal)}`,
      en: won ? `Time's up. You won on capital!\nYou: ${fmt(total)} · AI: ${fmt(rivalTotal)}` : `Time's up. The AI won on capital.\nYou: ${fmt(total)} · AI: ${fmt(rivalTotal)}`
    });
  }
}

function finishGame(won, myTotal, rivalTotal, text) {
  endGuidedTutorial();
  closeQuickHelp();
  closeTutorial();
  stats.games++;
  if (won) stats.wins++; else stats.losses++;
  if (myTotal > stats.best) stats.best = myTotal;
  localStorage.setItem("stockWarsStats", JSON.stringify(stats));
  showEndOverlay(won, myTotal, rivalTotal, text);
}

function showToast(message, color = "var(--blue)") {
  let toast = document.getElementById("game-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "game-toast";
    toast.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.9);color:white;padding:12px 24px;border-radius:8px;font-weight:bold;z-index:10000;pointer-events:none;transition:opacity 0.3s ease";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.color = color;
  toast.style.opacity = "1";
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.style.opacity = "0"; }, 2000);
}

function setOverlayVisibility(id, visible) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove("show");
  void overlay.offsetWidth;
  if (visible) {
    overlay.style.display = "flex";
    overlay.style.visibility = "visible";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    overlay.style.zIndex = "1000";
    requestAnimationFrame(() => overlay.classList.add("show"));
    document.body.style.overflow = "hidden";
  } else {
    overlay.classList.remove("show");
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.style.visibility = "hidden";
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      const anyOverlayOpen =
        document.getElementById("quick-help-overlay")?.classList.contains("show") ||
        document.getElementById("tutorial-overlay")?.classList.contains("show");
      if (!anyOverlayOpen) document.body.style.overflow = "";
    }, 300);
  }
}

function clearTutorialFocus() {
  document.querySelectorAll(".tutorial-focus, .guided-focus, .tutorial-highlight, .guided-highlight").forEach(el => {
    el.classList.remove("tutorial-focus", "guided-focus", "tutorial-highlight", "guided-highlight");
    el.style.zIndex = "";
    el.style.position = "";
    el.style.boxShadow = "";
    el.style.border = "";
  });
  document.querySelectorAll(".tutorial-backdrop, .guided-backdrop").forEach(el => el.remove());
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

  if (!step || !content) return;

  if (label) label.textContent = T(UI.paso)(tutorialIndex + 1, TUTORIAL_STEPS.length);
  if (kicker) kicker.innerHTML = T(step.kicker);
  if (bar) bar.style.width = `${((tutorialIndex + 1) / TUTORIAL_STEPS.length) * 100}%`;

  content.innerHTML = `
    <div class="tutorial-title-row">
      <div class="tutorial-title-marker">SW</div>
      <div><h2 id="tutorial-title">${T(step.title)}</h2><span>${T(UI.protocolo)(String(tutorialIndex + 1).padStart(2, "0"))}</span></div>
    </div>
    <div class="tutorial-content-body">${T(step.content)}</div>`;

  clearTutorialFocus();
  (step.focus || []).forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.classList.add("tutorial-focus"));
  });

  if (prev) prev.disabled = tutorialIndex === 0;
  if (next) next.style.display = tutorialIndex === TUTORIAL_STEPS.length - 1 ? "none" : "inline-flex";
  if (start) start.style.display = tutorialIndex === TUTORIAL_STEPS.length - 1 ? "inline-flex" : "none";
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
  clearTutorialFocus();
  setOverlayVisibility("tutorial-overlay", false);
  ["btn-tutorial-prev", "btn-tutorial-next", "btn-tutorial-start", "btn-tutorial-close", "btn-tutorial-skip"].forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) { btn.disabled = false; btn.style.pointerEvents = ""; }
  });
  const helpOverlay = document.getElementById("quick-help-overlay");
  if (helpOverlay && helpOverlay.classList.contains("show")) setOverlayVisibility("quick-help-overlay", false);
}

function nextTutorialStep() {
  if (tutorialIndex < TUTORIAL_STEPS.length - 1) { tutorialIndex++; renderTutorialStep(); }
}

function prevTutorialStep() {
  if (tutorialIndex > 0) { tutorialIndex--; renderTutorialStep(); }
}

function ensureGameInteractivity() {
  const overlays = ["tutorial-overlay", "quick-help-overlay", "guided-tour"];
  let anyBlocking = false;
  overlays.forEach(id => {
    const overlay = document.getElementById(id);
    if (overlay && overlay.style.display !== "none") {
      const rect = overlay.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) anyBlocking = true;
    }
  });
  if (anyBlocking) { closeTutorial(); closeQuickHelp(); endGuidedTutorial(); }
  ["btn-buy", "btn-sell", "btn-turn", "btn-pause"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) { btn.style.pointerEvents = ""; btn.disabled = false; }
  });
}

function endTutorial() {
  localStorage.setItem(TUTORIAL_COMPLETED_KEY, "1");
  closeTutorial();
  if (!G || !G.stocks || !G.stocks.length) {
    setTimeout(() => { startGame(); setTimeout(ensureGameInteractivity, 100); }, 200);
  } else {
    showToast(T(UI.tutorialOk), "var(--green)");
    setTimeout(ensureGameInteractivity, 100);
  }
}

function openQuickHelp() { closeTutorial(); setOverlayVisibility("quick-help-overlay", true); }
function closeQuickHelp() { setOverlayVisibility("quick-help-overlay", false); }

function positionGuidedCard() {
  const step = GUIDED_STEPS[guidedIndex];
  const tour = document.getElementById("guided-tour");
  const card = document.getElementById("guided-card");
  if (!step || !tour || !card) return;
  const target = document.querySelector(step.target);
  if (!target) { card.style.top = "50%"; card.style.left = "50%"; card.style.transform = "translate(-50%, -50%)"; return; }

  const margin = 18, gap = 16;
  const rect = target.getBoundingClientRect();
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;

  let left = rect.left + rect.width / 2 - cardWidth / 2;
  if (left < margin) left = margin;
  if (left + cardWidth > window.innerWidth - margin) left = window.innerWidth - cardWidth - margin;

  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  let top;
  if (spaceBelow >= cardHeight + gap) top = rect.bottom + gap;
  else if (spaceAbove >= cardHeight + gap) top = rect.top - cardHeight - gap;
  else top = Math.max(margin, Math.min(window.innerHeight - cardHeight - margin, rect.top + rect.height / 2 - cardHeight / 2));

  card.style.transform = "none";
  card.style.top = `${top}px`;
  card.style.left = `${left}px`;
}

function renderGuidedStep() {
  const step = GUIDED_STEPS[guidedIndex];
  const tour = document.getElementById("guided-tour");
  const card = document.getElementById("guided-card");
  const eyebrow = document.getElementById("guided-eyebrow");
  const title = document.getElementById("guided-title");
  const text = document.getElementById("guided-text");
  const next = document.getElementById("btn-guided-next");

  if (!step || !tour || !card) return;

  tour.style.display = "block";
  tour.style.pointerEvents = "auto";
  tour.style.visibility = "visible";
  tour.style.opacity = "1";

  clearTutorialFocus();

  if (eyebrow) eyebrow.textContent = T(UI.guia)(guidedIndex + 1, GUIDED_STEPS.length);
  if (title) title.innerHTML = T(step.title);
  if (text) text.innerHTML = T(step.text);
  if (next) next.innerHTML = guidedIndex === GUIDED_STEPS.length - 1 ? T(UI.terminar) : T(UI.siguiente);

  const target = document.querySelector(step.target);
  if (target) {
    target.classList.add("guided-focus");
    target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    setTimeout(positionGuidedCard, 350);
  } else {
    positionGuidedCard();
  }

  card.classList.remove("guided-animate");
  void card.offsetWidth;
  card.classList.add("guided-animate");
}

function startGuidedTutorial() {
  if (!G || !G.stocks || !G.stocks.length) { showToast(T(UI.sinPartida), "var(--amber)"); return; }
  guidedIndex = 0;
  localStorage.setItem(GUIDED_SEEN_KEY, "1");
  closeQuickHelp();
  closeTutorial();
  renderGuidedStep();
  window.addEventListener("resize", positionGuidedCard);
  window.addEventListener("scroll", positionGuidedCard, true);
  if (guidedResizeObserver) guidedResizeObserver.disconnect();
  guidedResizeObserver = new ResizeObserver(positionGuidedCard);
  guidedResizeObserver.observe(document.getElementById("guided-card"));
}

function nextGuidedStep() {
  if (guidedIndex >= GUIDED_STEPS.length - 1) { endGuidedTutorial(); return; }
  guidedIndex++;
  renderGuidedStep();
}

function endGuidedTutorial() {
  const tour = document.getElementById("guided-tour");
  const card = document.getElementById("guided-card");
  if (tour) { tour.style.display = "none"; tour.style.pointerEvents = "none"; tour.style.visibility = "hidden"; tour.style.opacity = "0"; }
  if (card) { card.style.top = ""; card.style.left = ""; card.style.transform = ""; }
  clearTutorialFocus();
  window.removeEventListener("resize", positionGuidedCard);
  window.removeEventListener("scroll", positionGuidedCard, true);
  if (guidedResizeObserver) { guidedResizeObserver.disconnect(); guidedResizeObserver = null; }
}

function showNews(event) {
  const news = document.getElementById("news-banner") || document.getElementById("breaking-news");
  if (!news) return;
  news.innerHTML = `<span class="breaking-label">${T(UI.ultimaHora)}</span><strong>${T(event.name)}</strong><span>${T(event.desc)}</span>`;
  news.classList.remove("news-show");
  void news.offsetWidth;
  news.classList.add("news-show");
  setTimeout(() => news.classList.remove("news-show"), 5000);
}

function showEndOverlay(won, myTotal, rivalTotal, subText) {
  const overlay = document.getElementById("overlay");
  if (!overlay) return;
  const box = overlay.querySelector(".overlay-box");
  const icon = document.getElementById("ov-icon");
  const title = document.getElementById("ov-title");
  const sub = document.getElementById("ov-sub");

  if (icon) icon.textContent = won ? "🏆" : "💀";
  if (title) { title.textContent = won ? T(UI.ganaste) : T(UI.gameOver); title.className = "overlay-title " + (won ? "win" : "lose"); }
  if (sub) sub.textContent = T(subText);
  if (box) box.className = "overlay-box " + (won ? "win" : "lose");

  overlay.style.display = "flex";
  overlay.style.pointerEvents = "auto";
  overlay.style.visibility = "visible";
  overlay.style.opacity = "1";
  overlay.classList.add("show");
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const screen = document.getElementById(id);
  if (screen) screen.classList.add("active");
}

function startGame() {
  const active = document.querySelector(".diff-btn.active");
  const diff = active?.dataset.diff || "normal";
  G = createState(diff);
  paused = false;
  showScreen("screen-game");
  renderAll();
  showToast(T(UI.mercadoAbierto), "var(--green)");
}

function restartGame() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.style.pointerEvents = "none";
    overlay.style.visibility = "hidden";
    overlay.style.opacity = "0";
    overlay.classList.remove("show");
  }
  paused = false;
  showScreen("screen-intro");
}

function togglePause() {
  if (!G || !G.stocks) return;
  paused = !paused;
  const menu = document.getElementById("pause-menu") || document.getElementById("pause-overlay");
  if (menu) {
    menu.style.display = paused ? "flex" : "none";
    menu.style.pointerEvents = paused ? "auto" : "none";
    menu.style.visibility = paused ? "visible" : "hidden";
    menu.style.opacity = paused ? "1" : "0";
  }
  const pauseBtn = document.getElementById("btn-pause");
  if (pauseBtn) pauseBtn.textContent = T(UI.btnPausa)(paused);
}

function restartCurrentGame() {
  const diff = G.diff;
  paused = false;
  const menu = document.getElementById("pause-menu") || document.getElementById("pause-overlay");
  if (menu) { menu.style.display = "none"; menu.style.pointerEvents = "none"; menu.style.visibility = "hidden"; menu.style.opacity = "0"; }
  G = createState(diff);
  renderAll();
}

function showPersistentStats() {
  showToast(T(UI.stats)(stats.games, stats.wins, fmt(stats.best)), "var(--amber)");
}

/* ── EVENTOS ─────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {

  const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener("click", fn); };

  bind("btn-tutorial", () => openTutorial());
  bind("btn-tutorial-close", closeTutorial);
  bind("btn-tutorial-skip", closeTutorial);
  bind("btn-tutorial-prev", prevTutorialStep);
  bind("btn-tutorial-next", nextTutorialStep);
  bind("btn-tutorial-start", endTutorial);
  bind("btn-help", openQuickHelp);
  bind("btn-guided", startGuidedTutorial);
  bind("btn-help-close", closeQuickHelp);
  bind("btn-help-tutorial", () => openTutorial());
  bind("btn-help-guided", startGuidedTutorial);
  bind("btn-guided-next", nextGuidedStep);
  bind("btn-guided-close", endGuidedTutorial);
  bind("btn-start", startGame);
  bind("btn-turn", nextTurn);
  bind("btn-buy", () => executeTrade("buy"));
  bind("btn-sell", () => executeTrade("sell"));
  bind("btn-restart", restartGame);
  bind("btn-pause", togglePause);
  bind("btn-continue", togglePause);
  bind("btn-pause-restart", restartCurrentGame);
  bind("btn-pause-menu", () => {
    paused = false;
    const menu = document.getElementById("pause-menu");
    if (menu) { menu.style.display = "none"; menu.style.pointerEvents = "none"; menu.style.visibility = "hidden"; menu.style.opacity = "0"; }
    showScreen("screen-intro");
  });

  const tutorialOverlay = document.getElementById("tutorial-overlay");
  if (tutorialOverlay) tutorialOverlay.addEventListener("click", e => { if (e.target === tutorialOverlay) closeTutorial(); });

  const helpOverlay = document.getElementById("quick-help-overlay");
  if (helpOverlay) helpOverlay.addEventListener("click", e => { if (e.target === helpOverlay) closeQuickHelp(); });

  if (!localStorage.getItem(TUTORIAL_SEEN_KEY)) {
    setTimeout(() => {
      const intro = document.getElementById("screen-intro");
      if (intro && intro.classList.contains("active")) openTutorial();
    }, 350);
  }

  document.querySelectorAll(".diff-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const input = document.getElementById("qty-input");
  if (input) input.addEventListener("input", updateCost);

  document.querySelectorAll(".qty-step").forEach(btn => {
    btn.addEventListener("click", () => nudgeQty(parseInt(btn.dataset.step)));
  });

  document.querySelectorAll(".qty-preset").forEach(btn => {
    btn.addEventListener("click", () => applyQtyPreset(btn.dataset.qty));
  });

  document.addEventListener("keydown", event => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    const tutorialOpen = document.getElementById("tutorial-overlay")?.classList.contains("show");
    const helpOpen = document.getElementById("quick-help-overlay")?.classList.contains("show");
    const guidedOpen = document.getElementById("guided-tour")?.style.display === "block";

    if (tutorialOpen) { if (event.key === "Escape") closeTutorial(); return; }
    if (helpOpen) { if (event.key === "Escape") closeQuickHelp(); return; }
    if (guidedOpen && event.key === "Escape") { endGuidedTutorial(); return; }

    if (event.key === "Escape") { event.preventDefault(); togglePause(); }

    if (event.key === "Enter") {
      event.preventDefault();
      if (G && G.stocks && !paused) nextTurn();
    }

    if (event.key.toLowerCase() === "b" && G && G.selected && !paused) executeTrade("buy");
    if (event.key.toLowerCase() === "s" && G && G.selected && !paused) executeTrade("sell");
  });
});

/* ── SELECTOR DE IDIOMA EN EL JUEGO ──────────────── */
function refrescarIdioma() {
  aplicarIdioma();
  if (G && G.stocks && G.stocks.length) renderAll();
  if (document.getElementById("tutorial-overlay")?.classList.contains("show")) renderTutorialStep();
  const p = document.getElementById("btn-pause");
  if (p) p.textContent = T(UI.btnPausa)(!!paused);
}

(() => {
  const sel = document.createElement("select");
  sel.id = "gameLangSelect";
  sel.style.cssText = "position:fixed;bottom:14px;right:14px;z-index:900;background:#17223b;border:1px solid rgba(255,255,255,.22);border-radius:8px;color:#e8f0ff;font:700 11px 'IBM Plex Mono',monospace;padding:7px 9px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.5)";
  sel.innerHTML = '<option value="es">🇪🇸 Español</option><option value="en">🇺🇸 English</option>';
  sel.value = langActual();
  sel.addEventListener("change", () => {
    localStorage.setItem("lang", sel.value);
    refrescarIdioma();
  });
  document.body.appendChild(sel);
})();

refrescarIdioma();
window.addEventListener("storage", e => { if (e.key === "lang") refrescarIdioma(); });
document.addEventListener("langchange", refrescarIdioma);
