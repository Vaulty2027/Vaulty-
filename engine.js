import { getState, setState, addHistory } from './state.js';
import * as economy from './economy.js';
import * as world from './world.js';
import * as goals from './goals.js';
import { decisions, lifeActions, jobs, marketItems, investmentTypes, CAMPAIGN_MONTHS, difficulties } from './data.js';
import { toast } from './ui.js';

export function queueDecision() {
  const s = getState();
  const candidates = decisions.filter(item => {
    if (item.minMonth && s.month < item.minMonth) return false;
    if (item.condition && !item.condition(s, economy)) return false;
    return item.repeatable || !s.usedDecisions.includes(item.id);
  });
  const fallback = decisions.find(item => item.id === "quiet_month");
  const pool = candidates.length ? candidates : [fallback];
  const selected = pool[Math.floor(Math.random() * pool.length)];
  s.pendingDecision = { id: selected.id, resolved: false, choice: null, outcome: "" };
}

export function chooseDecision(index) {
  const s = getState();
  if (!s || s.pendingDecision.resolved) return;
  const decision = decisions.find(d => d.id === s.pendingDecision?.id) || decisions[0];
  const option = decision.options[index];
  if (!option) return;
  
  const req = checkRequirement(option.require);
  if (!req.ok) { toast(req.reason, "warn"); return; }

  applyEffect(option.effect || {});
  applyRelationshipChanges(option.relation || {});
  if (option.relationAll) economy.unlockedPeople().forEach(id => changeRelationship(id, option.relationAll[0], option.relationAll[1]));
  if (option.flags) Object.assign(s.storyFlags, option.flags);
  
  // Sistema de consecuencias a largo plazo
  if (option.consequence) {
    s.consequences.push({
      triggerMonth: s.month + option.consequence.delay,
      type: option.consequence.type,
      data: option.consequence.data
    });
  }

  s.pendingDecision.resolved = true;
  s.pendingDecision.choice = index;
  s.pendingDecision.outcome = option.outcome;
  if (!decision.repeatable && !s.usedDecisions.includes(decision.id)) s.usedDecisions.push(decision.id);
  s.decisionHistory.unshift({ month: s.month, title: decision.title, choice: option.label, outcome: option.outcome });
  addHistory("Decisión", `${decision.title}: ${option.label}.`);
  economy.adjustStats(s, { education: 1 });
  unlockRelationships();
  goals.checkGoals();
}

export function changeRelationship(id, closeness, trust) {
  const s = getState();
  const relation = s.relationships[id];
  if (!relation) return;
  if (!relation.unlocked) relation.unlocked = true; // Se desbloquea al interactuar
  relation.closeness = economy.clamp(relation.closeness + closeness, 0, 100);
  relation.trust = economy.clamp(relation.trust + trust, 0, 100);
  relation.lastInteraction = s.month;
}

export function unlockRelationships(silent = false) {
  const s = getState();
  const { people } = require('./data.js'); // En ES6 modules va arriba, pero lo mantengo así para el ejemplo
}

export function adjustStats(changes) {
  const s = getState();
  Object.entries(changes).forEach(([key, value]) => {
    if (s.stats[key] === undefined) return;
    s.stats[key] = economy.clamp(s.stats[key] + value, 0, 100);
  });
}

export function pay(amount) {
  const s = getState();
  if (amount <= 0) return true;
  if (s.cash < amount) return false;
  s.cash -= amount; return true;
}

export function checkRequirement(requirement) {
  const s = getState();
  if (!requirement) return { ok: true };
  if (requirement.cash && s.cash < requirement.cash) return { ok: false, reason: `Necesitas ${economy.money(requirement.cash)} disponibles.` };
  if (requirement.stat) {
    const [key, value] = requirement.stat;
    if ((s.stats[key] || 0) < value) return { ok: false, reason: `Necesitas ${value} de ${key}.` };
  }
  if (requirement.relationship) {
    const [id, value] = requirement.relationship;
    if (!s.relationships[id] || s.relationships[id].trust < value) return { ok: false, reason: `Necesitas ${value} de confianza.` };
  }
  return { ok: true };
}

export function applyEffect(effect) {
  const s = getState();
  ["cash", "savings", "debt", "rent", "sideIncome", "energy"].forEach(key => {
    if (effect[key] !== undefined) s[key] += effect[key];
  });
  if (effect.salaryMultiplier && s.job) s.job = { ...s.job, salary: Math.round(s.job.salary * effect.salaryMultiplier) };
  if (effect.addInventory && !s.inventory.includes(effect.addInventory)) s.inventory.push(effect.addInventory);
  if (effect.addAsset) s.assets.push({ ...effect.addAsset });
  adjustStats(effect);
  s.debt = Math.max(0, s.debt);
  s.rent = Math.max(0, s.rent);
}

export function applyRelationshipChanges(changes) {
  Object.entries(changes).forEach(([id, values]) => changeRelationship(id, values[0], values[1]));
}

export function useLifeAction(actionId) {
  const s = getState();
  const action = lifeActions.find(a => a.id === actionId);
  if (!action) return;
  const key = `action-${actionId}`;
  if (s.monthActions.includes(key)) { toast("Ya realizaste esta acción este mes.", "warn"); return; }
  if (s.energy < action.cost) { toast("No te queda suficiente tiempo.", "warn"); return; }
  
  const beforeCash = s.cash;
  const result = action.run(s, { ...economy, adjustStats, pay, hasPerk: economy.hasPerk });
  if (result === false) { s.cash = beforeCash; toast("No puedes completar esa acción ahora.", "warn"); return; }
  
  s.energy -= action.cost;
  s.monthActions.push(key);
  addHistory("Acción", `${action.title}: ${result}`);
  goals.checkGoals();
  toast(result);
}

export function advanceMonth() {
  const s = getState();
  if (!s.pendingDecision.resolved) {
    toast("Primero elige qué hacer con la decisión principal.", "warn");
    document.getElementById("decisionCard").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const openingCash = s.cash;
  const income = economy.calculateIncome();
  const expenses = economy.calculateExpenses();
  
  s.cash += income.total;
  s.cash -= expenses.total;
  s.debt = Math.max(0, s.debt - expenses.debtMinimum);

  const debtInterest = Math.round(s.debt * .0075);
  s.debt += debtInterest;
  const extraDebt = Math.min(s.debt, s.extraDebtPayment, Math.max(0, s.cash));
  s.cash -= extraDebt; s.debt -= extraDebt;

  const autoSave = Math.min(Math.max(0, s.cash), Math.round(income.total * s.autoSaveRate / 100));
  s.cash -= autoSave; s.savings += autoSave;

  const marketResult = economy.updateInvestments();
  economy.applyInflation();
  
  // El mundo evoluciona
  world.updateWorld();
  world.processConsequences();
  
  applyMonthlyWellbeing();
  maybePromote();

  if (s.cash < 0) {
    const shortfall = Math.abs(s.cash);
    s.debt += Math.round(shortfall * 1.08);
    s.cash = 0;
    s.storyFlags.wasNegative = true;
    adjustStats({ stress: 7, reputation: -2 });
    addHistory("Alerta", `El déficit del mes se convirtió en ${economy.money(Math.round(shortfall * 1.08))} de deuda.`);
  }

  s.lastMonthDelta = s.cash - openingCash;
  addHistory("Cierre", `Ingresos ${economy.money(income.total)}, gastos ${economy.money(expenses.total)}, ahorro ${economy.money(autoSave)}.`);

  s.month += 1;
  s.year = Math.floor((s.month - 1) / 12) + 1;
  s.age = s.startingAge + Math.floor((s.month - 1) / 12);
  s.energy = s.stats.stress >= 82 || s.stats.health <= 28 ? 2 : 3;
  s.monthActions = [];
  
  queueDecision();
  goals.updateDynamicGoals();
  goals.checkGoals();

  const ended = checkEndConditions();
  return { ended, marketResult, income: income.total, expenses: expenses.total, saved: autoSave, debtPaid: extraDebt, cashDelta: s.lastMonthDelta };
}

function applyMonthlyWellbeing() {
  const s = getState();
  if (s.job) {
    const pressure = Math.round(s.job.stress / 18);
    adjustStats({ stress: pressure, health: s.stats.stress > 70 ? -3 : -1, skill: 1, reputation: 1 });
    if (s.job.id === "community") adjustStats({ social: 2 });
  } else {
    adjustStats({ stress: 3, happiness: -2, skill: 1 });
  }
  if (s.inventory.includes("bike")) adjustStats({ health: 2 });
  if (s.inventory.includes("pet")) adjustStats({ happiness: 2, stress: -1 });
  if (economy.hasPerk("luna", 55)) adjustStats({ happiness: 1 });
}

function maybePromote() {
  const s = getState();
  if (!s.job) return;
  const diff = difficulties[s.difficultyKey];
  const chance = s.job.growth + s.stats.reputation / 850 + (economy.hasPerk("mateo", 55) ? .035 : 0);
  
  if (Math.random() < chance) {
    const raise = Math.round(s.job.salary * economy.random(.045, .11));
    s.job.salary += raise;
    adjustStats({ reputation: 4, happiness: 4, stress: 2 });
    addHistory("Carrera", `Recibiste un aumento de ${economy.money(raise)} al mes.`);
  } else if (Math.random() < s.job.layoffRisk * diff.layoffMod) {
    addHistory("Carrera", `Terminó tu etapa como ${s.job.title}.`);
    s.job = null; adjustStats({ stress: 10, happiness: -8, reputation: -2 });
    toast("Te despidieron. Es momento de buscar nuevas opciones.", "bad");
  }
}

export function generateJobOffers() {
  const s = getState();
  if (!s) return [];
  const diff = difficulties[s.difficultyKey];
  const networkBonus = economy.hasPerk("mateo", 55) ? 8 : 0;
  const eligible = jobs.filter(job => 
    (s.stats.education + networkBonus) >= job.minEducation && 
    (s.stats.skill + networkBonus) >= job.minSkill && 
    s.stats.reputation >= (job.minReputation || 0)
  );
  const maxOffers = Math.max(1, Math.floor(3 * diff.offerMod * (s.economicModifiers.offerReduction ? (1 - s.economicModifiers.offerReduction) : 1)));
  return [...eligible].sort(() => Math.random() - .5).slice(0, maxOffers).map(job => ({ ...job }));
}

function checkEndConditions() {
  const s = getState();
  if (s.freePlay) return false;
  if (s.stats.health <= 3) { return true; }
  if (s.debt >= 75000 && economy.calculateNetWorth() < -35000) { return true; }
  if (s.month > CAMPAIGN_MONTHS && !s.endingSeen) { return true; }
  return false;
}