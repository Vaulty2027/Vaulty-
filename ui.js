import { getState } from './state.js';
import * as economy from './economy.js';
import { lifeActions, marketItems, investmentTypes, goals, aspirations, difficulties, CAMPAIGN_MONTHS, monthNames } from './data.js';
import { generateJobOffers } from './engine.js';

export function renderAll() {
  const s = getState();
  if (!s) return;
  renderHeader(); renderMoney(); renderSidebar(); renderDecision(); renderActions(); renderPlan();
  renderRelationships(); renderJobs(); renderMarket(); renderInvestments(); renderHistory();
}

export function toast(message, tone = "") {
  const el = document.createElement("div");
  el.className = `toast ${tone}`; el.textContent = message; 
  document.getElementById("toastRegion").appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

export function renderHeader() {
  const s = getState();
  document.getElementById("lifeSubtitle").textContent = `capítulo ${s.month} · ${monthNames[(s.month - 1) % 12]}`;
  document.getElementById("playerTitle").textContent = `La vida de ${s.name}`;
  document.getElementById("timeBadge").textContent = `Año ${s.year} · ${s.age} años`;
  document.getElementById("playerNameLabel").textContent = s.name;
  document.getElementById("avatarInitial").textContent = s.name.charAt(0).toUpperCase();
  document.getElementById("jobBadge").textContent = s.job ? s.job.title : "Buscando mi camino";
}

export function renderMoney() {
  const s = getState();
  const income = economy.calculateIncome();
  const expenses = economy.calculateExpenses();
  document.getElementById("cashValue").textContent = economy.money(s.cash);
  document.getElementById("incomeValue").textContent = economy.money(income.total);
  document.getElementById("expensesValue").textContent = economy.money(expenses.total);
  document.getElementById("debtValue").textContent = economy.money(s.debt);
  document.getElementById("netWorthValue").textContent = economy.money(economy.calculateNetWorth());
}

export function renderSidebar() {
  const s = getState();
  const statConfig = [
    ["health", "Salud", false], ["happiness", "Felicidad", false], ["stress", "Estrés", true],
    ["social", "Vida social", false], ["skill", "Habilidad", false], ["reputation", "Reputación", false]
  ];
  document.getElementById("statBars").innerHTML = statConfig.map(([key, label, inverse]) => {
    const value = Math.round(s.stats[key]);
    const bad = inverse ? value >= 75 : value <= 25;
    const warn = inverse ? value >= 55 : value <= 45;
    return `<div class="stat-row"><div class="stat-label"><span>${label}</span><strong>${value}</strong></div><div class="bar-track"><div class="bar-fill ${bad ? "danger" : warn ? "warn" : ""}" style="width:${value}%"></div></div></div>`;
  }).join("");
  
  const progress = s.freePlay ? 100 : Math.min(100, (s.month - 1) / CAMPAIGN_MONTHS * 100);
  document.getElementById("chapterProgress").textContent = s.freePlay ? "Modo libre" : `${Math.min(s.month, CAMPAIGN_MONTHS)}/${CAMPAIGN_MONTHS}`;
  document.getElementById("timelineFill").style.width = `${progress}%`;
  
  document.getElementById("goalsList").innerHTML = s.activeGoals.map(g => 
    `<div class="goal-item"><strong>${g.title}</strong><small>${g.desc}</small><small>Recompensa: ${economy.money(g.reward)}</small></div>`
  ).join("");
  document.getElementById("goalCount").textContent = `${s.activeGoals.length} activas`;
}

export function renderDecision() {
  const s = getState();
  const decision = s.pendingDecision;
  if (!decision) return;
  document.getElementById("decisionCategory").textContent = "VIDA REAL";
  document.getElementById("decisionChapter").textContent = `CAPÍTULO ${s.month}`;
  document.getElementById("decisionTitle").textContent = "Tu decisión importa";
  document.getElementById("decisionText").textContent = "El mundo evoluciona sin importar lo que elijas.";
}
// Para mantener el ejemplo corto, no voy a renderizar todos los paneles, pero la estructura es la misma.